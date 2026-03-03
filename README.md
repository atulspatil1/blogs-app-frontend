# Blogs Application — Frontend

> A warm, typographic archive of engineering thought.  
> Quiet on the surface. Structured beneath. Built with discipline.

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | React 18 + Vite 5 |
| Routing | React Router v6 |
| Styling | CSS Variables (no framework) |
| Fonts | Playfair Display · Source Sans 3 |
| Auth | JWT (localStorage) |
| API | Spring Boot 3.2 @ `/api/v1` |

---

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env.local
# Edit VITE_API_URL if your backend isn't on localhost:8080

# 3. Start dev server
npm run dev
# Opens at http://localhost:3000

# 4. Build for production
npm run build
```

The Vite dev server proxies `/api` → `http://localhost:8080` automatically,
so you won't hit CORS issues during development.

---

## Project Structure

```
src/
├── api/
│   └── client.js          # Fetch wrapper + JWT interceptor + all endpoints
├── context/
│   ├── AuthContext.jsx     # JWT session management, login/logout
│   └── ThemeContext.jsx    # Light/dark mode toggle
├── hooks/
│   └── useApi.js           # useAsync, usePaginated, useReadingProgress
├── components/
│   ├── Layout.jsx          # Shell, Header, Footer, ThemeToggle
│   ├── PostCard.jsx        # ArchiveList, ArchiveEntry, PostMeta, Pagination
│   ├── ReadingProgress.jsx # Terracotta 2px reading bar
│   ├── Comments.jsx        # Collapsed-by-default comment section + form
│   ├── Newsletter.jsx      # Minimal subscribe form
│   └── RequireAdmin.jsx    # Route guard for admin pages
├── pages/
│   ├── Home.jsx            # / — archive grouped by year
│   ├── Essays.jsx          # /essays — same as Home
│   ├── PostDetail.jsx      # /essays/:slug
│   ├── Category.jsx        # /category/:slug and /tag/:slug
│   ├── Search.jsx          # /search
│   ├── About.jsx           # /about
│   └── admin/
│       ├── Login.jsx        # /login
│       ├── AdminDashboard.jsx # /admin
│       └── PostEditor.jsx   # /admin/new · /admin/edit/:id
├── styles/
│   └── globals.css         # CSS variables, typography, reset
├── utils.js                # formatDate, readingTime, toSlug, cx
├── App.jsx                 # Router + providers
└── main.jsx                # React entry
```

---

## Routes

| Path | Component | Access |
|------|-----------|--------|
| `/` | Home | Public |
| `/essays` | Essays | Public |
| `/essays/:slug` | PostDetail | Public |
| `/category/:slug` | Category | Public |
| `/tag/:slug` | Category | Public |
| `/search` | Search | Public |
| `/about` | About | Public |
| `/login` | Login | Public |
| `/admin` | AdminDashboard | `ROLE_ADMIN` |
| `/admin/new` | PostEditor | `ROLE_ADMIN` |
| `/admin/edit/:id` | PostEditor | `ROLE_ADMIN` |

---

## API Integration

All calls go through `src/api/client.js`.

```js
import { posts, categories, tags, comments, auth } from './api/client'

// Public
await posts.list(page, size)
await posts.bySlug('my-essay-slug')
await posts.byCategory('java', page, size)
await posts.search('spring boot', page, size)

// Admin
await posts.adminAll(page, size)
await posts.create({ title, slug, summary, content, status, categoryIds, tagIds })
await posts.update(id, payload)
await posts.delete(id)

await comments.pending()
await comments.approve(id)
await comments.delete(id)
```

JWT is automatically attached to all requests via the `Authorization: Bearer <token>` header.  
On `401`, the token is cleared and an `auth:expired` event is dispatched.

---

## Design Tokens (CSS Variables)

Edit `src/styles/globals.css` to retheme:

```css
:root {
  --background:       #f7f3ee;   /* Warm cream */
  --foreground:       #1c1815;   /* Warm near-black */
  --primary:          #b5552a;   /* Terracotta accent */
  --secondary:        #ede8e1;   /* Warm beige */
  --muted:            #f0ebe4;
  --muted-foreground: #9c8f83;
  --border:           #ddd6cc;
  --font-heading:     'Playfair Display', Georgia, serif;
  --font-body:        'Source Sans 3', sans-serif;
}
```

Dark mode mirrors warmth — no cool blues.

---

## Admin Usage

1. Visit `/login` with `admin@example.com` / `Admin@123`
2. Token is stored in localStorage under `jqj_token`
3. Navigate to `/admin` for post and comment management
4. Create essays at `/admin/new`, edit at `/admin/edit/:id`
5. Sign out clears the token immediately (stateless JWT)

---

## Design Principles (from Design Language V2)

- Single-column centered layout (`max-w-3xl`)
- No cards, no shadows, no sidebars
- Terracotta accent used only for links, hover states, and reading progress
- Posts grouped by year on the archive page
- Comments collapsed by default, flat list, no avatars
- Newsletter only at the bottom of articles — no popups
- No social buttons, trending lists, or hero banners