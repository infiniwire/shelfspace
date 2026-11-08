# ShelfSpace Data Dictionary

ShelfSpace stores its data in MongoDB (native driver, no Mongoose) in three collections:

| Collection | Owner                 | Purpose                                       | Seeded count    |
| ---------- | --------------------- | --------------------------------------------- | --------------- |
| `users`    | Shared (auth)         | Accounts for Passport local login             | 50              |
| `media`    | Thejaswini Srinivasan | The items in each user's personal library     | 1,000           |
| `loans`    | Tor Ekstrom           | Lending records: who has which item, and when | ~3,079 (varies) |

Seed data is produced by the scripts in [`dataGeneration/`](../dataGeneration) and loaded with:

```bash
node dataGeneration/loadMongo.js
```

The loader clears all three collections and reseeds them, in this order: users → media → loans.

## Relationships

```
users._id ──┬──< media.ownerId
            └──< loans.ownerId

media._id ─────< loans.itemId
```

- A user owns many media items and many loans.
- A media item can have many loans over time, but **at most one open loan** (`dateReturned: null`) at a time.
- Borrowers are **not** app users. They are stored as a plain name and email on the loan.
- Every query is scoped to the logged-in user (`ownerId: req.user._id`).

---

## `users`

| Field          | Type     | Required | Description                                               | Example                    |
| -------------- | -------- | -------- | --------------------------------------------------------- | -------------------------- |
| `_id`          | ObjectId | Yes      | Primary key                                               | `ObjectId("6730...")`      |
| `email`        | String   | Yes      | Login identifier; unique                                  | `"demo@shelfspace.test"`   |
| `passwordHash` | String   | Yes      | bcrypt hash (cost 10). The plain password is never stored | `"$2b$10$..."`             |
| `createdAt`    | Date     | Yes      | Account creation time                                     | `2023-04-18T14:02:11.000Z` |

**Seed notes**

- The first user is always the demo account `demo@shelfspace.test`.
- All seeded users share one development-only password (see `generateUser.js`).
- The demo user is weighted to own about 5× more media than other users, so the demo has a full library.

---

## `media`

Each document is one physical item: a book, movie, video game or tabletop game. Every item has the common fields, plus extra fields that depend on its `mediaType`.

### Common fields

| Field         | Type     | Required | Allowed values / format                        | Description                             |
| ------------- | -------- | -------- | ---------------------------------------------- | --------------------------------------- |
| `_id`         | ObjectId | Yes      |                                                | Primary key                             |
| `ownerId`     | ObjectId | Yes      | references `users._id`                         | User who owns the item                  |
| `mediaType`   | String   | Yes      | `Book`, `Movie`, `Video Game`, `Tabletop Game` | Decides which extra fields are present  |
| `title`       | String   | Yes      |                                                | Item title                              |
| `genre`       | String   | Yes      | Depends on `mediaType` (see below)             | Used for filtering                      |
| `releaseYear` | Number   | Yes      | 4-digit year, no later than the current year   | Year of release / publication           |
| `status`      | String   | Yes      | `Want-to-read`, `Reading`, `Finished`          | The owner's reading / watching progress |
| `condition`   | String   | Yes      | `New`, `Like New`, `Good`, `Fair`, `Worn`      | Physical condition                      |
| `addedDate`   | Date     | Yes      | Between the owner's `createdAt` and now        | When the item was added to the library  |

> Whether an item is **lent out** is _not_ stored on `media`. It is derived from `loans`: an item is lent out if it has a loan with `dateReturned: null`.

### Book (`mediaType: "Book"`)

| Field       | Type   | Required | Description / format                                                |
| ----------- | ------ | -------- | ------------------------------------------------------------------- |
| `isbn`      | String | Yes      | ISBN-13                                                             |
| `author`    | String | Yes      |                                                                     |
| `publisher` | String | Yes      |                                                                     |
| `series`    | String | No       | Present on about 20% of books                                       |
| `pageCount` | Number | Yes      | 120–900                                                             |
| `format`    | String | Yes      | `Hardcover`, `Paperback`, `Mass Market Paperback`, `Audiobook (CD)` |

### Movie (`mediaType: "Movie"`)

| Field            | Type   | Required | Description / format                          |
| ---------------- | ------ | -------- | --------------------------------------------- |
| `upc`            | String | Yes      | 12 digits                                     |
| `director`       | String | Yes      |                                               |
| `runtimeMinutes` | Number | Yes      | 75–180                                        |
| `rating`         | String | Yes      | `G`, `PG`, `PG-13`, `R`, `NC-17`, `Not Rated` |
| `format`         | String | Yes      | `DVD`, `Blu-ray`, `4K UHD`, `VHS`             |

