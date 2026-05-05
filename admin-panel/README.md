src/
│
├── app/                         # Next.js routing ONLY
    │   └──(Auth)   
│   └.    login/
│   │       └── page.tsx
│   │
│   ├── (admin)/
│   │   ├── layout.tsx           # protected layout
│   │   ├── page.tsx             # dashboard
│   │
│   │   ├── users/page.tsx
│   │   ├── businesses/page.tsx
│   │   ├── subscriptions/page.tsx
│   │   ├── ai/page.tsx
│   │   ├── analytics/page.tsx
│   │   ├── support/page.tsx
│   │   └── settings/page.tsx
│   │
│   └── layout.tsx               # root layout
│
├── modules/                     # 🔥 DOMAIN LAYER (core of your app)
│   ├── auth/
│   │   ├── api.ts
│   │   ├── service.ts
│   │   ├── hooks.ts
│   │   ├── store.ts
│   │   ├── types.ts
│   │   └── components/
│   │
│   ├── users/
│   ├── businesses/
│   ├── subscriptions/
│   ├── ai/
│   ├── analytics/
│   ├── support/
│   └── roles/
│
├── components/                  # 🧩 SHARED UI (dumb components)
│   ├── ui/                      # buttons, inputs, modals
│   ├── layout/                  # sidebar, header, footer, authlayout.tsx
│   ├── charts/
│   ├── tables/
│   └── forms/
│   └── auth/LoginForm.tsx
│
├── services/                    # ⚙️ INFRASTRUCTURE (API layer)
│   ├── api/
│   │   ├── client.ts            # fetch/axios instance
│   │   ├── interceptor.ts       # auth, error handling
│   │   └── endpoints.ts
│   │
│   ├── auth.service.ts
│   ├── user.service.ts
│   ├── business.service.ts
│   └── billing.service.ts
│
├── store/                       # 🌍 GLOBAL STATE
│   ├── auth.store.ts
│   ├── ui.store.ts              # sidebar, theme
│   └── app.store.ts
│
├── hooks/                       # 🌐 GLOBAL HOOKS
│   ├── useAuth.ts
│   ├── useDebounce.ts
│   └── usePermissions.ts
│
├── middleware/                  # 🔐 SECURITY LAYER
│   ├── auth.middleware.ts
│   ├── rbac.middleware.ts
│   └── index.ts
│
├── config/                      # ⚙️ APP CONFIG
│   ├── permissions.ts
│   ├── features.ts
│   └── env.ts
│
├── constants/                   # 📌 STATIC DATA
│   ├── nav.ts
│   ├── roles.ts
│   └── index.ts
│
├── lib/                         # 🧠 PURE UTILITIES ONLY
│   ├── cn.ts
│   ├── format.ts
│   ├── date.ts
│   └── validation.ts
│
├── types/                       # 🌐 GLOBAL TYPES
│   ├── api.ts
│   ├── auth.ts
│   └── index.ts
│
└── styles/

└── globals.css