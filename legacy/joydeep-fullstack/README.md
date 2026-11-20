# 🎮 NEXO - International Gaming Social Media Platform

<div align="center">
  <img src="https://via.placeholder.com/800x400/0B0F19/2563EB?text=NEXO+Gaming+Social" alt="NEXO Banner" />
  
  **Facebook + Twitch + Reddit for Gamers**
  
  [![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-7-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  [![Socket.io](https://img.shields.io/badge/Socket.io-4-black?style=for-the-badge&logo=socket.io)](https://socket.io/)
</div>

---

## 📖 Overview

**NEXO** is a global-standard gaming social media MVP platform that combines the best features of Facebook, Twitch, and Reddit, specifically designed for the gaming community. It provides a unified space for gamers to connect, share content, watch streams, and build communities around their favorite games.

### ✨ Key Features

- 🔐 **Authentication System** - Secure JWT-based auth with registration & login
- 📝 **Social Feed** - Post updates with reactions (Like, Love, Fire, Sad, Angry) & comments
- 🎬 **Video Platform** - Upload and share gaming clips & highlights
- 🎮 **Game Hubs** - Reddit-style communities for each game with posts, videos, and chat
- 👻 **Anonymous Posting** - Share thoughts anonymously with hidden identities
- 📺 **Live Streaming** - Watch and broadcast live streams with real-time chat
- 💬 **Real-time Chat** - Socket.io powered live chat in game hubs and streams
- 🌙 **Dark Esports Theme** - Modern gaming aesthetic with custom UI

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Database** | MongoDB with Mongoose ODM |
| **Styling** | Tailwind CSS with custom gaming theme |
| **Authentication** | JWT + bcryptjs |
| **Real-time** | Socket.io |
| **Icons** | Lucide React |
| **Fonts** | Orbitron (headings) + Inter (body) |

---

## 🎨 Design System

### Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Background | `#0B0F19` | Main background |
| Card | `#111827` | Cards and containers |
| Navbar | `#020617` | Navigation bar |
| Primary | `#2563EB` | Primary actions |
| Live/Accent | `#EC4899` | Live badges, accents |
| Success | `#10B981` | Success states |
| Warning | `#F59E0B` | Warnings, errors |

### Typography

- **Headings**: Orbitron (gaming/esports font)
- **Body**: Inter (clean, readable)

---

## 📁 Project Structure

```
NEXO/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/                # API routes
│   │   │   ├── auth/           # Authentication endpoints
│   │   │   ├── posts/          # Posts CRUD & reactions
│   │   │   ├── videos/         # Video management
│   │   │   ├── games/          # Game hubs
│   │   │   ├── anonymous/      # Anonymous posts
│   │   │   ├── live/           # Live streaming
│   │   │   └── seed/           # Database seeding
│   │   ├── games/              # Game hub pages
│   │   │   └── [slug]/         # Individual game hub
│   │   ├── videos/             # Video pages
│   │   │   └── [id]/           # Individual video
│   │   ├── live/               # Live streaming pages
│   │   │   ├── [id]/           # Stream viewer
│   │   │   └── start/          # Start streaming
│   │   ├── anonymous/          # Anonymous posts page
│   │   ├── profile/            # User profile
│   │   ├── login/              # Login page
│   │   ├── register/           # Registration page
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   └── globals.css         # Global styles
│   │
│   ├── components/             # React components
│   │   ├── Navbar.tsx          # Navigation bar
│   │   ├── Sidebar.tsx         # Side navigation
│   │   ├── PostCard.tsx        # Feed post component
│   │   ├── CreatePost.tsx      # Post creation form
│   │   ├── VideoCard.tsx       # Video thumbnail card
│   │   ├── GameHubCard.tsx     # Game hub card
│   │   ├── ChatBox.tsx         # Real-time chat
│   │   ├── LiveStreamCard.tsx  # Live stream preview
│   │   ├── AnonymousPostCard.tsx # Anonymous post
│   │   └── index.ts            # Component exports
│   │
│   ├── context/                # React Context providers
│   │   ├── AuthContext.tsx     # Authentication state
│   │   └── SocketContext.tsx   # Socket.io connection
│   │
│   └── lib/                    # Utilities & database
│       ├── auth/
│       │   └── jwt.ts          # JWT & password utilities
│       └── db/
│           ├── connection.ts   # MongoDB connection
│           └── models/         # Mongoose models
│               ├── User.ts
│               ├── Post.ts
│               ├── Video.ts
│               ├── GameHub.ts
│               ├── AnonymousPost.ts
│               └── LiveStream.ts
│
├── server/
│   └── socket.ts               # Socket.io server
│
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── next.config.js
├── .env.example
└── .gitignore
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **MongoDB** (local or Atlas cloud)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/nexo.git
   cd nexo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/nexo
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Start MongoDB** (if running locally)
   ```bash
   # macOS with Homebrew
   brew services start mongodb-community
   
   # Windows
   net start MongoDB
   
   # Or use MongoDB Atlas cloud
   ```

5. **Seed the database** (optional but recommended)
   ```bash
   # Start the dev server first, then visit:
   # http://localhost:3000/api/seed
   ```

6. **Run the development server**
   ```bash
   # Terminal 1: Next.js app
   npm run dev
   
   # Terminal 2: Socket.io server (for real-time chat)
   npx ts-node server/socket.ts
   ```

7. **Open in browser**
   ```
   http://localhost:3000
   ```

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |

### Posts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/posts` | Get all posts |
| POST | `/api/posts` | Create post |
| GET | `/api/posts/:id` | Get single post |
| PUT | `/api/posts/:id` | Update post |
| DELETE | `/api/posts/:id` | Delete post |
| POST | `/api/posts/:id/react` | React to post |
| POST | `/api/posts/:id/comments` | Add comment |

### Videos
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/videos` | Get all videos |
| POST | `/api/videos` | Upload video |
| GET | `/api/videos/:id` | Get single video |
| DELETE | `/api/videos/:id` | Delete video |

### Game Hubs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/games` | Get all games |
| POST | `/api/games` | Create game hub |
| GET | `/api/games/:slug` | Get game by slug |
| POST | `/api/games/:slug/join` | Join game hub |

### Anonymous Posts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/anonymous` | Get anonymous posts |
| POST | `/api/anonymous` | Create anonymous post |
| GET | `/api/anonymous/:id` | Get single post |

### Live Streams
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/live` | Get live streams |
| POST | `/api/live` | Create stream |
| GET | `/api/live/:id` | Get stream details |

---

## 🎮 Features Deep Dive

### Authentication Flow
- JWT-based stateless authentication
- Passwords hashed with bcryptjs (10 rounds)
- Tokens expire after 7 days
- Auth state persisted in localStorage

### Social Feed
- Rich posts with text and images
- 5 reaction types: Like 👍, Love ❤️, Fire 🔥, Sad 😢, Angry 😡
- Nested comments system
- Game tagging for posts

### Game Hubs
- Reddit-style communities per game
- Member counts and activity tracking
- Dedicated posts, videos, and chat
- Moderator system (for future expansion)

### Anonymous Mode
- Cryptographically generated anonymous IDs
- No way to trace back to original user
- Separate community tags
- Full reaction and comment support

### Real-time Features
- Socket.io server on port 3001
- Room-based chat for game hubs and streams
- Typing indicators
- Live viewer counts

---

## 🔒 Security Considerations

> ⚠️ **MVP Notice**: This is a demo/MVP project. For production, implement:

- [ ] Rate limiting on all endpoints
- [ ] Input sanitization (XSS prevention)
- [ ] CSRF protection
- [ ] Refresh token rotation
- [ ] Email verification
- [ ] Password reset flow
- [ ] Content moderation
- [ ] File upload validation
- [ ] HTTPS enforcement
- [ ] Database indexing optimization

---

## 📱 Pages Overview

| Route | Description |
|-------|-------------|
| `/` | Home feed with posts, videos, live tabs |
| `/login` | User login |
| `/register` | User registration |
| `/profile` | User profile with edit |
| `/games` | Browse all game hubs |
| `/games/[slug]` | Individual game hub |
| `/videos` | Browse all videos |
| `/videos/[id]` | Video player page |
| `/live` | Browse live streams |
| `/live/[id]` | Watch live stream |
| `/live/start` | Start streaming page |
| `/anonymous` | Anonymous posts |

---

## 🎯 Future Enhancements

- [ ] Notifications system
- [ ] Direct messaging
- [ ] User search
- [ ] Content recommendations
- [ ] Achievements & badges
- [ ] Tournament integration
- [ ] Clip creation from streams
- [ ] Mobile app (React Native)
- [ ] Dark/Light theme toggle
- [ ] Multi-language support

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [MongoDB](https://www.mongodb.com/) - Database
- [Socket.io](https://socket.io/) - Real-time engine
- [Lucide](https://lucide.dev/) - Beautiful icons

---

<div align="center">
  <p>Built with 💜 for gamers, by gamers</p>
  <p><strong>NEXO</strong> - Level Up Your Social Gaming</p>
</div>