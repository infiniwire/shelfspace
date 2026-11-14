import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LoanForm from "../LoanForm/LoanForm";

function EditLoan() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loan, setLoan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/loans/${id}`)
      .then((res) => res.json())
      .then((data) => setLoan(data))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(formData) {
    const res = await fetch(`/api/loans/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(
        data.errors ? data.errors.join(", ") : "Failed to update loan"
      );
    }
    navigate("/loans");
  }

  async function handleDelete() {
    if (!window.confirm("Delete this item?")) return;
    await fetch(`/api/loans/${id}`, { method: "DELETE" });
    navigate("/loans");
  }

  if (loading) return <p>Loading...</p>;
  if (!loan) return <p>Item not found.</p>;

  return (
    <LoanForm
      initialValues={loan}
      onSubmit={handleSubmit}
      submitLabel="Save changes"
      onDelete={handleDelete}
    />
  );
}

export default EditLoan;
