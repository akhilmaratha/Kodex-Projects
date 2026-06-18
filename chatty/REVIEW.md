# Chatty Code Review

Reviewer: Nayan Mahato  
Repository owner: Akhil Maratha  
Reviewed project: Chatty real-time chat application  
Feature branch: `review/Nayan`

## Overview

This review covered the Chatty frontend and backend implementation. The app uses Next.js on the frontend, Express/Mongoose on the backend, JWT authentication, and Socket.IO for real-time messaging.

The main review focus was code quality, structure, security, runtime bugs, and documentation. I preserved the existing core feature behavior while hardening unsafe paths and making the chat client more stable.

## Issues Found

1. Group mutation endpoints did not enforce admin-only access.
   - Files: `backend/controllers/chatController.js`
   - Impact: Any authenticated user who knew a group chat id could attempt rename/add/remove actions.

2. Message APIs did not verify chat membership.
   - Files: `backend/controllers/messageController.js`
   - Impact: A user could request or send messages for a chat they were not part of if they knew the chat id.

3. Group creation accepted unsafe or malformed payloads.
   - Files: `backend/controllers/chatController.js`
   - Impact: Invalid JSON or invalid user ids could crash the request or create inconsistent group data.

4. Auth middleware response flow was not fully guarded.
   - Files: `backend/middleware/authMiddleware.js`
   - Impact: Failed token paths returned responses but did not consistently stop execution with `return`.

5. User search used raw regex input.
   - Files: `backend/routes/userRoutes.js`
   - Impact: Special regex characters could create unexpected or expensive queries.

6. Chat list fetch could run before auth state was ready.
   - Files: `frontend/src/app/chats/page.js`
   - Impact: Refreshing the chats page could leave the sidebar empty until another action triggered a fetch.

7. Message sending and typing events lacked enough frontend guards.
   - Files: `frontend/src/app/chats/page.js`
   - Impact: Blank messages, missing selected chat state, and stale typing timers could create noisy or invalid requests.

8. Local auth state parsing was fragile.
   - Files: `frontend/src/context/AuthContext.js`
   - Impact: Corrupt `localStorage` data could crash initial auth setup.

9. Documentation was incomplete.
   - Files: `frontend/README.md`
   - Impact: The README was still the default Create Next App text and did not explain the full-stack setup.

## Fixes Applied

1. Hardened chat API authorization.
   - Added ObjectId validation, safe group payload parsing, group admin checks, member checks, duplicate prevention, and safer JSON error responses.
   - Key files: `backend/controllers/chatController.js`, `backend/controllers/messageController.js`, `backend/middleware/authMiddleware.js`, `backend/routes/userRoutes.js`, `backend/server.js`.
   - Commit: `fix: harden chat api authorization`

2. Stabilized frontend chat state.
   - Fetch chats only after auth state is available.
   - Added API URL fallback to login/signup.
   - Guarded message sending by selected chat and trimmed content.
   - Cleared typing timers and disconnected sockets on logout.
   - Switched important chat updates to functional state updates to avoid stale state.
   - Key files: `frontend/src/app/chats/page.js`, `frontend/src/context/AuthContext.js`, `frontend/src/app/login/page.js`, `frontend/src/app/signup/page.js`, `frontend/src/app/layout.js`, `frontend/src/app/page.js`.
   - Commit: `fix: stabilize chat client state`

3. Added review documentation.
   - Added this `REVIEW.md`.
   - Added `reports/nayan-review-checklist.md` with pass/fail/N/A checklist, notes, issues, and future improvements.

## Setup Instructions

### Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```bash
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:3000
```

Run the backend:

```bash
npx nodemon server.js
```

### Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Run the frontend:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Validation

The JavaScript files were syntax-checked with `node --check` for backend files.

Frontend validation:

```bash
cd frontend
npm ci
npm run lint
npm run build
```

Results:

- `npm run lint` passed.
- `npm run build` passed after allowing network access for `next/font/google`.
- `npm ci` reported 4 dependency vulnerabilities, so dependency upgrades should be handled in a follow-up.

## Future Enhancements

- Replace the default `frontend/README.md` with full project-specific documentation.
- Extract the large chats page into smaller components and custom hooks.
- Add backend route tests for auth, group permissions, and message membership.
- Add pagination or infinite scroll for long message histories.
- Add accessibility labels for icon-only buttons.
- Add centralized frontend API helpers and error handling.
- Add role transfer behavior when a group admin leaves a group.
- Review and fix the `npm audit` dependency vulnerabilities.
