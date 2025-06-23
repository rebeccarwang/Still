# Still — A Self-Awareness Companion

**Still** is a self-awareness toolkit designed to support users in checking in with their mood, revisiting their personal coping strategies and affirmations, and gently reflecting on their emotional state. Journaling is an optional tool within the app’s flexible, user-led flow.

This project integrates full-stack development with cloud deployment and ML-powered sentiment analysis.

---

## Project Purpose & Inspiration

During my experience volunteering in mental health support, I have seen how it can be easy for individuals to forget what helps them in times of stress. **Still** was built with this in mind: that people often know their own best strategies for self-care and resilience, but may forget them when they are most needed.

---

## Features

- **Frontend:** React.js, styled using Tailwind CSS for a responsive, clean design.
- **Backend:** Node.js with Express.js.
- **Database:** PostgreSQL with Prisma ORM for relational data modeling.
- **Authentication:** Secure session-based authentication with bcrypt-hashed passwords.
- **Adaptive Mood Check-In:** Scrollable mood selector triggers different user flows based on user input mood.
- **Branching prompts**:
  - Happy/Neutral moods → optional journaling and category tags
  - Sad moods → choose from self-care, affirmations, coping tools, journaling, or “not today”
- **Optional tags** for insights and trend tracking
- **Personal Coping Strategies:** Users can define, update, and manage their own affirmations, coping tools, and self-care actions.
- **Journaling with Sentiment Analysis:** Journal entries analyzed using a HuggingFace transformer model (`distilbert-base-uncased-finetuned-sst-2-english`), deployed as a FastAPI microservice on Azure Container Apps.
- **Mismatch Detection:** Highlights discrepancies between reported mood and analyzed journal entry sentiment and gently reprompts the user for optional further reflection.
- **API Security & Throttling:** ML microservice internally secured with an API key and rate limiting using slowapi (FastAPI middleware) to control request load.
- **Weekly Insights:** Mood trends and most frequent tags from the past week displayed to help users reflect over time.
- **Deployed Across Multiple Platforms:** Frontend hosted on Vercel, backend on Render, ML service on Azure Container Apps.

---

## Tech Stack

| Layer            | Technology                 |
|------------------|-----------------------------|
| Frontend         | React.js                   |
| Frontend Styling | Tailwind CSS               |
| Backend          | Node.js + Express          |
| Database         | PostgreSQL + Prisma ORM    |
| Authentication   | bcrypt + session-based auth|
| NLP/ML Service   | FastAPI + Hugging Face Transformers |
| Rate Limiting    | slowapi (FastAPI middleware) |
| Deployment       | Vercel (frontend), Render (backend), Azure (microservice) |

---

## ⚠️ Important Disclaimers

- This project is for **portfolio and demonstration purposes only**.
- It is not intended for production use. Please do not use it as a replacement for professional mental health support.
- It is **not licensed** for use, modification, or distribution.
- It is **not intended as a substitute for professional mental health care, diagnosis, or treatment**.
- This project was created in a **personal capacity** and is in no way to be construed as professional healthcare advice, treatment, or services.
- Users may enter personal coping strategies, self-affirmations, or self-care ideas. The app does not moderate or validate these entries and cannot ensure their safety or effectiveness.
- The project is a **learning exercise** and is **not guaranteed to meet production-level security or privacy standards**.
- This project is provided **“as is” without any warranties, express or implied**.
- Nothing in this project or documentation creates any contractual relationship, duty of care, or professional relationship.
- The author is not liable for:
  - Privacy breaches or data leaks
  - Any harm arising from the use or misuse of this app
  - Accuracy issues in mood or sentiment features
  - Any professional or personal consequences of using this project
  - Or any other losses or damages of any kind
- Use at your own risk.


---


**Thank you for exploring this personal project.**
