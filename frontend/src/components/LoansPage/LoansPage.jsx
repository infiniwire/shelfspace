import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { STATUS_OPTIONS } from "../../constants/loanOptions";
import "./LoansPage.css";

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
      </div>

      <div className="loans-list">
        {loans.map((loan) => (
          <div className="loans-row" key={loan._id}>
            <div>
              <p className="loans-row-borrower-name">{loan.borrowerName}</p>
              <p className="loans-row-due">{loan.dueDate}</p>
              <p className="loans-row-status">{loan.status}</p>
            </div>
          </div>
        ))}
        {loans.length === 0 && <p className="loans-empty">No loans found.</p>}
      </div>
    </div>
  );
}
export default LoansPage;
