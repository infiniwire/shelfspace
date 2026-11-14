# ShelfSpace

A personal library and lending tracker for people who share books, films and games with friends. Catalog your collection by status and genre, log every loan, and see at a glance what's overdue and who has it.

![ShelfSpace screenshot](docs/screenshot.png)

**Live demo:** [TODO: deployed URL]
**Demo video:** [TODO: video URL]

## Authors

- **Tor Ekstrom**: Lending Log (`loans` collection, routes and React components)
- **Thejaswini Srinivasan Manjula**: Personal Library (`media` collection, routes and React components)

Each of us built the full stack for our own feature: MongoDB collection, Express routes and React components.

## Class

Built for **CS 5610 Web Development** at Northeastern University: [TODO: class link]

## Project objective

It's easy to lose track of what you own, what you've read, and who still has the DVD you lent out months ago. ShelfSpace gives you one place to:

- **Catalog** your books, movies, video games and tabletop games, and track whether you want to read them, are reading them, or have finished them.
- **Log every loan**: who borrowed what, when it went out and when it's due back.
- **See what's overdue** and who has it, with the borrower's contact details, so you can follow up without searching through old messages.

Every user has a private account and sees only their own library and loans.

## Features

### Personal Library

- Add, edit and delete items. Each media type has its own fields (author and ISBN for books, platform and ESRB rating for video games, and so on).
- Search by title and filter by status.

### Lending Log

- Create a loan by choosing an item from your library and entering the borrower's name, email, date out and due date.
- Edit a loan, mark it returned in one click, or delete it.
- Filter loans by **Active**, **Overdue** or **Returned**. Overdue status is calculated from the due date, so loans become overdue on their own with no manual updates.
- Prevents lending an item that is already out.

## How to use ShelfSpace

