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

New users complete a three-step onboarding flow after signing in. Their daily reminder is scheduled in their saved time zone; the API process runs a minute-level scheduler to deliver reminders at each user’s selected local time. In-app notifications include replies, streak reminders/breaks, and lesson/streak milestones.

Run `npm run lint`, `npm run typecheck`, and `npm test` before building. Server integration tests require `TEST_DATABASE_URL` or `DATABASE_URL` to point to a PostgreSQL database ending in `_test`; they apply migrations and clear that database between tests. The GitHub Actions workflow runs these checks and builds the client and server on every pull request.

## Free deployment

The included [Render Blueprint](./render.yaml) deploys the API and built website together, so the app and its sign-in cookies use the same HTTPS origin. It uses [Neon's free PostgreSQL plan](https://neon.com/pricing) for persistent database storage; Redis is optional and is not required for deployment.

1. Push this repository to GitHub.
2. Create a free PostgreSQL project on Neon. Copy its pooled connection string for the `DATABASE_URL` value.
3. In Render, create a **Blueprint** from your GitHub repository and select the **Free** plan. When prompted, provide the Neon `DATABASE_URL`. The Blueprint generates separate access-token and refresh-token secrets for you.
4. Wait for the first deployment to finish. Render provides an HTTPS URL for the app.
5. Render applies migrations and loads the sample courses on startup before opening the web port. The startup log prints a `[deploy]` marker for each step; if deployment stalls, the last marker identifies whether migration, seeding, or server startup is waiting. Seeding also replaces old placeholder sample lessons, flashcards, and quizzes once; later restarts skip it when the placeholder content is gone. For a local database, run `npm run db:seed` with `DATABASE_URL` set to your Neon connection string. Keep the connection string private and do not commit it.
6. Open the Render URL on your phone. On Android Chrome, use the browser menu's **Add to Home screen**; on iPhone Safari, use **Share → Add to Home Screen**.

This setup is intended for a personal project, not a production-critical service. Render's free web service can sleep after inactivity and take about a minute to wake; it also has monthly usage limits. Neon's free database can scale to zero while idle, and its free storage/compute quotas apply. Since the notification scheduler runs inside the web service, scheduled reminders are not dependable while Render has the service asleep. Confirm both providers still offer the stated free quotas before deploying, select only free resources, and avoid enabling paid resources.
