# 📰 Git Hub For Notes

A full-stack blog platform with AI-generated summaries and text-to-speech conversion, providing a seamless writing and reading experience.

## ✨ Features

- 🔐 Secure User Authentication with JWT
- 📝 Create, Read, and Manage Blog Posts
- 🤖 Automatic AI-generated Summaries using OpenAI GPT API
- 🎧 Text-to-Speech Conversion (Podcast-like Listening Experience)
- ⚡️ Fast & Scalable Backend with Cloudflare Workers
- 🎯 Type-safe Input Validation using Zod
- 📱 Fully Responsive and Modern UI

## 🧠 Tech Stack

### Frontend

- **React** – Component-based UI library
- **TypeScript** – Type-safe JavaScript
- **Tailwind CSS** – Utility-first styling framework
- **Vite** – Fast build tool and development server
- **React Router** – Client-side routing
- **Axios** – HTTP client for API requests

### Text-to-Speech Integration

- **Web Speech API** – Browser-native text-to-speech functionality
- **Custom Audio Controls** – Play, Pause, and Adjust Speech Settings

### Backend

- **Cloudflare Workers** – Serverless edge computing
- **Hono** – Lightweight router for Cloudflare Workers
- **Zod** – Schema validation
- **Prisma** – Type-safe ORM for PostgreSQL
- **PostgreSQL** – Robust relational database
- **JWT** – Secure authentication mechanism

### Shared

- **Common Package** – Shared types and validation schemas

### AI Integration

- **OpenAI GPT API** – Generates concise blog post summaries

## 📁 Project Structure

```
medium-replica/
│
├── frontend/         # React frontend application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── config/
│   └── vite.config.ts
│
├── backend/          # Cloudflare Workers backend
│   ├── src/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── utils/
│   └── wrangler.toml
│
└── common/           # Shared types and validation
    └── src/
        └── index.ts
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- Cloudflare account
- OpenAI API key

### Installation

1. Clone the repository

```bash
git clone https://github.com/your-username/medium-replica.git
cd medium-replica
```

2. Install dependencies

```bash
npm run install:all
```

3. Set up environment variables

- Create `.env` files in `frontend` and `backend` directories
- Add necessary configuration (API keys, database URLs)

### Running the Project

- Frontend Development

```bash
npm run dev:frontend
```

- Backend Development

```bash
npm run dev:backend
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 🎉 Acknowledgements

- [React](https://reactjs.org/)
- [Cloudflare Workers](https://workers.cloudflare.com/)
- [Prisma](https://www.prisma.io/)
- [OpenAI](https://openai.com/)
