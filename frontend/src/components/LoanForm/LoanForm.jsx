import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./LoanForm.css";

const emptyForm = {
  itemId: "",
  borrowerName: "",
  borrowerEmail: "",
  dateOut: "",
  dueDate: "",
  dateReturned: "",
};

function toFormValues(loan) {
  if (!loan) return emptyForm;
  return {
    itemId: loan.itemId,
    borrowerName: loan.borrowerName,
    borrowerEmail: loan.borrowerEmail ?? "",
    dateOut: loan.dateOut.slice(0, 10),
    dueDate: loan.dueDate.slice(0, 10),
    dateReturned: loan.dateReturned?.slice(0, 10) ?? "",
  };
}

function LoanForm({
  initialValues = null,
  onSubmit,
  submitLabel,
  onDelete = null,
}) {
  const [mediaItems, setMediaItems] = useState([]);
  const [form, setForm] = useState(toFormValues(initialValues));
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/media")
      .then((res) => {
        if (!res.ok) throw new Error("Could not load your items");
        return res.json();
      })
      .then((data) => setMediaItems(data))
      .catch((err) => setError(err.message));
  }, []);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await onSubmit({ ...form });
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
  }

  return (
    <form className="loan-form" onSubmit={handleSubmit}>
      <h2>Add or Update Loan</h2>
      {error && <p className="loan-form-error">{error}</p>}

      <label className="loan-item-form">
        Item
        <select
          value={form.itemId}
          onChange={(e) => update("itemId", e.target.value)}
          required
          disabled={Boolean(initialValues)}
        >
          <option value="">Choose an item…</option>
          {mediaItems.map((m) => (
            <option key={m._id} value={m._id}>
              {m.title} ({m.mediaType})
            </option>
          ))}
        </select>
      </label>

      <label className="loan-item-form">
        Borrower
        <input
          value={form.borrowerName}
          onChange={(e) => update("borrowerName", e.target.value)}
          required
        />
      </label>

      <label className="loan-item-form">
        Borrower Email
        <input
          type="email"
          value={form.borrowerEmail}
          onChange={(e) => update("borrowerEmail", e.target.value)}
        />
      </label>

      <label className="loan-item-form">
        Loan Date
        <input
          type="date"
          value={form.dateOut}
          onChange={(e) => update("dateOut", e.target.value)}
          required
        />
      </label>

      <label className="loan-item-form">
        Due Date
        <input
          type="date"
          value={form.dueDate}
          onChange={(e) => update("dueDate", e.target.value)}
          required
        />
      </label>

      <label className="loan-item-form">
        Return Date
        <input
          type="date"
          value={form.dateReturned}
          onChange={(e) => update("dateReturned", e.target.value)}
        />
      </label>

      <div className="loan-form-actions">
        <button type="submit">{submitLabel}</button>
        {onDelete && (
          <button type="button" className="loan-form-delete" onClick={onDelete}>
            Delete item
          </button>
        )}
      </div>
    </form>
  );
}

LoanForm.propTypes = {
  initialValues: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
  submitLabel: PropTypes.string.isRequired,
};

export default LoanForm;