Genres: Action, Adventure, Animation, Comedy, Crime, Documentary, Drama, Family, Fantasy, Horror, Musical, Mystery, Romance, Sci-Fi, Thriller, War, Western.

### Video Game (`mediaType: "Video Game"`)

| Field        | Type   | Required | Description / format                                                                                |
| ------------ | ------ | -------- | --------------------------------------------------------------------------------------------------- |
| `upc`        | String | Yes      | 12 digits                                                                                           |
| `developer`  | String | Yes      |                                                                                                     |
| `publisher`  | String | Yes      |                                                                                                     |
| `platform`   | String | Yes      | e.g. `PS5`, `Nintendo Switch`, `PC`, `GameCube`; `releaseYear` falls within the platform's lifespan |
| `esrbRating` | String | Yes      | `E`, `E10+`, `T`, `M`                                                                               |

Genres: Action, Adventure, Fighting, Platformer, Puzzle, Racing, Roguelike, RPG, Shooter, Simulation, Sports, Strategy, Survival Horror.

### Tabletop Game (`mediaType: "Tabletop Game"`)

| Field             | Type   | Required | Description / format                   |
| ----------------- | ------ | -------- | -------------------------------------- |
| `upc`             | String | Yes      | 12 digits                              |
| `designer`        | String | Yes      |                                        |
| `publisher`       | String | Yes      |                                        |
| `ageRating`       | String | Yes      | `6+`, `8+`, `10+`, `12+`, `14+`, `18+` |
| `minPlayers`      | Number | Yes      | 1–2                                    |
| `maxPlayers`      | Number | Yes      | 2–8, and at least `minPlayers`         |
| `playTimeMinutes` | Number | Yes      | 15, 30, 45, 60, 90, 120, or 180        |

Genres: Area Control, Cooperative, Deck-Building, Legacy, Party, Roll-and-Write, Social Deduction, Strategy, Tabletop RPG, Trivia, Wargame, Worker Placement.

**Seed mix:** about 40% books, 30% movies, 20% video games, 10% tabletop games.

---

## `loans`

Each document is one lending record: a single item lent to a single borrower.

| Field           | Type         | Required | Allowed values / format            | Description                                       |
| --------------- | ------------ | -------- | ---------------------------------- | ------------------------------------------------- |
| `_id`           | ObjectId     | Yes      |                                    | Primary key                                       |
| `ownerId`       | ObjectId     | Yes      | references `users._id`             | User who lent the item (same as the item's owner) |
| `itemId`        | ObjectId     | Yes      | references `media._id`             | The item that was lent                            |
| `borrowerName`  | String       | Yes      |                                    | Borrower's full name                              |
| `borrowerEmail` | String       | Yes      | Email address                      | Used for overdue reminders                        |
| `dateOut`       | Date         | Yes      | On or after the item's `addedDate` | When the item was lent                            |
| `dueDate`       | Date         | Yes      | 14–21 days after `dateOut`         | When the item should come back                    |
| `dateReturned`  | Date \| null | Yes      | `null` while the loan is open      | When the item came back; set by "mark returned"   |

### Loan state (derived, not stored)

| State        | Condition                                    |
| ------------ | -------------------------------------------- |
| **Active**   | `dateReturned` is `null` and `dueDate` ≥ now |
| **Overdue**  | `dateReturned` is `null` and `dueDate` < now |
| **Returned** | `dateReturned` is a Date                     |

Overdue query:

```js
db.collection("loans").find({
  ownerId: req.user._id,
  dateReturned: null,
  dueDate: { $lt: new Date() },
});
```

### Rules

- An item has **at most one open loan** at a time.
- An item's loans never overlap: each loan's `dateReturned` comes before the next loan's `dateOut`.
- `dateReturned` may be later than `dueDate` (the item was returned late).

### Seed notes

The generator (`generateLoans.js`) builds each item's history **backwards from today**:

- Each item first gets a latest state: active (3), returned (2), overdue (1), or never lent (1), as relative weights.
- Earlier loans are then generated, newest to oldest, with gaps of 1–60 days between them. Generation stops at 9 loans or when it reaches the item's `addedDate`.
- Overdue loans are up to about 69 days past due.
- Borrower name and email are generated together, so the email matches the name.

---

## Suggested indexes

| Collection | Index                                 | Supports                                 |
| ---------- | ------------------------------------- | ---------------------------------------- |
| `users`    | `{ email: 1 }` (unique)               | Login lookup, duplicate-signup check     |
| `media`    | `{ ownerId: 1, status: 1, genre: 1 }` | Library list with status / genre filters |
| `loans`    | `{ ownerId: 1, dateReturned: 1 }`     | Active / overdue / returned lists        |
| `loans`    | `{ itemId: 1, dateReturned: 1 }`      | "Is this item lent out?" lookups         |
