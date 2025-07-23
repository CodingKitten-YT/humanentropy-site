import sqlite3 from 'sqlite3'
import path from 'path'

const dbPath = path.join(process.cwd(), 'data', 'data.db')

// Initialize database with tables
export function initializeDatabase(): Promise<sqlite3.Database> {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        reject(err)
        return
      }
      
      // Create submissions table (anonymous)
      db.serialize(() => {
        // Anonymous submissions - no user identifiers
        db.run(`
          CREATE TABLE IF NOT EXISTS submissions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            points TEXT NOT NULL,
            label TEXT DEFAULT 'human',
            grid_size TEXT DEFAULT '32x32',
            features TEXT,
            timestamp_bucket TEXT,
            opted_in_for_credit BOOLEAN DEFAULT true,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `)
        
        // Contribution ledger - separate from submissions
        db.run(`
          CREATE TABLE IF NOT EXISTS contribution_ledger (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            contribution_count INTEGER DEFAULT 0,
            opted_out BOOLEAN DEFAULT false,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `)
        
        // Create index for better performance
        db.run(`
          CREATE INDEX IF NOT EXISTS idx_timestamp_bucket 
          ON submissions(timestamp_bucket)
        `)
        
        db.run(`
          CREATE INDEX IF NOT EXISTS idx_username 
          ON contribution_ledger(username)
        `)
        
        resolve(db)
      })
    })
  })
}

// Calculate comprehensive features from points for ML analysis
export function calculateFeatures(points: Array<{ x: number; y: number }>) {
  const n_points = points.length
  
  if (n_points === 0) {
    return {
      n_points: 0,
      adjacency_rate: 0,
      singleton_ratio: 0,
      mean_nn_distance: 0,
      std_nn_distance: 0,
      row_variance: 0,
      column_variance: 0,
      cluster_count: 0,
      mean_cluster_size: 0,
      max_cluster_size: 0,
      bounding_box_density: 0,
      radial_symmetry_score: 0,
      center_of_mass_x: 0,
      center_of_mass_y: 0,
      width: 0,
      height: 0,
      coverage_area: 0,
      min_x: 0,
      max_x: 0,
      min_y: 0,
      max_y: 0
    }
  }

  // Basic bounding box calculations
  const xs = points.map(p => p.x)
  const ys = points.map(p => p.y)
  const min_x = Math.min(...xs)
  const max_x = Math.max(...xs)
  const min_y = Math.min(...ys)
  const max_y = Math.max(...ys)
  const width = max_x - min_x + 1
  const height = max_y - min_y + 1
  const coverage_area = width * height

  // 1. Adjacency rate (how many points have adjacent neighbors)
  let adjacentCount = 0
  for (const point of points) {
    const hasAdjacent = points.some(other => 
      other !== point && 
      Math.abs(other.x - point.x) <= 1 && 
      Math.abs(other.y - point.y) <= 1 &&
      !(other.x === point.x && other.y === point.y)
    )
    if (hasAdjacent) adjacentCount++
  }
  const adjacency_rate = adjacentCount / n_points

  // 2. Singleton ratio (points with no adjacent neighbors)
  const singleton_ratio = (n_points - adjacentCount) / n_points

  // 3. Nearest neighbor distances
  const nn_distances: number[] = []
  for (const point of points) {
    let minDistance = Infinity
    for (const other of points) {
      if (other !== point) {
        const distance = Math.sqrt(Math.pow(other.x - point.x, 2) + Math.pow(other.y - point.y, 2))
        minDistance = Math.min(minDistance, distance)
      }
    }
    if (minDistance !== Infinity) {
      nn_distances.push(minDistance)
    }
  }
  
  const mean_nn_distance = nn_distances.length > 0 ? nn_distances.reduce((a, b) => a + b, 0) / nn_distances.length : 0
  const variance_nn = nn_distances.length > 0 ? 
    nn_distances.reduce((acc, dist) => acc + Math.pow(dist - mean_nn_distance, 2), 0) / nn_distances.length : 0
  const std_nn_distance = Math.sqrt(variance_nn)

  // 4. Row and column variance
  const row_counts = new Map<number, number>()
  const col_counts = new Map<number, number>()
  
  for (const point of points) {
    row_counts.set(point.y, (row_counts.get(point.y) || 0) + 1)
    col_counts.set(point.x, (col_counts.get(point.x) || 0) + 1)
  }
  
  const row_values = Array.from(row_counts.values())
  const col_values = Array.from(col_counts.values())
  
  const mean_row = row_values.reduce((a, b) => a + b, 0) / row_values.length
  const mean_col = col_values.reduce((a, b) => a + b, 0) / col_values.length
  
  const row_variance = row_values.reduce((acc, val) => acc + Math.pow(val - mean_row, 2), 0) / row_values.length
  const column_variance = col_values.reduce((acc, val) => acc + Math.pow(val - mean_col, 2), 0) / col_values.length

  // 5. Cluster analysis (connected components)
  const visited = new Set<string>()
  const clusters: Array<{ x: number; y: number }[]> = []
  
  for (const point of points) {
    const key = `${point.x}-${point.y}`
    if (!visited.has(key)) {
      const cluster: Array<{ x: number; y: number }> = []
      const stack = [point]
      
      while (stack.length > 0) {
        const current = stack.pop()!
        const currentKey = `${current.x}-${current.y}`
        
        if (!visited.has(currentKey)) {
          visited.add(currentKey)
          cluster.push(current)
          
          // Find adjacent points
          for (const neighbor of points) {
            const neighborKey = `${neighbor.x}-${neighbor.y}`
            if (!visited.has(neighborKey) && 
                Math.abs(neighbor.x - current.x) <= 1 && 
                Math.abs(neighbor.y - current.y) <= 1 &&
                !(neighbor.x === current.x && neighbor.y === current.y)) {
              stack.push(neighbor)
            }
          }
        }
      }
      
      if (cluster.length > 0) {
        clusters.push(cluster)
      }
    }
  }
  
  const cluster_count = clusters.length
  const cluster_sizes = clusters.map(c => c.length)
  const mean_cluster_size = cluster_sizes.length > 0 ? cluster_sizes.reduce((a, b) => a + b, 0) / cluster_sizes.length : 0
  const max_cluster_size = cluster_sizes.length > 0 ? Math.max(...cluster_sizes) : 0

  // 6. Bounding box density
  const bounding_box_density = coverage_area > 0 ? n_points / coverage_area : 0

  // 7. Center of mass
  const center_of_mass_x = xs.reduce((a, b) => a + b, 0) / n_points
  const center_of_mass_y = ys.reduce((a, b) => a + b, 0) / n_points

  // 8. Radial symmetry score (simplified)
  const grid_center_x = 15.5 // 32x32 grid center
  const grid_center_y = 15.5
  
  // Calculate distances from grid center and check for symmetry
  const radial_distances = points.map(p => 
    Math.sqrt(Math.pow(p.x - grid_center_x, 2) + Math.pow(p.y - grid_center_y, 2))
  )
  
  // Simple radial symmetry: how evenly distributed are the distances
  const mean_radial_distance = radial_distances.reduce((a, b) => a + b, 0) / radial_distances.length
  const radial_variance = radial_distances.reduce((acc, dist) => acc + Math.pow(dist - mean_radial_distance, 2), 0) / radial_distances.length
  const radial_symmetry_score = radial_variance > 0 ? 1 / (1 + radial_variance) : 1 // Inverse relationship

  return {
    n_points,
    adjacency_rate: Math.round(adjacency_rate * 1000) / 1000,
    singleton_ratio: Math.round(singleton_ratio * 1000) / 1000,
    mean_nn_distance: Math.round(mean_nn_distance * 1000) / 1000,
    std_nn_distance: Math.round(std_nn_distance * 1000) / 1000,
    row_variance: Math.round(row_variance * 1000) / 1000,
    column_variance: Math.round(column_variance * 1000) / 1000,
    cluster_count,
    mean_cluster_size: Math.round(mean_cluster_size * 1000) / 1000,
    max_cluster_size,
    bounding_box_density: Math.round(bounding_box_density * 1000) / 1000,
    radial_symmetry_score: Math.round(radial_symmetry_score * 1000) / 1000,
    center_of_mass_x: Math.round(center_of_mass_x * 1000) / 1000,
    center_of_mass_y: Math.round(center_of_mass_y * 1000) / 1000,
    width,
    height,
    coverage_area,
    min_x,
    max_x,
    min_y,
    max_y
  }
}

