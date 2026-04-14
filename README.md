<div align="center">

# 📦 ParcelPort

### University Hostel Parcel Delivery Management System

*A comprehensive full-stack solution for managing parcel deliveries in university hostels with dedicated portals for Students, Administrators, and Delivery Personnel.*

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Latest-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Supabase Setup](#-supabase-setup) • [Usage](#-usage) • [Deployment](#-deployment)

</div>

---

## 🚀 Migration to Supabase

**ParcelPort has been migrated from Firebase to Supabase!**

For detailed migration information, see:
- **[README_MIGRATION.md](README_MIGRATION.md)** - Migration overview and quick start
- **[SUPABASE_SETUP.md](SUPABASE_SETUP.md)** - Complete setup guide
- **[MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)** - Detailed migration steps
- **[MIGRATION_STATUS.md](MIGRATION_STATUS.md)** - Current progress
- **[SUPABASE_QUICK_REFERENCE.md](SUPABASE_QUICK_REFERENCE.md)** - Code examples

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Supabase Setup](#-supabase-setup)
- [Environment Variables](#-environment-variables)
- [Running the Application](#-running-the-application)
- [Project Structure](#-project-structure)
- [User Roles & Portals](#-user-roles--portals)
- [Design System](#-design-system)
- [Security](#-security)
- [Deployment](#-deployment)
- [Scripts](#-scripts)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**ParcelPort** is a modern, full-stack web application designed to streamline parcel delivery management in university hostels. It provides three distinct portals tailored to different user roles, ensuring efficient parcel tracking, payment processing, and delivery coordination.

### System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         PARCELPORT SYSTEM                           │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│  👨‍🎓 STUDENT      │      │  👨‍💼 ADMIN        │      │  🚚 DELIVERY     │
│     PORTAL       │      │     PORTAL       │      │     PORTAL       │
├──────────────────┤      ├──────────────────┤      ├──────────────────┤
│ • Register       │      │ • View All       │      │ • Today's        │
│   Parcels        │      │   Parcels        │      │   Deliveries     │
│ • Track Status   │      │ • Approve        │      │ • Mark Pickup    │
│ • Make Payment   │      │   Payments       │      │ • Mark Delivery  │
│ • View History   │      │ • Assign Staff   │      │ • Report Issues  │
│ • Notifications  │      │ • Analytics      │      │ • View History   │
└────────┬─────────┘      └────────┬─────────┘      └────────┬─────────┘
         │                         │                         │
         └─────────────────────────┼─────────────────────────┘
                                   │
                    ┌──────────────▼──────────────┐
                    │     Next.js API Routes      │
                    │   (Server-Side Logic)       │
                    └──────────────┬──────────────┘
                                   │
                    ┌──────────────▼──────────────┐
                    │      Firebase Services      │
                    ├─────────────────────────────┤
                    │ • Firestore (Database)      │
                    │ • Authentication            │
                    │ • Storage (Files)           │
                    └─────────────────────────────┘
```

### Data Flow Diagram

```
┌─────────────┐
│   STUDENT   │  1. Register Parcel
│   Creates   │────────────────────────┐
│   Parcel    │                        │
└─────────────┘                        ▼
                              ┌─────────────────┐
                              │    FIRESTORE    │
                              │    DATABASE     │
                              └─────────────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    │                  │                  │
                    ▼                  ▼                  ▼
         ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
         │     STUDENT     │  │      ADMIN      │  │   DELIVERY BOY  │
         │   Views Status  │  │  Approves/      │  │   Picks Up &    │
         │   & Updates     │  │  Assigns        │  │   Delivers      │
         └─────────────────┘  └─────────────────┘  └─────────────────┘
                    │                  │                  │
                    └──────────────────┼──────────────────┘
                                       │
                                       ▼
                              ┌─────────────────┐
                              │  NOTIFICATIONS  │
                              │   & UPDATES     │
                              └─────────────────┘
```

### Why ParcelPort?

- **Eliminates Manual Tracking**: No more paper logs or missed deliveries
- **Real-time Updates**: Students get instant notifications about their parcels
- **Payment Integration**: Seamless payment processing with UPI and Net Banking
- **Role-based Access**: Separate interfaces for students, admins, and delivery staff
- **Analytics Dashboard**: Comprehensive insights for administrators
- **Mobile Responsive**: Works perfectly on all devices

---

## ✨ Features

### Complete Workflow Visualization

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      PARCELPORT WORKFLOW                                │
└─────────────────────────────────────────────────────────────────────────┘

    STUDENT                    ADMIN                    DELIVERY BOY
       │                         │                           │
       │ 1. Register Parcel      │                           │
       ├────────────────────────>│                           │
       │                         │                           │
       │ 2. Submit Payment       │                           │
       ├────────────────────────>│                           │
       │                         │                           │
       │                    3. Review & Approve              │
       │                         ├──────────┐                │
       │                         │          │                │
       │ 4. Approval Notification│          │                │
       │<────────────────────────┤          │                │
       │                         │          │                │
       │                    5. Assign Parcel                 │
       │                         ├─────────────────────────>│
       │                         │                           │
       │                         │          6. Pickup Parcel │
       │                         │                    ┌──────┤
       │                         │                    │      │
       │ 7. Pickup Notification  │                    │      │
       │<────────────────────────┼────────────────────┘      │
       │                         │                           │
       │                         │         8. Deliver Parcel │
       │                         │                    ┌──────┤
       │                         │                    │      │
       │ 9. Delivery Confirmation│                    │      │
       │<────────────────────────┼────────────────────┘      │
       │                         │                           │
       ▼                         ▼                           ▼
   ✓ Complete                ✓ Tracked                  ✓ Delivered
```

### 👨‍🎓 Student Portal

```
┌─────────────────────────────────────────────────────────────┐
│                    STUDENT DASHBOARD                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  📦 My Parcels                    📊 Quick Stats            │
│  ┌─────────────────────────┐     ┌──────────────────┐      │
│  │ • Active: 3             │     │ Total: 15        │      │
│  │ • Pending Payment: 1    │     │ Delivered: 10    │      │
│  │ • In Transit: 2         │     │ Pending: 5       │      │
│  └─────────────────────────┘     └──────────────────┘      │
│                                                             │
│  🔔 Recent Notifications          ➕ Quick Actions          │
│  ┌─────────────────────────┐     ┌──────────────────┐      │
│  │ • Payment Approved      │     │ Register Parcel  │      │
│  │ • Out for Delivery      │     │ Track Parcel     │      │
│  │ • Delivered Successfully│     │ View History     │      │
│  └─────────────────────────┘     └──────────────────┘      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Key Features:**
- **Parcel Registration**
  - 4-step wizard for easy parcel registration
  - Auto-populated personal information from profile
  - Sender and receiver details management
  - Parcel details with weight and dimensions
  
- **Payment System**
  - Multiple payment options (UPI, Net Banking)
  - QR code for instant UPI payments
  - Screenshot upload for payment verification
  - Transaction tracking
  
- **Dashboard**
  - Overview of all parcels (Active, Pending, Delivered)
  - Real-time parcel status tracking
  - Quick access to register new parcels
  
- **Profile Management**
  - Update personal information
  - Manage hostel and room details
  - Contact information updates

- **Notifications**
  - Real-time delivery updates
  - Payment confirmation alerts
  - Delivery completion notifications

### 👨‍💼 Admin Portal

```
┌─────────────────────────────────────────────────────────────┐
│                     ADMIN DASHBOARD                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  📊 Analytics Overview                                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Total   │  │  Active  │  │ Pending  │  │ Revenue  │   │
│  │ Parcels  │  │Deliveries│  │ Payments │  │  Today   │   │
│  │   245    │  │    18    │  │    12    │  │  ₹2,450  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                             │
│  📈 Revenue Chart                  🚚 Delivery Status       │
│  ┌─────────────────────────┐     ┌──────────────────┐      │
│  │     ▂▄▆█▆▄▂             │     │ On Time:  85%    │      │
│  │   ▂▄▆█████▆▄▂           │     │ Delayed:  10%    │      │
│  │ ▂▄▆█████████▆▄▂         │     │ Pending:   5%    │      │
│  └─────────────────────────┘     └──────────────────┘      │
│                                                             │
│  ⚡ Quick Actions                                           │
│  [View Parcels] [Approve Payments] [Assign Delivery]       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Key Features:**
- **Analytics Dashboard**
  - Total parcels overview
  - Active deliveries tracking
  - Pending payments monitoring
  - Revenue statistics
  
- **Parcel Management**
  - View all parcels with advanced filters
  - Search by tracking ID, student name, or status
  - Bulk operations support
  - Export reports
  
- **Payment Verification**
  - Review payment screenshots
  - Approve or reject payments
  - Payment history tracking
  - Revenue reports (daily, weekly, monthly)
  
- **Delivery Boy Management**
  - Create delivery staff accounts
  - View all delivery personnel
  - Assign parcels to delivery boys
  - Performance tracking
  
- **Assignment System**
  - Smart parcel assignment
  - Workload distribution
  - Route optimization ready

### 🚚 Delivery Boy Portal

```
┌─────────────────────────────────────────────────────────────┐
│                   DELIVERY DASHBOARD                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  📋 Today's Deliveries                                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ DRID: ABC12345    Status: Assigned                  │   │
│  │ Student: Rahul Sharma                                │   │
│  │ Hostel: A, Room: 412                                 │   │
│  │ [View Details] [Mark Pickup] [Navigate]             │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │ DRID: XYZ67890    Status: Picked Up                 │   │
│  │ Student: Priya Patel                                 │   │
│  │ Hostel: B, Room: 305                                 │   │
│  │ [View Details] [Mark Delivered] [Navigate]          │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  📊 My Stats                      🎯 Today's Progress       │
│  ┌─────────────────────────┐     ┌──────────────────┐      │
│  │ Assigned: 8             │     │ ████████░░ 80%   │      │
│  │ Picked Up: 6            │     │ Completed: 6/8   │      │
│  │ Delivered: 5            │     │ Remaining: 2     │      │
│  └─────────────────────────┘     └──────────────────┘      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Key Features:**
- **Today's Deliveries**
  - List of assigned parcels for the day
  - Parcel details and delivery addresses
  - Navigation to delivery locations
  
- **Delivery Management**
  - Mark parcels as picked up
  - Mark parcels as delivered
  - Real-time status updates
  
- **Issue Reporting**
  - Report delivery issues
  - Photo upload support
  - Issue tracking and resolution

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 16.2](https://nextjs.org/) (App Router)
- **Language**: [TypeScript 5.0](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/)

### Backend & Database
- **Database**: [Firebase Firestore](https://firebase.google.com/docs/firestore)
- **Authentication**: [Firebase Auth](https://firebase.google.com/docs/auth)
- **Storage**: [Firebase Storage](https://firebase.google.com/docs/storage)
- **API Routes**: Next.js API Routes

### State Management & Data Fetching
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Data Fetching**: [TanStack Query (React Query)](https://tanstack.com/query)
- **Forms**: [React Hook Form](https://react-hook-form.com/)
- **Validation**: [Zod](https://zod.dev/)

### Additional Libraries
- **Date Handling**: [date-fns](https://date-fns.org/)
- **QR Codes**: [qrcode.react](https://www.npmjs.com/package/qrcode.react)
- **Charts**: [Recharts](https://recharts.org/)
- **Email**: [Resend](https://resend.com/)

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0 or higher) - [Download](https://nodejs.org/)
- **npm** or **pnpm** (comes with Node.js)
- **Git** - [Download](https://git-scm.com/)
- **Firebase Account** - [Sign up](https://firebase.google.com/)

---

## 📦 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/parcelport.git
cd parcelport
```

### 2. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 3. Setup Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

See [Environment Variables](#-environment-variables) section for details.

---

## 🔥 Firebase Setup

### Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Enter project name: `ParcelPort` (or your preferred name)
4. Disable Google Analytics (optional)
5. Click **"Create project"**

### Step 2: Register Your Web App

1. In your Firebase project, click the **Web icon** (`</>`)
2. Register app with nickname: `ParcelPort Web`
3. Copy the Firebase configuration object
4. Add these values to your `.env.local` file

### Step 3: Enable Authentication

1. Go to **Authentication** → **Sign-in method**
2. Enable **Email/Password** provider
3. Click **Save**

### Step 4: Create Firestore Database

1. Go to **Firestore Database**
2. Click **"Create database"**
3. Select **"Start in production mode"**
4. Choose your preferred location
5. Click **"Enable"**

### Step 5: Setup Firestore Security Rules

Copy the rules from `firestore.rules` file:

```bash
# In Firebase Console → Firestore Database → Rules
# Copy and paste the content from firestore.rules
```

### Step 6: Enable Firebase Storage

1. Go to **Storage**
2. Click **"Get started"**
3. Use default security rules
4. Choose your preferred location
5. Click **"Done"**

### Step 7: Create Firestore Collections

The following collections will be created automatically when you use the app:

- `users` - User profiles and roles
- `parcels` - Parcel information
- `payments` - Payment records
- `notifications` - User notifications
- `issues` - Delivery issues

---

## 🔐 Environment Variables

Copy `.env.example` to `.env.local` and fill in all values:

```bash
cp .env.example .env.local
```

Environment variables used by this project:

```env
# Firebase Configuration (Required)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Razorpay Configuration (Required for payment routes)
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret

# Optional: Firebase Admin SDK (single-line JSON string)
FIREBASE_ADMIN_SDK_KEY={"type":"service_account",...}

# Optional: Resend (email notifications)
RESEND_API_KEY=your_resend_api_key
```

### Getting Firebase Credentials

1. Go to Firebase Console → Project Settings
2. Scroll to "Your apps" section
3. Click on your web app
4. Copy the config values to `.env.local`

---

## � Running the Application

### Development Mode

```bash
# Using Turbopack (faster)
npm run dev

# Using Webpack
npm run dev:webpack
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Linting

```bash
npm run lint
```

---

## 📁 Project Structure

```
parcelport/
├── public/                      # Static assets
│   ├── payment-qr.jpeg         # UPI payment QR code
│   └── *.svg                   # Icons and images
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (admin)/           # Admin portal routes
│   │   │   └── admin/
│   │   │       ├── dashboard/
│   │   │       ├── parcels/
│   │   │       ├── payments/
│   │   │       ├── delivery-boys/
│   │   │       ├── assign/
│   │   │       └── revenue/
│   │   ├── (auth)/            # Authentication routes
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── register-staff/
│   │   │   ├── create-admin/
│   │   │   └── forgot-password/
│   │   ├── (delivery)/        # Delivery portal routes
│   │   │   └── delivery/
│   │   │       ├── dashboard/
│   │   │       ├── parcel/
│   │   │       └── report-issue/
│   │   ├── (student)/         # Student portal routes
│   │   │   └── student/
│   │   │       ├── dashboard/
│   │   │       ├── parcels/
│   │   │       ├── track/
│   │   │       ├── notifications/
│   │   │       └── profile/
│   │   ├── api/               # API routes
│   │   │   ├── admin/
│   │   │   ├── delivery/
│   │   │   ├── auth/
│   │   │   └── notifications/
│   │   └── layout.tsx         # Root layout
│   ├── components/            # React components
│   │   ├── layout/           # Layout components
│   │   │   ├── TopBar.tsx
│   │   │   ├── StudentSidebar.tsx
│   │   │   ├── AdminSidebar.tsx
│   │   │   └── DeliverySidebar.tsx
│   │   └── ui/               # shadcn/ui components
│   ├── hooks/                # Custom React hooks
│   │   └── useAuth.ts
│   ├── lib/                  # Utility libraries
│   │   ├── firebase/
│   │   │   ├── client.ts    # Firebase client config
│   │   │   └── admin.ts     # Firebase admin config
│   │   └── utils.ts
│   └── types/                # TypeScript types
├── scripts/                   # Utility scripts
│   ├── make-admin.ts         # Create admin user
│   └── auth-field-check.ts   # Auth validation
├── .env.example              # Environment variable template
├── .env.local                # Local environment variables (create this)
├── .gitignore
├── components.json           # shadcn/ui config
├── firestore.rules           # Firestore security rules
├── next.config.ts            # Next.js configuration
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts        # Tailwind configuration
├── tsconfig.json             # TypeScript configuration
└── README.md
```

---

## 👥 User Roles & Portals

### 1. Student Role

**Access**: `/student/*`

**Capabilities**:
- Register new parcels
- Track parcel status
- Make payments
- View delivery history
- Manage profile
- Receive notifications

**Default Registration**: Students can self-register at `/register`

### 2. Admin Role

**Access**: `/admin/*`

**Capabilities**:
- View all parcels and analytics
- Verify and approve payments
- Manage delivery boys
- Assign parcels to delivery staff
- Generate revenue reports
- Export data

**Account Creation**: Use `/create-admin` page or run the admin script:

```bash
npx ts-node scripts/make-admin.ts
```

### 3. Delivery Boy Role

**Access**: `/delivery/*`

**Capabilities**:
- View assigned deliveries
- Update parcel status (picked up, delivered)
- Report delivery issues
- View delivery history

**Account Creation**: 
- Admin creates account at `/admin/delivery-boys/create`
- Or staff self-registers at `/register-staff`

---

## 🎨 Design System

### Color Palette

```css
/* Primary Colors */
--primary-navy: #04122e;      /* Deep Navy - Primary brand color */
--primary-dark: #1a2744;      /* Dark Navy - Gradients */

/* Accent Colors */
--accent-amber: #855300;      /* Amber - Highlights */
--accent-orange: #fea619;     /* Orange - CTAs */

/* Neutral Colors */
--neutral-50: #f6fafe;        /* Background */
--neutral-100: #f0f4f8;       /* Cards */
--neutral-200: #eaeef2;       /* Borders */
--neutral-400: #c5c6ce;       /* Disabled */
--neutral-600: #75777e;       /* Secondary text */
--neutral-700: #45464d;       /* Body text */
--neutral-900: #04122e;       /* Headings */

/* Status Colors */
--success: #10b981;           /* Green */
--warning: #f59e0b;           /* Yellow */
--error: #ba1a1a;             /* Red */
--info: #3b82f6;              /* Blue */
```

### Typography

- **Headings**: Plus Jakarta Sans (Bold, 700-800)
- **Body**: Inter (Regular, 400-600)
- **Monospace**: JetBrains Mono (for codes)

### Design Principles

- **No-line Design**: Minimal borders, tonal backgrounds
- **Rounded Corners**: 12px (xl) for cards, 8px (lg) for buttons
- **Shadows**: Subtle, layered shadows for depth
- **Spacing**: 8px base unit system
- **Responsive**: Mobile-first approach

---

## � Security

### Authentication
- Firebase Authentication with email/password
- Role-based access control (RBAC)
- Protected routes with middleware
- Session management

### Database Security
- Firestore security rules
- User-specific data access
- Role-based read/write permissions
- Input validation on all operations

### API Security
- Server-side validation
- CSRF protection
- Rate limiting ready
- Secure environment variables

### Data Protection
- Encrypted data transmission (HTTPS)
- Secure file uploads
- Payment data encryption
- PII protection

---

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. **Import to Vercel**
   - Go to [Vercel](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

2. **Project Settings**
  - Framework Preset: `Next.js`
  - Build Command: `npm run build` (or `pnpm build` if you use pnpm)
  - Install Command: `npm install` (or `pnpm install`)

3. **Add Environment Variables (Required)**
   - Go to Project Settings → Environment Variables
  - Add all variables from `.env.example`
  - Ensure these are present in Production and Preview:
    - `NEXT_PUBLIC_FIREBASE_API_KEY`
    - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
    - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
    - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
    - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
    - `NEXT_PUBLIC_FIREBASE_APP_ID`
    - `NEXT_PUBLIC_RAZORPAY_KEY_ID`
    - `RAZORPAY_KEY_SECRET`
    - `RAZORPAY_WEBHOOK_SECRET`
   - Save changes

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app is live! 🎉

### Deploy to Other Platforms

#### Netlify
```bash
npm run build
# Deploy the .next folder
```

#### Railway
```bash
# Connect GitHub repo
# Add environment variables
# Deploy automatically
```

#### Self-hosted
```bash
npm run build
npm start
# Use PM2 or similar for process management
```

---

## 📜 Scripts

### Development & Production

```bash
# Development
npm run dev              # Start dev server with Turbopack
npm run dev:webpack      # Start dev server with Webpack

# Production
npm run build            # Build for production
npm start                # Start production server

# Code Quality
npm run lint             # Run ESLint
```

### Utility Scripts

```bash
# Create admin user (interactive)
npx ts-node scripts/make-admin.ts

# Check authentication fields
npx ts-node scripts/auth-field-check.ts
```

**Admin Creation:**
The script provides an interactive menu to:
- Create a new admin user
- Update an existing user to admin role

### Testing Scripts

```bash
# Run E2E tests (requires Playwright)
python scripts/auth-e2e.py              # Test authentication flow
python scripts/interconnection-test.py  # Test page interconnections

# Interactive test runner
scripts/run-test.bat    # Windows
./scripts/run-test.sh   # Mac/Linux
```

**Testing Prerequisites:**
```bash
pip install playwright
playwright install
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Coding Standards
- Follow TypeScript best practices
- Use ESLint configuration
- Write meaningful commit messages
- Add comments for complex logic
- Test your changes thoroughly

---

## 🧪 Testing

ParcelPort includes end-to-end tests to verify the interconnection between Student, Admin, and Staff portals.

### Quick Test Setup

1. **Install Playwright**
   ```bash
   pip install playwright
   playwright install
   ```

2. **Start Dev Server**
   ```bash
   npm run dev
   ```

3. **Create Admin Account**
   ```bash
   npx ts-node scripts/make-admin.ts
   ```

4. **Run Tests**
   ```bash
   # Test page interconnections (recommended)
   python scripts/interconnection-test.py
   
   # Test authentication flow
   python scripts/auth-e2e.py
   
   # Or use interactive runner
   scripts/run-test.bat    # Windows
   ./scripts/run-test.sh   # Mac/Linux
   ```

### What Gets Tested

- ✅ Student registers parcel → Appears on Admin page
- ✅ Admin approves payment → Status updates on Student page
- ✅ Admin assigns to staff → Appears on Staff page
- ✅ Staff updates status → Reflects on Student page

Tests automatically take screenshots at each step (saved in `screenshots/` folder).

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Firebase](https://firebase.google.com/) - Backend infrastructure
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Lucide](https://lucide.dev/) - Icon library

---

## 📞 Support

For support, email sanataniayushjha07@gmail.com or open an issue on GitHub.

---

## 🗺️ Roadmap

- [ ] Mobile app (React Native)
- [ ] SMS notifications
- [ ] Email notifications
- [ ] Advanced analytics
- [ ] Route optimization for delivery
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Bulk parcel upload
- [ ] API documentation
- [ ] Webhook integrations
- [ ] Automated E2E testing in CI/CD

---

<div align="center">

### Built with ❤️ for efficient university parcel management

**[⬆ Back to Top](#-parcelport)**

</div>
