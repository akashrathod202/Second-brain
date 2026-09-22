# 🧠 SecondBrain

**SecondBrain** is a full-stack personal knowledge management platform that helps users save, organize, search, and manage useful digital content in one centralized workspace.

Instead of losing useful resources across YouTube, LinkedIn, X, websites, and personal notes, SecondBrain provides a single place to store and organize your knowledge.

## ✨ Features

* 🔐 **Google Authentication** — Secure user authentication with Google OAuth
* 🔗 **Save Resources** — Store links, videos, notes, PDFs, and coding resources
* 🏷️ **Tags** — Organize content using custom tags
* 🔎 **Search & Filter** — Quickly find saved content
* 📚 **Collections** — Group related knowledge and resources
* ⭐ **Favorites** — Mark important content for quick access
* 👤 **User-specific Content** — Each user's content is securely associated with their account
* 📱 **Responsive UI** — Clean and modern interface across screen sizes

## 🛠️ Tech Stack

### Frontend

* React
* TypeScript
* Tailwind CSS
* Vite
* React Router
* React Icons

### Backend

* Node.js
* Express.js
* TypeScript
* REST APIs

### Database & Authentication

* MongoDB
* Mongoose
* Google OAuth
* JWT / Token-based Authentication

## 🏗️ Project Structure

```text
SecondBrain/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── routes/
│   │   └── ...
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── ...
│   └── package.json
│
└── README.md
```

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/secondbrain.git
cd secondbrain
```

### 2. Install dependencies

#### Frontend

```bash
cd frontend
npm install
```

#### Backend

```bash
cd ../backend
npm install
```

### 3. Configure environment variables

Create a `.env` file in the backend directory.

```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
```

Create the required frontend environment variables as well, depending on your local configuration.

> ⚠️ Never commit `.env` files or expose API keys, database credentials, OAuth secrets, or JWT secrets publicly.

### 4. Start the backend

```bash
cd backend
npm run dev
```

The backend will run on:

```text
http://localhost:8000
```

### 5. Start the frontend

Open another terminal:

```bash
cd frontend
npm run dev
```

The frontend will run on the Vite development URL shown in your terminal.

## 🔄 How It Works

```text
User
  ↓
Google Authentication
  ↓
SecondBrain Workspace
  ↓
Create / Save Content
  ↓
Add Tags & Organize
  ↓
Store in MongoDB
  ↓
Search / Filter / Manage
```

## 🎯 Project Goals

The main goal of SecondBrain is to create a simple and centralized digital workspace where users can capture useful information before it gets lost.

The project also focuses on building practical full-stack development skills including:

* REST API development
* Authentication & authorization
* Database design
* Protected routes
* Frontend state management
* API integration
* Component-based UI architecture
* Full-stack application structure

## 🔮 Future Improvements

* 🤖 AI-powered **Ask SecondBrain**
* 🧠 Semantic search
* 📝 AI-generated summaries
* 🔖 Browser extension for quick saving
* 📱 Mobile application
* 📄 Automatic PDF content extraction
* 🔗 Automatic metadata fetching from saved URLs
* 💡 AI-based recommendations and knowledge organization

## 📸 Screenshots

*Add screenshots of the application here.*

## 🤝 Contributing

Contributions, suggestions, and improvements are welcome.

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Commit your changes
5. Push the branch
6. Open a Pull Request

## 📄 License

This project is licensed under the **MIT License**.

---

### 👨‍💻 Author

**Akash Rathod**

Built as a full-stack development project using the MERN ecosystem.
