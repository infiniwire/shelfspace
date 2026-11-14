import { useNavigate } from "react-router-dom";
import LoanForm from "../LoanForm/LoanForm";

function AddItem() {
  const navigate = useNavigate();

  async function handleSubmit(formData) {
    const res = await fetch("/api/loans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(
        data.errors ? data.errors.join(", ") : "Failed to add loan"
      );
    }
    navigate("/loans");
  }

  return <LoanForm onSubmit={handleSubmit} submitLabel="Add loan" />;
}

export default AddItem;
