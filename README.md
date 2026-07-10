# Notice Board

A full CRUD Notice Board built with the provided requirements and functionalities.

**Live app:** https://notice-board-umber-beta.vercel.app/

**Git Repo:** https://github.com/problem-solver-man/notice-board

## Tech stack

- Next.js (Pages Router)
- Prisma ORM (v6)
- TiDB Cloud (MySQL-compatible, free Serverless tier)
- Tailwind CSS
- Deployed on Vercel (Hobby tier)

## Features

- Create, view, edit, and delete notices
- Fields: title, body, category (Exam/Event/General), priority (Normal/Urgent), publish date
- Urgent notices are sorted above Normal notices via a Prisma query on the server (not client-side sorting), with a red "Urgent" badge
- Server-side validation on all create/update API routes — required fields and date validity are checked in the API route itself, independent of the browser form
- Delete requires a confirmation modal
- Responsive card layout for phone and desktop

## Running locally

1. Clone the repo:
```
git clone https://github.com/problem-solver-man/notice-board.git
cd notice-board
```
2. Install dependencies:
```
npm install
```
3. Create a `.env` file in the root with your own database connection string:
```
DATABASE_URL="mysql://<your-tidb-connection-string>"
```
4. Generate the Prisma client and apply the schema:
```
npx prisma generate
npx prisma migrate dev
```
5. Run the dev server:
```
npm run dev
```
6. Open http://localhost:3000

## What I'd improve with more time

Image upload for notices — it's in the schema as an optional field, but I deferred it to focus on getting core CRUD, validation, and the Urgent-ordering rule fully correct first. With more time I'd add it via a free image host (e.g. Cloudinary's free tier) rather than storing files locally, since Vercel's filesystem isn't persistent.

## Where and how AI was used

I used Claude to help plan the project structure, write the Prisma schema, API routes, and React components, and to troubleshoot two issues I hit: 
1. Prisma v7 breaking change during migrate dev and 
2. Vercel deployment configuration.  

I reviewed and tested every part before committing like running curl tests against the API routes, verifying validation errors, and checking data persistence after refresh and redeploy.
