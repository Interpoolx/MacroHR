# MacroHR - Modern HR & Performance Dashboard

Developed by **[@Web4strategy](https://web4strategy.com)** | Follow on **[X](https://x.com/web4strategy)**

A production-ready, fully responsive React dashboard built for modern HR teams. Track employee performance, monitor payroll trends, manage projects, and gain actionable insights—all through an intuitive, data-rich interface.

## Key Features

- 📊 **Multi-Role Dashboards** – Tailored experiences for Admin, HR Manager, and Employee (User) roles.
- 🔐 **Supabase Integration** – Robust authentication and database management out of the box.
- 🚀 **Hono Backend** – Ultra-fast, edge-ready backend built with Hono for high performance.
- 🌑 **Pitch Black Theme** – Premium, high-contrast dark theme optimized for focused work.
- 📈 **Advanced Analytics** – Interactive charts for payroll trends, employee performance, and KPIs.
- 📋 **Personnel Management** – Complete CRUD workflows for employee records, payslips, and documents.
- 🔍 **SEO Optimized** – Dynamic meta tags, semantic HTML, and best practices for search visibility.
- 📱 **Fully Responsive** – Mobile-first architecture using Tailwind CSS for all devices.

## Tech Stack

- **Web (Frontend)**: React 19, TanStack Router, Vite, Tailwind CSS, Recharts
- **Backend**: Hono, Bun/Node.js, Supabase Client
- **Infrastructure**: Supabase (Auth, DB, Storage), Edge Computing Ready
- **Dev Tools**: TypeScript, ESLint, Prettier, Lucide Icons

## Project Structure
```
MacroHR/
├── shared/           # Shared types, config, and utility libraries
├── web/              # React frontend (Vite + TanStack Router)
│   ├── src/
│   │   ├── routes/   # File-based routing for Admin, Manager, and User
│   │   ├── components/ # Atomic UI and feature components
│   │   └── lib/      # Supabase and API clients
│   └── public/data/  # Mock datasets for simulated CRUD
├── backend/          # Hono backend API
└── docs/             # Documentation and implementation plans
```

## Getting Started

### Prerequisites

- Node.js ≥ 18
- npm (or yarn, pnpm)

### Installation

```bash
# Clone the repository
git clone https://github.com/Interpoolx/MacroHR.git
cd MacroHR

# Install dependencies
npm install
````

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Build for Production

```bash
npm run build
npm run preview   # Preview the production build locally
```

## Production Optimizations

- React.memo and useMemo for performance-critical components
- Lazy-loaded routes ready (add React.lazy + Suspense as needed)
- Optimized images with fallbacks
- Code splitting support built-in
- Minimal bundle size via Vite's tree-shaking

### Environment Variables

Create a `.env` file in the root:

```env
VITE_API_URL=https://your-api.example.com
VITE_APP_NAME=MacroHR
VITE_APP_VERSION=1.0.0
```

## Accessibility & Best Practices

- Full ARIA labeling and semantic HTML
- Keyboard navigation throughout the app
- Proper focus management and trap
- High contrast ratios and color-blind friendly palette
- Error boundaries with user-friendly fallbacks
- Loading skeletons and empty states
- Graceful handling of network errors and missing data

## Code Quality

- Strict TypeScript configuration
- ESLint + Prettier for consistent, clean code
- Component composition and reusable patterns
- Clear separation of concerns
- Comprehensive utility library for formatting and calculations

## Browser Support

Modern evergreen browsers:

- Chrome (latest + 2 previous)
- Firefox (latest + 2 previous)
- Safari (latest + 2 previous)
- Edge (latest + 2 previous)

## License

Public – All rights reserved.
