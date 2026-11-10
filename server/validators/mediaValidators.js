const STATUS_VALUES = ["Want-to-read", "Reading", "Finished"];
const CONDITION_VALUES = ["New", "Like New", "Good", "Fair", "Worn"];
const MEDIA_TYPES = ["Book", "Movie", "Video Game", "Tabletop Game"];

const BOOK_FORMATS = ["Hardcover", "Paperback", "Mass Market Paperback", "Audiobook (CD)"];
const BOOK_GENRES = null; // free text allowed for books in this app

const MOVIE_FORMATS = ["DVD", "Blu-ray", "4K UHD", "VHS"];
const MOVIE_RATINGS = ["G", "PG", "PG-13", "R", "NC-17", "Not Rated"];
const MOVIE_GENRES = [
  "Action", "Adventure", "Animation", "Comedy", "Crime", "Documentary",
  "Drama", "Family", "Fantasy", "Horror", "Musical", "Mystery",
  "Romance", "Sci-Fi", "Thriller", "War", "Western",
];

const VG_ESRB = ["E", "E10+", "T", "M"];
const VG_GENRES = [
  "Action", "Adventure", "Fighting", "Platformer", "Puzzle", "Racing",
  "Roguelike", "RPG", "Shooter", "Simulation", "Sports", "Strategy",
  "Survival Horror",
];

const TG_AGE_RATINGS = ["6+", "8+", "10+", "12+", "14+", "18+"];
const TG_PLAYTIMES = [15, 30, 45, 60, 90, 120, 180];
const TG_GENRES = [
  "Area Control", "Cooperative", "Deck-Building", "Legacy", "Party",
  "Roll-and-Write", "Social Deduction", "Strategy", "Tabletop RPG",
  "Trivia", "Wargame", "Worker Placement",
];

function validateCommonFields(body) {
  const errors = [];
  const currentYear = new Date().getFullYear();

  if (!MEDIA_TYPES.includes(body.mediaType)) {
    errors.push(`mediaType must be one of: ${MEDIA_TYPES.join(", ")}`);
  }
  if (!body.title || typeof body.title !== "string" || !body.title.trim()) {
    errors.push("title is required");
  }
  if (!body.genre || typeof body.genre !== "string") {
    errors.push("genre is required");
  }
  if (
    body.releaseYear === undefined ||
    !Number.isInteger(body.releaseYear) ||
    body.releaseYear > currentYear ||
    body.releaseYear < 1000
  ) {
    errors.push(`releaseYear must be a 4-digit year no later than ${currentYear}`);
  }
  if (!STATUS_VALUES.includes(body.status)) {
    errors.push(`status must be one of: ${STATUS_VALUES.join(", ")}`);
  }
  if (!CONDITION_VALUES.includes(body.condition)) {
    errors.push(`condition must be one of: ${CONDITION_VALUES.join(", ")}`);
  }

  return errors;
}

function validateBook(body) {
  const errors = [];
  if (!body.isbn || typeof body.isbn !== "string") errors.push("isbn is required");
  if (!body.author || typeof body.author !== "string") errors.push("author is required");
  if (!body.publisher || typeof body.publisher !== "string") errors.push("publisher is required");
  if (
    body.pageCount === undefined ||
    !Number.isInteger(body.pageCount) ||
    body.pageCount < 120 ||
    body.pageCount > 900
  ) {
    errors.push("pageCount must be a number between 120 and 900");
  }
  if (!BOOK_FORMATS.includes(body.format)) {
    errors.push(`format must be one of: ${BOOK_FORMATS.join(", ")}`);
  }
  if (body.series !== undefined && typeof body.series !== "string") {
    errors.push("series must be a string if provided");
  }
  return errors;
}

function validateMovie(body) {
  const errors = [];
  if (!body.upc || !/^\d{12}$/.test(body.upc)) errors.push("upc must be exactly 12 digits");
  if (!body.director || typeof body.director !== "string") errors.push("director is required");
  if (
    body.runtimeMinutes === undefined ||
    !Number.isInteger(body.runtimeMinutes) ||
    body.runtimeMinutes < 75 ||
    body.runtimeMinutes > 180
  ) {
    errors.push("runtimeMinutes must be a number between 75 and 180");
  }
  if (!MOVIE_RATINGS.includes(body.rating)) {
    errors.push(`rating must be one of: ${MOVIE_RATINGS.join(", ")}`);
  }
  if (!MOVIE_FORMATS.includes(body.format)) {
    errors.push(`format must be one of: ${MOVIE_FORMATS.join(", ")}`);
  }
  if (!MOVIE_GENRES.includes(body.genre)) {
    errors.push(`genre must be one of: ${MOVIE_GENRES.join(", ")}`);
  }
  return errors;
}

function validateVideoGame(body) {
  const errors = [];
  if (!body.upc || !/^\d{12}$/.test(body.upc)) errors.push("upc must be exactly 12 digits");
  if (!body.developer || typeof body.developer !== "string") errors.push("developer is required");
  if (!body.publisher || typeof body.publisher !== "string") errors.push("publisher is required");
  if (!body.platform || typeof body.platform !== "string") errors.push("platform is required");
  if (!VG_ESRB.includes(body.esrbRating)) {
    errors.push(`esrbRating must be one of: ${VG_ESRB.join(", ")}`);
  }
  if (!VG_GENRES.includes(body.genre)) {
    errors.push(`genre must be one of: ${VG_GENRES.join(", ")}`);
  }
  return errors;
}

function validateTabletopGame(body) {
  const errors = [];
  if (!body.upc || !/^\d{12}$/.test(body.upc)) errors.push("upc must be exactly 12 digits");
  if (!body.designer || typeof body.designer !== "string") errors.push("designer is required");
  if (!body.publisher || typeof body.publisher !== "string") errors.push("publisher is required");
  if (!TG_AGE_RATINGS.includes(body.ageRating)) {
    errors.push(`ageRating must be one of: ${TG_AGE_RATINGS.join(", ")}`);
  }
  if (
    body.minPlayers === undefined ||
    !Number.isInteger(body.minPlayers) ||
    body.minPlayers < 1 ||
    body.minPlayers > 2
  ) {
    errors.push("minPlayers must be 1 or 2");
  }
  if (
    body.maxPlayers === undefined ||
    !Number.isInteger(body.maxPlayers) ||
    body.maxPlayers < 2 ||
    body.maxPlayers > 8 ||
    body.maxPlayers < body.minPlayers
  ) {
    errors.push("maxPlayers must be between 2 and 8, and at least minPlayers");
  }
  if (!TG_PLAYTIMES.includes(body.playTimeMinutes)) {
    errors.push(`playTimeMinutes must be one of: ${TG_PLAYTIMES.join(", ")}`);
  }
  if (!TG_GENRES.includes(body.genre)) {
    errors.push(`genre must be one of: ${TG_GENRES.join(", ")}`);
  }
  return errors;
}

export function validateMediaItem(body) {
  let errors = validateCommonFields(body);

  switch (body.mediaType) {
    case "Book":
      errors = errors.concat(validateBook(body));
      break;
    case "Movie":
      errors = errors.concat(validateMovie(body));
      break;
    case "Video Game":
      errors = errors.concat(validateVideoGame(body));
      break;
    case "Tabletop Game":
      errors = errors.concat(validateTabletopGame(body));
      break;
    // if mediaType itself was invalid, validateCommonFields already flagged it
  }

  return errors;
}