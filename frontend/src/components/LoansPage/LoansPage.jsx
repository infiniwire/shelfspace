import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { STATUS_OPTIONS } from "../../constants/loanOptions";
import "./LoansPage.css";
import LoanRow from "../LoanRow/LoanRow";

function LoansPage() {
  const [loans, setLoans] = useState([]);
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  async function fetchLoans() {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    const res = await fetch(`/api/loans?${params.toString()}`);
    if (res.status === 401) {
      navigate("/login");
      return;
    }
    const data = await res.json();
    setLoans(data);
  }

  useEffect(() => {
    fetchLoans();
  }, [status]);

  async function handleDelete(id) {
    if (!window.confirm("Delete this loan?")) return;
    const res = await fetch(`/api/loans/${id}`, { method: "DELETE" });
    if (res.ok) {
      setLoans(loans.filter((l) => l._id !== id));
    } else {
      const data = await res.json();
      alert(data.error);
    }
  }

  async function handleReturn(id) {
    if (!window.confirm("Mark this loan as returned?")) return;
    const res = await fetch(`/api/loans/${id}`, { method: "PATCH" });
    if (res.ok) {
      const updated = await res.json();
      setLoans(loans.map((l) => (l._id === id ? updated : l)));
    } else {
      const data = await res.json();
      alert(data.error);
    }
  }

  return (
    <div className="loans-page">
      <div className="loans-controls">
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <Link to="/add-loan" className="loan-add-button">
          + Add Loan
        </Link>
      </div>

      <div className="loans-list">
        {loans.map((loan) => (
          <LoanRow
            key={loan._id}
            loan={loan}
            onDelete={handleDelete}
            onReturn={handleReturn}
          />
        ))}
        {loans.length === 0 && <p className="loans-empty">No loans found.</p>}
      </div>
    </div>
  );
}
export default LoansPage;
