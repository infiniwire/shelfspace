import { faker } from "@faker-js/faker";

const CURRENT_YEAR = new Date().getFullYear();

// ---------- Shared helpers ----------

const titleCase = (str) =>
  str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

// Mixes a few title patterns so titles don't all look like "Adjective Noun"
const makeTitle = () => {
  const adjective = faker.word.adjective();
  const noun = faker.word.noun();
  return titleCase(
    faker.helpers.arrayElement([
      `the ${noun} of ${faker.location.city()}`,
      `${adjective} ${noun}`,
      `the ${adjective} ${noun}`,
      `${noun} ${faker.helpers.arrayElement(["II", "rising", "returns", "origins"])}`,
      `a ${noun} in ${faker.date.month()}`,
    ])
  );
};

// Picks a year between `from` and CURRENT_YEAR, weighted toward recent years
const makeYear = (from, recentFrom) =>
  faker.helpers.weightedArrayElement([
    {
      weight: 1,
      value: () => faker.number.int({ min: from, max: recentFrom - 1 }),
    },
    {
      weight: 3,
      value: () => faker.number.int({ min: recentFrom, max: CURRENT_YEAR }),
    },
  ])();

// Fields every item in the lending library has
const makeLendingFields = (owner) => {
  const addedDate = faker.date.between({
    from: owner.createdAt,
    to: new Date(),
  });
  const status = faker.helpers.weightedArrayElement([
    { weight: 6, value: "Wishlist" },
    { weight: 3, value: "In Progress" },
    { weight: 1, value: "Finished" },
  ]);
  return {
    condition: faker.helpers.weightedArrayElement([
      { weight: 1, value: "New" },
      { weight: 3, value: "Like New" },
      { weight: 4, value: "Good" },
      { weight: 2, value: "Fair" },
      { weight: 1, value: "Worn" },
    ]),
    status,
    addedDate,
  };
};

// ---------- Movies ----------

const createFakeMovie = (owner) => ({
  mediaType: "Movie",
  upc: faker.string.numeric(12),
  title: makeTitle(),
  director: faker.person.fullName(),
  releaseYear: makeYear(1930, 1990),
  runtimeMinutes: faker.number.int({ min: 75, max: 180 }),
  genre: faker.helpers.arrayElement([
    "Action",
    "Adventure",
    "Animation",
    "Comedy",
    "Crime",
    "Documentary",
    "Drama",
    "Family",
    "Fantasy",
    "Horror",
    "Musical",
    "Mystery",
    "Romance",
    "Sci-Fi",
    "Thriller",
    "War",
    "Western",
  ]),
  rating: faker.helpers.weightedArrayElement([
    { weight: 1, value: "G" },
    { weight: 2, value: "PG" },
    { weight: 4, value: "PG-13" },
    { weight: 3, value: "R" },
    { weight: 0.2, value: "NC-17" },
    { weight: 0.8, value: "Not Rated" },
  ]),
  format: faker.helpers.weightedArrayElement([
    { weight: 4, value: "DVD" },
    { weight: 4, value: "Blu-ray" },
    { weight: 2, value: "4K UHD" },
    { weight: 0.5, value: "VHS" },
  ]),
  ownerId: owner._id,
  ...makeLendingFields(owner),
});

// ---------- Books ----------

const createFakeBook = (owner) => ({
  mediaType: "Book",
  isbn: faker.commerce.isbn(13),
  title: faker.book.title(),
  author: faker.book.author(),
  publisher: faker.book.publisher(),
  // ~20% of books are part of a series
  series: faker.helpers.maybe(() => faker.book.series(), { probability: 0.2 }),
  releaseYear: makeYear(1850, 1980),
  pageCount: faker.number.int({ min: 120, max: 900 }),
  genre: faker.book.genre(),
  format: faker.helpers.weightedArrayElement([
    { weight: 3, value: "Hardcover" },
    { weight: 5, value: "Paperback" },
    { weight: 2, value: "Mass Market Paperback" },
    { weight: 1, value: "Audiobook (CD)" },
  ]),
  ownerId: owner._id,
  ...makeLendingFields(owner),
});

