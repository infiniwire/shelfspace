export function statusFilter(status, now) {
  if (status === "returned") {
    return { dateReturned: { $ne: null } };
  }
  if (status === "overdue") {
    return { dateReturned: null, dueDate: { $lt: now } };
  }
  if (status === "active") {
    return { dateReturned: null, dueDate: { $gte: now } };
  }
  return null;
}

export function getLoanStatus(loan, now) {
  if (loan.dateReturned) {
    return "returned";
  }

  if (loan.dueDate < now) {
    return "overdue";
  }

  return "active";
}