// Submit a pattern (anonymous)
export function submitPattern(
  db: sqlite3.Database,
  points: Array<{ x: number; y: number }>,
  optedInForCredit: boolean = true
): Promise<void> {
  return new Promise((resolve, reject) => {
    const features = calculateFeatures(points)
    const timestampBucket = new Date().toISOString().slice(0, 7) // YYYY-MM format
    
    const stmt = db.prepare(`
      INSERT INTO submissions (points, label, grid_size, features, timestamp_bucket, opted_in_for_credit)
      VALUES (?, ?, ?, ?, ?, ?)
    `)
    
    stmt.run(
      JSON.stringify(points),
      'human',
      '32x32',
      JSON.stringify(features),
      timestampBucket,
      optedInForCredit ? 1 : 0,
      (err: Error | null) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      }
    )
    
    stmt.finalize()
  })
}

// Update contribution count (separate from submissions)
export function updateContributionCount(
  db: sqlite3.Database,
  username: string,
  optedOut: boolean = false
): Promise<void> {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Insert or update contribution count
      const stmt = db.prepare(`
        INSERT INTO contribution_ledger (username, contribution_count, opted_out)
        VALUES (?, 1, ?)
        ON CONFLICT(username) DO UPDATE SET
          contribution_count = contribution_count + 1,
          opted_out = ?,
          updated_at = CURRENT_TIMESTAMP
      `)
      
      stmt.run(username, optedOut ? 1 : 0, optedOut ? 1 : 0, (err: Error | null) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
      
      stmt.finalize()
    })
  })
}

