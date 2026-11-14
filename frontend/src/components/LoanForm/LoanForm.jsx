import { useState } from "react";
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

function LoanForm({
  initialValues = null,
  onSubmit,
  submitLabel,
  onDelete = null,
}) {
  const [mediaItems, setMediaItems] = useState([]);
  const [form, setForm] = useState({ ...emptyForm, ...initialValues });
  const [error, setError] = useState("");

  fetch("/api/media")
    .then((res) => {
      if (!res.ok) throw new Error("Could not load your items");
      return res.json();
    })
    .then((data) => setMediaItems(data))
    .catch((err) => setError(err.message));

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

      <label>
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

      <label>
        Borrower
        <input
          value={form.borrowerName}
          onChange={(e) => update("borrowerName", e.target.value)}
          required
        />
      </label>

      <label>
        Borrower
        <input
          value={form.borrowerEmail}
          onChange={(e) => update("borrowerEmail", e.target.value)}
          required
        />
      </label>

      <label>
        Loan Date
        <input
          value={form.dateOut}
          onChange={(e) => update("dateOut", e.target.value)}
          required
        />
      </label>

      <label>
        Due Date
        <input
          value={form.dueDate}
          onChange={(e) => update("dueDate", e.target.value)}
          required
        />
      </label>

      <label>
        Return Date
        <input
          value={form.dateReturned}
          onChange={(e) => update("dateReturned", e.target.value)}
          required
        />
      </label>

      <div className="media-form-actions">
        <button type="submit">{submitLabel}</button>
        {onDelete && (
          <button
            type="button"
            className="media-form-delete"
            onClick={onDelete}
          >
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
};

export default LoanForm;
