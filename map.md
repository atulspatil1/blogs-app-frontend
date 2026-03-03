quiet-journal/
│
├── .env.example                        # Environment variable template
├── index.html                          # HTML entry point (loads fonts, mounts #root)
├── package.json                        # Dependencies: react, react-dom, react-router-dom, vite
├── vite.config.js                      # Vite config + /api proxy → localhost:8080
├── README.md                           # Setup guide, route table, API usage docs
│
└── src/
    │
    ├── main.jsx                        # ReactDOM.createRoot, imports globals.css
    ├── App.jsx                         # BrowserRouter + all route definitions
    ├── utils.js                        # formatDate, readingTime, toSlug, cx helpers
    │
    ├── styles/
    │   └── globals.css                 # CSS variables (tokens), typography, reset,
    │                                   # dark mode, scrollbar, selection styles
    │
    ├── api/
    │   └── client.js                   # Core fetch wrapper with JWT Authorization header,
    │                                   # 401 session-expiry event, 204 handling,
    │                                   # and all endpoint methods:
    │                                   #   auth.login()
    │                                   #   posts.list/bySlug/byCategory/byTag/search
    │                                   #   posts.adminAll/create/update/delete
    │                                   #   categories.list()
    │                                   #   tags.list()
    │                                   #   comments.byPost/submit/pending/approve/delete
    │
    ├── context/
    │   ├── AuthContext.jsx             # JWT session: login, logout, isAdmin,
    │   │                               # isAuthenticated, auth:expired listener
    │   └── ThemeContext.jsx            # Light/dark toggle, persists to localStorage
    │
    ├── hooks/
    │   └── useApi.js                   # useAsync(fn, deps) — single fetch with loading/error
    │                                   # usePaginated(fn, deps) — Spring Page wrapper
    │                                   # useReadingProgress() — scroll % for progress bar
    │
    ├── components/
    │   ├── Layout.jsx                  # <Shell> page wrapper
    │   │                               # <Header> — site name, nav links, ThemeToggle
    │   │                               # <Footer> — tagline + nav links
    │   │                               # <ThemeToggle> — "Light / Dark" text button
    │   │
    │   ├── PostCard.jsx                # <ArchiveList> — groups posts by year
    │   │                               # <YearGroup> — year heading + entries
    │   │                               # <ArchiveEntry> — clickable title + excerpt + meta
    │   │                               # <PostMeta> — Category · Date · Read time
    │   │                               # <Pagination> — ← Older / Newer → with page count
    │   │                               # <LoadingSkeleton> — animated placeholder rows
    │   │                               # <ErrorMessage> — centered error display
    │   │
    │   ├── ReadingProgress.jsx         # 2px terracotta fixed bar at top of viewport,
    │   │                               # driven by useReadingProgress scroll hook
    │   │
    │   ├── Comments.jsx                # <CommentSection> — collapsed by default,
    │   │                               # flat list of approved comments, no avatars
    │   │                               # <CommentForm> — name/email/body, submit → API
    │   │
    │   ├── Newsletter.jsx              # Border-only email input at article bottom,
    │   │                               # no popups, no banners
    │   │
    │   └── RequireAdmin.jsx            # Route guard: redirects to /login if
    │                                   # unauthenticated, to / if not ROLE_ADMIN
    │
    └── pages/
        │
        ├── Home.jsx                    # / — paginated archive grouped by year
        ├── Essays.jsx                  # /essays — re-exports Home (same layout)
        │
        ├── PostDetail.jsx              # /essays/:slug
        │                               # ReadingProgress bar, category label,
        │                               # title, author, meta, intro paragraph (lg),
        │                               # ArticleBody (markdown-lite renderer),
        │                               # tags footer, NewsletterSection, CommentSection
        │
        ├── Category.jsx                # /category/:slug and /tag/:slug
        │                               # Filtered paginated archive, reuses ArchiveList
        │
        ├── Search.jsx                  # /search — borderless input, archive-style results,
        │                               # result count display, no filters/suggestions
        │
        ├── About.jsx                   # /about — static editorial prose page
        │
        └── admin/
            ├── Login.jsx               # /login — minimal email/password form,
            │                           # redirects to /admin on ROLE_ADMIN login
            │
            ├── AdminDashboard.jsx      # /admin — two sections:
            │                           #   All essays (paginated, draft badge, edit/delete)
            │                           #   Pending comments (approve / delete actions)
            │
            └── PostEditor.jsx          # /admin/new and /admin/edit/:id
                                        # Title, slug (auto-generated), summary,
                                        # content (textarea, markdown), cover image URL,
                                        # DRAFT/PUBLISHED radio, category checkboxes,
                                        # tag checkboxes, save/cancel