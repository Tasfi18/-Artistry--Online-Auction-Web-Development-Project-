# Artistry: online art auction

A web app where artists list their work and buyers bid on it in timed auctions. Built with React, Express and MySQL as a web programming lab project. The site is branded **Artisify** in the interface.

![Artisify home page](docs/screenshots/home.png)

## Features

- **Artists** sign up, upload artworks with a title, description, category and base price, and see their own artworks and their status.
- **Admins** review submitted artworks, approve them and open an auction with a start time, end time and starting bid.
- **Buyers** browse live and upcoming auctions, filter by category, and bid. A bid must beat the current highest bid, and bids are refused once an auction has closed.
- **Auction status** moves from pending to active at the start time and to closed at the end time. The highest bidder wins.
- **Buyer pages:** won auctions in a cart, and the auctions they are currently bidding in.
- **Profiles** for artists and buyers, with profile pictures and public profile pages.
- **Reviews** and art categories (paintings, drawings, sculpture, rare things).

## Tech stack

| Part | Built with |
| --- | --- |
| Front end | React 18, React Router, Vite, Axios, React Slick |
| API | Node.js, Express, Multer for image uploads, bcrypt password hashing |
| Database | MySQL |

## Project structure

```
client/                  React app (Vite)
  src/components/        pages and components
  src/api.js             the API base URL
  public/images/         artwork and profile images
server/                  Express API
  server.js              routes are mounted under /api
  routes/                auctions, artworks, artists, buyers, admin, carts, categories, reviews, uploads
  lib/                   password hashing and bid rules
  db_connection/         MySQL connection, settings from .env
  test/                  API and unit tests
```

## Run it locally

Requirements: Node.js 18 or later and MySQL 8.

**1. Database.** Create a database named `ae_db` with the app's tables (`artist`, `buyer`, `admin`, `artwork`, `auction`, `bid`, `category`, `review`, `loggedin` and the cart tables). The schema is not included in this repository. The `Password` columns need room for a bcrypt hash, so make them at least `VARCHAR(60)`.

**2. API**

```bash
cd server
cp .env.example .env      # set DB_USER, DB_PASSWORD and DB_NAME
npm install
npm run dev               # http://localhost:8000
```

**3. Front end**

```bash
cd client
cp .env.example .env      # VITE_API_URL=http://localhost:8000
npm install
npm run dev               # http://localhost:5173
```

## Tests

```bash
cd server
npm test
```

The tests cover password hashing, the bid rules (higher than the current bid, no bids on pending or closed auctions, valid amounts) and the sign-up and sign-in routes, using a stand-in for the database so no MySQL server is needed. GitHub Actions runs them and builds the front end on every push.

## Security notes

- Passwords are hashed with bcrypt when an account is created. Accounts created before this change still sign in with their old password.
- The API never sends a password back in a response.
- Database credentials live in `server/.env`, which git ignores.

## Known limitations

- Sign-in state is kept in a single `loggedin` table row, so only one person can be signed in at a time. Moving to sessions or tokens would be the next step.
- Image uploads are written into `client/public/images`, so the API and front end must run from the same folder.