// ---------- Tabletop games ----------

const createFakeTabletopGame = (owner) => {
  const minPlayers = faker.number.int({ min: 1, max: 2 });
  return {
    mediaType: "Tabletop Game",
    upc: faker.string.numeric(12),
    title: makeTitle(),
    designer: faker.person.fullName(),
    publisher: faker.company.name(),
    releaseYear: makeYear(1970, 2010),
    genre: faker.helpers.arrayElement([
      "Area Control",
      "Cooperative",
      "Deck-Building",
      "Legacy",
      "Party",
      "Roll-and-Write",
      "Social Deduction",
      "Strategy",
      "Tabletop RPG",
      "Trivia",
      "Wargame",
      "Worker Placement",
    ]),
    ageRating: faker.helpers.arrayElement([
      "6+",
      "8+",
      "10+",
      "12+",
      "14+",
      "18+",
    ]),
    minPlayers,
    maxPlayers: faker.number.int({ min: Math.max(minPlayers, 2), max: 8 }),
    playTimeMinutes: faker.helpers.arrayElement([15, 30, 45, 60, 90, 120, 180]),
    ownerId: owner._id,
    ...makeLendingFields(owner),
  };
};

// ---------- Video games ----------

const VIDEO_GAME_PLATFORMS = [
  // [platform, first year, last year games were released]
  ["PS5", 2020, CURRENT_YEAR],
  ["PS4", 2013, 2024],
  ["Xbox Series X|S", 2020, CURRENT_YEAR],
  ["Nintendo Switch", 2017, CURRENT_YEAR],
  ["Nintendo Switch 2", 2025, CURRENT_YEAR],
  ["PC", 1985, CURRENT_YEAR],
  ["Meta Quest 3", 2023, CURRENT_YEAR],
  ["PS VR2", 2023, CURRENT_YEAR],
  ["Nintendo 64", 1996, 2002],
  ["GameCube", 2001, 2007],
  ["PS2", 2000, 2013],
];

const createFakeVideoGame = (owner) => {
  const [platform, firstYear, lastYear] =
    faker.helpers.arrayElement(VIDEO_GAME_PLATFORMS);
  return {
    mediaType: "Video Game",
    upc: faker.string.numeric(12),
    title: makeTitle(),
    developer: faker.company.name(),
    publisher: faker.company.name(),
    platform,
    // Release year has to fall within the platform's lifespan
    releaseYear: faker.number.int({ min: firstYear, max: lastYear }),
    genre: faker.helpers.arrayElement([
      "Action",
      "Adventure",
      "Fighting",
      "Platformer",
      "Puzzle",
      "Racing",
      "Roguelike",
      "RPG",
      "Shooter",
      "Simulation",
      "Sports",
      "Strategy",
      "Survival Horror",
    ]),
    esrbRating: faker.helpers.weightedArrayElement([
      { weight: 2, value: "E" },
      { weight: 2, value: "E10+" },
      { weight: 3, value: "T" },
      { weight: 3, value: "M" },
    ]),
    ownerId: owner._id,
    ...makeLendingFields(owner),
  };
};

// ---------- Mixed library ----------

// Builds `count` items, mixed across all media types
export const generateMedia = (count, users) => {
  const weightedOwners = users.map((user, i) => ({
    weight: i === 0 ? 5 : 1,
    value: user,
  }));
  return faker.helpers.multiple(
    () => {
      const owner = faker.helpers.weightedArrayElement(weightedOwners);
      return faker.helpers.weightedArrayElement([
        { weight: 4, value: createFakeBook },
        { weight: 3, value: createFakeMovie },
        { weight: 2, value: createFakeVideoGame },
        { weight: 1, value: createFakeTabletopGame },
      ])(owner, users);
    },
    { count }
  );
};
export {
  createFakeMovie,
  createFakeBook,
  createFakeTabletopGame,
  createFakeVideoGame,
};