// Get leaderboard (only users who haven't opted out)
export function getLeaderboard(db: sqlite3.Database, limit: number = 10): Promise<Array<{
  username: string;
  contribution_count: number;
}>> {
  return new Promise((resolve, reject) => {
    db.all(`
      SELECT username, contribution_count
      FROM contribution_ledger
      WHERE opted_out = false AND contribution_count > 0
      ORDER BY contribution_count DESC, updated_at ASC
      LIMIT ?
    `, [limit], (err, rows) => {
      if (err) {
        reject(err)
      } else {
        resolve(rows as Array<{ username: string; contribution_count: number }>)
      }
    })
  })
}

// Get total statistics
export function getTotalStats(db: sqlite3.Database): Promise<{
  total_submissions: number;
  total_contributors: number;
  recent_submissions: number;
}> {
  return new Promise((resolve, reject) => {
    const currentMonth = new Date().toISOString().slice(0, 7)
    
    db.serialize(() => {
      db.get(`SELECT COUNT(*) as total_submissions FROM submissions`, (err, row: any) => {
        if (err) {
          reject(err)
          return
        }
        
        const total_submissions = row.total_submissions
        
        db.get(`SELECT COUNT(*) as total_contributors FROM contribution_ledger WHERE contribution_count > 0`, (err, row: any) => {
          if (err) {
            reject(err)
            return
          }
          
          const total_contributors = row.total_contributors
          
          db.get(`SELECT COUNT(*) as recent_submissions FROM submissions WHERE timestamp_bucket = ?`, [currentMonth], (err, row: any) => {
            if (err) {
              reject(err)
              return
            }
            
            const recent_submissions = row.recent_submissions
            
            resolve({
              total_submissions,
              total_contributors,
              recent_submissions
            })
          })
        })
      })
    })
  })
}

// Close database connection
export function closeDatabase(db: sqlite3.Database): Promise<void> {
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

// Reset database (WARNING: This will delete all data!)
export function resetDatabase(): Promise<void> {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        reject(err)
        return
      }
      
      db.serialize(() => {
        // Drop existing tables
        db.run(`DROP TABLE IF EXISTS submissions`, (err) => {
          if (err) console.error('Error dropping submissions table:', err)
        })
        
        db.run(`DROP TABLE IF EXISTS contribution_ledger`, (err) => {
          if (err) console.error('Error dropping contribution_ledger table:', err)
        })
        
        // Recreate tables
        db.run(`
          CREATE TABLE submissions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            points TEXT NOT NULL,
            label TEXT DEFAULT 'human',
            grid_size TEXT DEFAULT '32x32',
            features TEXT,
            timestamp_bucket TEXT,
            opted_in_for_credit BOOLEAN DEFAULT true,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `)
        
        db.run(`
          CREATE TABLE contribution_ledger (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            contribution_count INTEGER DEFAULT 0,
            opted_out BOOLEAN DEFAULT false,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `)
        
        // Recreate indexes
        db.run(`
          CREATE INDEX idx_timestamp_bucket 
          ON submissions(timestamp_bucket)
        `)
        
        db.run(`
          CREATE INDEX idx_username 
          ON contribution_ledger(username)
        `, (err) => {
          db.close((closeErr) => {
            if (err || closeErr) {
              reject(err || closeErr)
            } else {
              resolve()
            }
          })
        })
      })
    })
  })
}

// Get database statistics for monitoring
export function getDatabaseStats(db: sqlite3.Database): Promise<{
  total_submissions: number;
  total_contributors: number;
  database_size_kb: number;
  oldest_submission: string | null;
  newest_submission: string | null;
}> {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      let stats = {
        total_submissions: 0,
        total_contributors: 0,
        database_size_kb: 0,
        oldest_submission: null as string | null,
        newest_submission: null as string | null
      }

      db.get(`SELECT COUNT(*) as total FROM submissions`, (err, row: any) => {
        if (err) {
          reject(err)
          return
        }
        stats.total_submissions = row.total

        db.get(`SELECT COUNT(*) as total FROM contribution_ledger WHERE contribution_count > 0`, (err, row: any) => {
          if (err) {
            reject(err)
            return
          }
          stats.total_contributors = row.total

          db.get(`SELECT MIN(created_at) as oldest, MAX(created_at) as newest FROM submissions`, (err, row: any) => {
            if (err) {
              reject(err)
              return
            }
            stats.oldest_submission = row.oldest
            stats.newest_submission = row.newest

            // Get database file size (approximate)
            db.get(`SELECT page_count * page_size as size FROM pragma_page_count(), pragma_page_size()`, (err, row: any) => {
              if (err) {
                // If pragma fails, just return other stats
                stats.database_size_kb = 0
              } else {
                stats.database_size_kb = Math.round((row?.size || 0) / 1024)
              }
              resolve(stats)
            })
          })
        })
      })
    })
  })
}
