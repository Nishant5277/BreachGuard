# BreachGuard

A secure password leak checker and strength analyzer. 
Built with a Node.js Express Backend and React Frontend.

## Architecture & Security
- The plaintext password is **NEVER** sent to the Have I Been Pwned API.
- We use the **k-Anonymity** model: 
  - The password is hashed using SHA-1 locally on the backend.
  - Only the first 5 characters of the hash are sent to the HIBP API.
  - The backend matches the remaining 35 characters locally against the returned list of leaked suffixes.
- Never logs the password or full hash anywhere.
- Password strength is calculated locally using `zxcvbn`.

## Setup
### Backend
1. `cd backend`
2. `npm install`
3. `npm run dev` (starts on port 5000)

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev` (starts Vite server)
