# GetBetter

> **Level up your knowledge, one day at a time.**

Ever felt an itch to master a new skill or dive into a complex topic, but had zero idea where to begin? Or sat in a room full of high achievers, wishing you had deeper insights and sharper facts to bring to the table?

**You are not alone—and you no longer have to feel out of the loop.**

Welcome to **GetBetter**, an intelligent learning ecosystem designed to transform how you gain knowledge. Whether you want to master a specific subject or expand your general intellect, GetBetter turns curiosity into actionable, daily growth.

---

## 🚀 Key Features

* 🎯 **Curated Daily Micro-Lessons:** Complex topics broken down into digestible, high-impact modules that fit effortlessly into your busy routine.
* 🌐 **Any Topic, Any Skill:** From quantum computing and financial strategy to world history and design principles—explore whatever piques your interest.
* 🧠 **Smart Memory Retention:** Built-in active recall and flashcards ensure the facts and concepts you learn actually stick.
* 📊 **Habit & Streak Tracking:** Stay motivated with visual progress metrics, daily streaks, and personalized learning insights.
* 🤝 **Interactive Community:** Engage with fellow lifelong learners, exchange insights, and benchmark your growth.

---

## 🛠️ How It Works

1. **Set Your Focus:** Choose specific categories or select general knowledge mode for a daily curated blend of insights.
2. **Receive Your Daily Bite:** Spend just 5–10 minutes a day absorbing expertly structured content.
3. **Test & Retain:** Complete quick daily micro-quizzes to reinforce new concepts.
4. **Watch Yourself Grow:** Track your knowledge stats and join conversations with newfound confidence.

---

## Why GetBetter?

* 🎯 **Zero Friction:** Skip the overwhelming search. Get straight to learning.
* 💡 **Every Topic Covered:** From niche technical subjects to fascinating general knowledge.
* 📈 **Daily Upgrades:** Build a habit of getting smarter, one day at a time.

---

## 🤝 Contributing

We welcome contributions from lifelong learners and developers alike! If you'd like to improve GetBetter, feel free to fork the repository, make changes, and submit a pull request.

> *Never feel out of the loop again. Start your journey with GetBetter today!*

## Production and testing

The Express API uses Helmet, a `FRONTEND_URL` CORS allowlist, and a per-IP limit of 100 requests per 15 minutes. Set `REDIS_URL` to enable five-minute caching for topic lists and user stats; cache failures are logged and requests continue against PostgreSQL. `docker compose up -d --wait` starts the local PostgreSQL and Redis services.

Run `npm run lint`, `npm run typecheck`, and `npm test` before building. Server integration tests require `TEST_DATABASE_URL` or `DATABASE_URL` to point to a PostgreSQL database ending in `_test`; they apply migrations and clear that database between tests. The GitHub Actions workflow runs these checks and builds the client and server on every pull request.