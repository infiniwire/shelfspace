import { faker } from "@faker-js/faker";

function convertDay(days) {
  return days * 24 * 60 * 60 * 1000;
}

const generateLoans = (item, maxLoans) => {
  const loans = [];
  const now = new Date();
  let cursor = now;
  const loops = faker.number.int({ min: 1, max: maxLoans });

  const lastStatus = faker.helpers.weightedArrayElement([
    { weight: 3, value: "active" },
    { weight: 1, value: "overdue" },
    { weight: 2, value: "returned" },
    { weight: 1, value: "never lent" },
  ]);
  if (lastStatus === "never lent") return [];

  for (let i = 0; i < loops; i++) {
    let dueDate, dateOut, dateReturned;
    if (i === 0 && (lastStatus === "active" || lastStatus === "overdue")) {
      if (lastStatus === "active") {
        dueDate = faker.date.soon({ days: 7 });
      } else if (lastStatus === "overdue") {
        dueDate = faker.date.recent({ days: 69 });
      }
      dateOut = faker.date.between({
        from: dueDate - convertDay(21),
        to: dueDate - convertDay(14),
      });
      dateReturned = null;
    } else {
      dateReturned = cursor - convertDay(faker.number.int({ min: 1, max: 60 }));
      dateReturned = new Date(dateReturned);
      dateOut =
        dateReturned - convertDay(faker.number.int({ min: 1, max: 30 }));
      dateOut = new Date(dateOut);
      dueDate =
        dateOut.getTime() + convertDay(faker.number.int({ min: 14, max: 21 }));
      dueDate = new Date(dueDate);
    }
    if (dateOut < item.addedDate) {
      break;
    }

    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    loans.push({
      ownerId: item.ownerId,
      itemId: item._id,
      borrowerName: `${firstName} ${lastName}`,
      borrowerEmail: faker.internet.email({ firstName, lastName }),
      dateOut,
      dueDate,
      dateReturned,
    });
    cursor = dateOut;
  }
  return loans;
};

export const generateAllLoans = (media) =>
  media.flatMap((item) => generateLoans(item, 9));
