import { faker } from "@faker-js/faker";
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";

const SEED_PASSWORD = "password123";

const createUser = (passwordHash) => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  return {
    _id: new ObjectId(),
    email: faker.internet.email({ firstName, lastName }),
    passwordHash,
    createdAt: faker.date.past({ years: 5 }),
  };
};

export const generateUsers = async (count) => {
  const passwordHash = await bcrypt.hash(SEED_PASSWORD, 10);
  const demoUser = {
    ...createUser(passwordHash),
    email: "demo@shelfspace.test",
  };

  return [
    demoUser,
    ...Array.from({ length: count - 1 }, () => createUser(passwordHash)),
  ];
};
