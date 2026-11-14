import { ObjectId } from "mongodb";
// ownerId: handled by auth

export function validateLoan(body) {
  const errors = [];
  const now = new Date();

  // itemId: needs to be a valid objectId
  if (!body.itemId || !ObjectId.isValid(body.itemId)) {
    errors.push("ItemID is invalid");
  }

  // borrowerName
  if (
    !body.borrowerName ||
    typeof body.borrowerName !== "string" ||
    body.borrowerName.trim().length < 2
  ) {
    errors.push("A borrower name of at least two characters is required");
  }

  // borrowerEmail: needs to be a valid email address.
  if (
    body.borrowerEmail &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.borrowerEmail)
  ) {
    errors.push("Borrower Email must be a valid address or empty");
  }

  // verify actual dates
  const dateOut = new Date(body.dateOut);
  if (isNaN(dateOut)) {
    errors.push("Date Out must be a valid date");
  }
  const dueDate = new Date(body.dueDate);
  if (isNaN(dueDate)) {
    errors.push("Due Date must be a valid date");
  }

  if (!isNaN(dateOut) && !isNaN(dueDate)) {
    // dateOut: needs to be a date, now or in the past
    if (dateOut > now) {
      errors.push("Date Out must not be in the future");
    }
    // dueDate: needs to be a data after dateOut
    if (dateOut > dueDate) {
      errors.push("Due date must be equivalent or after date out");
    }
  }

  // dateReturned: needs to be null or a valid date the same or after dateOut
  if (body.dateReturned) {
    const dateReturned = new Date(body.dateReturned);
    if (isNaN(dateReturned)) {
      errors.push("Date Returned must be a valid date");
    } else if (dateOut > dateReturned) {
      errors.push("Date Returned must be equivalent or after date out");
    }
  }

  return errors;
}
