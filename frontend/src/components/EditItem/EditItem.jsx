import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MediaItemForm from "../MediaItemForm/MediaItemForm";

function EditItem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/media/${id}`)
      .then((res) => res.json())
      .then((data) => setItem(data))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(formData) {
    const res = await fetch(`/api/media/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.errors ? data.errors.join(", ") : "Failed to update item");
    }
    navigate("/library");
  }

  async function handleDelete() {
    if (!window.confirm("Delete this item?")) return;
    await fetch(`/api/media/${id}`, { method: "DELETE" });
    navigate("/library");
  }

  if (loading) return <p>Loading...</p>;
  if (!item) return <p>Item not found.</p>;

  return (
    <div>
      <MediaItemForm initialValues={item} onSubmit={handleSubmit} submitLabel="Save changes" />
      <div style={{ textAlign: "center" }}>
        <button onClick={handleDelete} style={{ color: "#e24b4a" }}>Delete item</button>
      </div>
    </div>
  );
}

export default EditItem;