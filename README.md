# Narrio - SDR Deal Management

Comprehensive SDR deal management and AI-powered sales enablement platform.

## Project Status

**Version:** 0.1.0 (Initial Implementation)
**Implementation Progress:** 40% Complete

See [IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md) for detailed implementation status.

See [IMPLEMENTATION_DIFF.md](./IMPLEMENTATION_DIFF.md) for comparison against the functional specification.

## Features Implemented

### ✅ Core Features
- Deal management (CRUD operations)
- Deals list with search, filter, and sort
- Deal detail view with comprehensive header
- Next actions management
- AI-powered discovery questions (stage-based)
- AI-powered talking points (stage-based)
- Smart data gap detection
- Stakeholder engagement tracking

### 🚧 In Progress
- Stakeholder Map (Tab 2)
- Deal Context / Documents (Tab 3)
- Generated Content (Tab 4)

### 📋 Planned
- Meeting Prep Generation Flow
- Content Generation Flow (Email Sequences, Bundles)
- HubSpot Integration
- LinkedIn Profile Scraping
- Advanced AI Integration

## Tech Stack

- **Frontend:** Next.js 14 (App Router), React, TypeScript
- **Styling:** Tailwind CSS, shadcn/ui
- **Database:** Prisma ORM with SQLite (dev) / PostgreSQL (prod)
- **State Management:** Zustand
- **Forms:** React Hook Form + Zod
- **Icons:** Lucide React

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd narrio
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

4. Initialize the database
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
narrio/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── deals/             # Deals pages
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── deals/            # Deal-specific components
│   └── ui/               # shadcn/ui components
├── lib/                   # Utilities and configurations
│   ├── prisma.ts         # Prisma client
│   ├── types.ts          # TypeScript types
│   ├── utils.ts          # Utility functions
│   └── store.ts          # Zustand store
├── prisma/               # Database schema
└── public/               # Static assets
```

## Database Schema

The application uses Prisma with the following models:
- `Deal` - Core deal information
- `Stakeholder` - Deal stakeholders with buyer types
- `Document` - Deal-related documents
- `NextAction` - Action items (AI-suggested and manual)
- `GeneratedContent` - AI-generated materials
- `CustomAngle` - Custom content generation angles

## API Routes

### Deals
- `GET /api/deals` - List deals (with search, filter, sort)
- `POST /api/deals` - Create new deal
- `GET /api/deals/[id]` - Get deal details
- `PATCH /api/deals/[id]` - Update deal
- `DELETE /api/deals/[id]` - Delete deal

### Next Actions
- `POST /api/deals/[id]/next-actions` - Create action
- `PATCH /api/deals/[id]/next-actions/[actionId]` - Update action
- `DELETE /api/deals/[id]/next-actions/[actionId]` - Delete action

## Development

### Run Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
npm start
```

### Database Management
```bash
# Create new migration
npx prisma migrate dev --name migration_name

# Push schema changes (dev only)
npx prisma db push

# Open Prisma Studio
npx prisma studio
```

## Contributing

This is a private project. See the functional specification document for implementation guidelines.

## License

Proprietary - All rights reserved

---

**Last Updated:** November 15, 2025