1. **Sign up** with an email and password, or log in. A demo account comes with the seed data (see [Seeding the database](#4-seed-the-database)).
2. **My Library** lists your collection. Use **+ Add item** to catalog something new, the search box and status filter to find items, and **Update** / **Delete** on each row to change them.
3. **My Loans** lists everything you've lent.
   - **+ Add loan**: choose the item, then enter who borrowed it and when it's due.
   - Use the filter to show only **Overdue** loans when you want to follow up.
   - **Mark Returned** when an item comes back. **Edit Details** fixes mistakes, and **Delete** removes a loan entirely.
4. **Log out** from the navigation bar when you're done.

## Tech stack

| Layer          | Technology                                                          |
| -------------- | ------------------------------------------------------------------- |
| Frontend       | React 19 with hooks, React Router, PropTypes, built with Vite       |
| Backend        | Node.js, Express 5                                                  |
| Database       | MongoDB with the official native driver (no Mongoose)               |
| Authentication | Passport (local strategy), express-session, bcrypt password hashing |
| Seed data      | Faker                                                               |
| Code quality   | ESLint, Prettier                                                    |

The frontend is client-side rendered and talks to the backend only through `fetch` calls to `/api/...`. In development, Vite proxies those requests to Express, so no CORS library is needed.

## Build and run locally

### Prerequisites

- [Node.js](https://nodejs.org/) 22 or newer (developed on Node 24)
- A MongoDB database: a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster or a local MongoDB server

### 1. Clone and install

The backend and frontend each have their own `package.json`, so install dependencies in both folders:

```bash
git clone https://github.com/thejuu5/shelfspace.git
cd shelfspace
npm install
cd frontend
npm install
cd ..
```

### 2. Configure environment variables

Copy the example file and fill in your own values:

```bash
cp .env.example .env
```

| Variable         | Required | Description                                                                   |
| ---------------- | -------- | ----------------------------------------------------------------------------- |
| `MONGODB_URI`    | Yes      | Your MongoDB connection string                                                |
| `DB_NAME`        | Yes      | Database name, e.g. `shelfspace`                                              |
| `SESSION_SECRET` | Yes      | A long random string used to sign session cookies (see below)                 |
| `PORT`           | No       | Port for the Express server. Defaults to `3000`, which the Vite proxy expects |

Generate a session secret with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

`.env` is gitignored. Never commit real credentials.

### 3. Start the servers

Run the backend and frontend in **two separate terminals**:

```bash
# Terminal 1: Express API on http://localhost:3000 (restarts on file changes)
npm run dev
```

```bash
# Terminal 2: React app on http://localhost:5173
cd frontend
npm run dev
```

Open **http://localhost:5173**.

> **Note:** sessions are stored in server memory, so every time the backend restarts (including automatic restarts when you save a backend file), you'll need to log in again.

### 4. Seed the database

To fill the database with synthetic data (50 users, 1,000 media items and around 3,000 loans):

```bash
node dataGeneration/loadMongo.js
```

> **Warning:** this **deletes everything** in the `users`, `media` and `loans` collections before reseeding.

You can then log in with the demo account, which owns a large share of the seeded library:

- **Email:** `demo@shelfspace.test`
- **Password:** `password123`

All seeded accounts use this development-only password.

### Other scripts

| Where       | Command          | Does                                     |
| ----------- | ---------------- | ---------------------------------------- |
| root        | `npm start`      | Run the backend without auto-restart     |
| root        | `npm run lint`   | Lint the backend with ESLint             |
| root        | `npm run format` | Format all files with Prettier           |
| `frontend/` | `npm run build`  | Build the React app into `frontend/dist` |
| `frontend/` | `npm run lint`   | Lint the frontend with ESLint            |

## Project structure

```
shelfspace/
├── app.js                   # Express app: sessions, Passport, API routes
├── bin/www                  # Server entry point
├── server/
│   ├── db.js                # MongoDB connection
│   ├── passport-config.js   # Local login strategy, session (de)serialization
│   ├── middleware/          # requireAuth
│   ├── routes/              # auth.js, media.js, loans.js
│   ├── validators/          # Request body validation for media and loans
│   └── utils/               # Loan status calculation and filters
├── dataGeneration/          # Faker seed scripts and loader
├── docs/
│   └── dataDictionary.md    # Collections, fields and relationships
└── frontend/
    ├── index.html
    ├── vite.config.js       # Dev server + /api proxy to Express
    └── src/
        ├── App.jsx          # Routes
        ├── components/      # One folder per component: .jsx + matching .css
        └── constants/       # Dropdown options shared by forms and filters
```

## API

All routes except signup and login require a logged-in session, and every query is limited to the current user's data.

| Method | Route            | Description                                                                          |
| ------ | ---------------- | ------------------------------------------------------------------------------------ |
| POST   | `/api/signup`    | Create an account and log in                                                         |
| POST   | `/api/login`     | Log in                                                                               |
| POST   | `/api/logout`    | Log out                                                                              |
| GET    | `/api/me`        | The current user, or 401                                                             |
| GET    | `/api/media`     | List your items. Optional `?status=`, `?genre=`, `?mediaType=`, `?search=`           |
| GET    | `/api/media/:id` | One item                                                                             |
| POST   | `/api/media`     | Create an item                                                                       |
| PUT    | `/api/media/:id` | Update an item                                                                       |
| DELETE | `/api/media/:id` | Delete an item                                                                       |
| GET    | `/api/loans`     | List your loans with each item's title. Optional `?status=active\|overdue\|returned` |
| GET    | `/api/loans/:id` | One loan                                                                             |
| POST   | `/api/loans`     | Create a loan (the item must be yours and not already lent out)                      |
| PUT    | `/api/loans/:id` | Edit a loan's borrower and dates                                                     |
| PATCH  | `/api/loans/:id` | Mark a loan returned                                                                 |
| DELETE | `/api/loans/:id` | Delete a loan                                                                        |

See [docs/dataDictionary.md](docs/dataDictionary.md) for every field in each collection and how they relate.

## Use of AI

This README was drafted with the help of Claude (Anthropic) and reviewed by the authors.

## License

[MIT](LICENSE)
