import { useNavigate } from "react-router-dom";
import MediaItemForm from "../MediaItemForm/MediaItemForm";

function AddItem() {
  const navigate = useNavigate();

  async function handleSubmit(formData) {
    const res = await fetch("/api/media", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.errors ? data.errors.join(", ") : "Failed to add item");
    }
    navigate("/library");
  }

  return <MediaItemForm onSubmit={handleSubmit} submitLabel="Add item" />;
}

export default AddItem;