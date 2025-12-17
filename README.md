# Garbet Frontend - Next.js Frontend

This is the frontend application built with Next.js 14 and React.

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

3. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
frontend/
├── app/                    # Next.js App Router
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard page
│   ├── layout.js         # Root layout
│   ├── page.js           # Home page
│   └── globals.css       # Global styles
├── lib/                   # Utility functions
│   └── api.js            # API client
└── public/               # Static assets
```

## Features

- User authentication (Login/Register)
- Protected routes
- Dashboard with user information
- API integration with backend

## Tech Stack

- Next.js 14 (App Router)
- React 18
- Axios for API calls

