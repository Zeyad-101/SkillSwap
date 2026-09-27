<<<<<<< HEAD
<p align="center">
  <img src="src/assets/logo/logo.png" alt="SkillSwap logo" width="140" />
</p>

<h1 align="center">SkillSwap</h1>

<p align="center">
  A responsive web app for trading skills — list what you can teach, list what you want to learn, and get matched with people who complement you.
</p>

---

## About

SkillSwap connects people who want to exchange knowledge instead of paying for lessons. A user lists the skills they can teach and the skills they want to learn, and the app surfaces others whose lists overlap in the opposite direction. Matches can message each other and arrange to swap skills directly.

This is a web-only project — it runs in the browser on desktop or phone and can be installed as a Progressive Web App, but there is no native mobile app.

## Tech stack

- **Frontend:** Vite + React, React Router, Tailwind CSS
- **Backend:** Supabase (Postgres, Auth, Realtime, Row Level Security)
- **Auth:** Google OAuth via Supabase Auth
- **PWA:** `vite-plugin-pwa`, with a manifest and app-shell service worker for install-to-home-screen support

## Features

- **Google sign-in**, with a Postgres trigger that creates a matching `profiles` row on first login
- **Onboarding wizard** for new users to pick skills they can teach and skills they want to learn
- **Browse page** with search and category filtering over other users' listed skills
- **Matching**, based on overlap between one user's "wants" and another's "teaches" (and vice versa)
- **Dashboard** showing a user's suggested matches and recent conversations
- **Profile page** with inline editing of name, avatar, bio, and skill lists
- **Realtime chat** between matched users, backed by Supabase's Postgres change subscriptions
- **Installable as a PWA** — "Add to Home Screen" on Android and iOS, once served over HTTPS

## Project structure

```
src/
├── main.jsx
├── App.jsx
├── router.jsx
├── context/
│   └── AuthContext.jsx      # session state, Google sign-in/out
├── lib/
│   └── supabaseClient.js
├── api/                     # all Supabase queries live here
│   ├── profiles.js
│   ├── skills.js
│   ├── matches.js
│   └── messages.js
├── components/
│   ├── Button.jsx
│   ├── NavBar.jsx
│   ├── ProtectedRoute.jsx
│   ├── SkillTag.jsx
│   ├── MatchCard.jsx
│   └── MessageBubble.jsx
├── pages/
│   ├── Homepage.jsx
│   ├── Login.jsx
│   ├── Onboarding.jsx
│   ├── Browse.jsx
│   ├── Dashboard.jsx
│   ├── Profile.jsx
│   ├── Chat.jsx
│   └── HowItWorks.jsx
├── assets/
│   └── logo/
└── styles/
    └── index.css
```

Pages never call Supabase directly — everything goes through `api/*.js`, so the data layer stays in one place.

## Database schema

Defined and managed in Supabase (Postgres):

| Table | Purpose |
|---|---|
| `profiles` | One row per user, 1:1 with `auth.users`, created automatically on signup via a database trigger |
| `skills` | Master list of skills (name + category) |
| `user_skills_teach` | Skills a user can teach, with proficiency level |
| `user_skills_want` | Skills a user wants to learn |
| `matches` | Computed pairings between two users, with a score and a status (`pending` / `accepted` / `declined`) |
| `messages` | Chat messages tied to a match, delivered live via Supabase Realtime |

Row Level Security is enabled on every table — users can read public profile and skill data, but can only write their own rows, and can only read matches or messages they're a participant in.

## Getting started

```bash
git clone https://github.com/Zeyad-101/SkillSwap.git
cd SkillSwap
npm install
```

Create a `.env` file in the project root:

```
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Both values come from your Supabase project's **Settings → API** page.

Run the dev server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
npm run preview   # serve the production build locally
```

## Google login setup

Google sign-in requires a matching OAuth client:

1. In Google Cloud Console, create an OAuth 2.0 Client ID (Web application) with this redirect URI:
   `https://<your-supabase-project-ref>.supabase.co/auth/v1/callback`
2. In the Supabase Dashboard, under **Authentication → Providers → Google**, paste the resulting Client ID and Client Secret, then enable the provider.

## Installing as a PWA

Once deployed over HTTPS, SkillSwap can be installed like a native app:

- **Android (Chrome):** open the site, use the "Install app" option from the browser menu
- **iOS (Safari):** open the site, use Share → "Add to Home Screen"

The service worker caches the app shell for fast repeat loads, but live data (profiles, matches, messages) still requires an internet connection — offline mode is not implemented.

## Contributing

This project is split by ownership:

- **Backend:** Supabase schema, RLS policies, auth configuration, and API contract
- **Frontend:** all React pages and components, consuming the API contract above

Changes to the database schema should be coordinated between both sides rather than made unilaterally, since the frontend's `api/*.js` layer assumes a fixed table and column shape.
=======
# SkillSwap
>>>>>>> 548b36d6c00c38b3c5310bdcec693d67f8af1a37
