import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { STATUS_VALUES } from "../../constants/mediaOptions";
import "./Library.css";

function Library() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (status) params.set("status", status);
    fetch(`/api/media?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => setItems(data));
  }, [search, status]);

  return (
    <div className="library-page">
      <div className="library-controls">
        <input
          placeholder="Search title"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          {STATUS_VALUES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <Link to="/add-item" className="library-add-button">+ Add item</Link>
      </div>

      <div className="library-list">
        {items.map((item) => (
          <Link to={`/edit-item/${item._id}`} className="library-row" key={item._id}>
            <div>
              <p className="library-row-title">{item.title}</p>
              <p className="library-row-sub">{item.mediaType} · {item.genre}</p>
            </div>
            <span className="library-row-status">{item.status}</span>
          </Link>
        ))}
        {items.length === 0 && <p className="library-empty">No items found.</p>}
      </div>
    </div>
  );
}

export default Library;