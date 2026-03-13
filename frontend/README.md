Premium Next.js frontend for **Doctor Scheduler**.

## Prerequisites

- Run the backend on `http://localhost:4000`
- Node.js 20+

## Environment variables

Create `frontend/.env.local`:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

## Getting Started

First, install deps and run the dev server:

```bash
npm install
npm run dev
```

Open `http://localhost:3000` with your browser.

## Pages

- `/` landing (GSAP ScrollTrigger reveals + parallax)
- `/doctors` directory (Framer hover tilt)
- `/book` booking flow (calendar + slot grid + Lottie confirmation)
- `/dashboard/patient` patient timeline (cancel/reschedule)
- `/dashboard/doctor` doctor schedule + patient list

## Tech stack

- Next.js (App Router), React
- TailwindCSS (dark mode via `.dark` class + localStorage)
- Framer Motion (page transitions + micro-interactions)
- GSAP + ScrollTrigger (scroll reveals, hero drift, parallax)
- Lenis (smooth scrolling)
- ShadCN-style components (Radix primitives)
- Lottie (booking confirmation + empty states)
- React Icons

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
