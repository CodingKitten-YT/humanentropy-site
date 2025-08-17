# HumanEntropy

HumanEntropy is an open research project and web application designed to study human-generated randomness. The goal is to collect data, analyze patterns in human-created "random" sequences, and train machine learning models to distinguish human randomness from true randomness. This research helps us understand how humans interpret randomness and the subtle patterns that often emerge.

## 🚀 Try it out

Visit [https://humanentropy.kittendev.xyz](https://humanentropy.kittendev.xyz) and create a few random patterns!  
Your participation helps advance research in understanding human randomness.

## 📊 Project Goals

- Collect at least 1000 samples of human-generated random patterns.
- Analyze the differences between human and true random sequences.
- Train and publish ML models that can detect "human randomness."
- Share insights and dataset for further research.

## 🛠️ Technology

- [Next.js](https://nextjs.org/) for the web frontend
- [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/) for spam prevention
- SQLite database (`data/data.db`) for storing user-generated patterns

## 🏗️ Setup

Clone the repo and run:
```bash
npm install
npm run build
npm start
```

## 📚 Dataset

The collected dataset is stored in `data/data.db` (SQLite format) and is licensed under [CC BY 4.0](./DATASET_LICENSE.md).  
You are free to use, share, and remix the data with attribution.

## 📝 Contributing

Contributions are welcome!  
Please read our [Code of Conduct](./CODE_OF_CONDUCT.md) before participating.

If you’d like to help, you can:
- Improve the app’s UX or features
- Analyze the dataset
- Help with ML modeling
- Spread the word!

## 🛡️ License

- **Code**: Licensed under the [MIT License](./LICENSE)
- **Dataset (`data/data.db`)**: Licensed under [CC BY 4.0](./DATASET_LICENSE.md)

## 🙋 FAQ

**Q:** How can I contribute data?  
**A:** Simply visit [https://humanentropy.kittendev.xyz](https://humanentropy.kittendev.xyz) and create patterns.

**Q:** Can I use the dataset for my own research?  
**A:** Yes! Please give appropriate credit as per [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

**Q:** Who do I contact for questions or issues?  
**A:** Open an issue or contact [roozendaalberend@gmail.com].

---

*Made with ❤️ by CodingKitten-YT*
