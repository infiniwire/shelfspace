import "./LoanRow.css";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

function LoanRow({ loan, onDelete, onReturn }) {
  return (
    <div className="loan-row">
      <div>
        <p className="loan-row-title">{loan.itemTitle || "(deleted item)"}</p>
        <p className="loan-row-sub">
          {loan.borrowerName} · Due{" "}
          {new Date(loan.dueDate).toLocaleDateString()}
        </p>
        <div className="loan-row-right">
          <p className={`loan-row-status loan-row-status-${loan.status}`}>
            {loan.status}
          </p>
          <Link to={`/edit-loan/${loan._id}`} className="loan-edit-link">
            Edit Details
          </Link>
          {loan.status !== "returned" && (
            <button
              type="button"
              className="loan-row-return"
              onClick={() => onReturn(loan._id)}
            >
              Mark Returned
            </button>
          )}
          <button
            type="button"
            className="loan-row-delete"
            onClick={() => onDelete(loan._id)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

LoanRow.propTypes = {
  loan: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    borrowerName: PropTypes.string.isRequired,
    borrowerEmail: PropTypes.string,
    dateOut: PropTypes.string.isRequired,
    dueDate: PropTypes.string.isRequired,
    dateReturned: PropTypes.string,
    status: PropTypes.string.isRequired,
    itemTitle: PropTypes.string,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
  onReturn: PropTypes.func.isRequired,
};

export default LoanRow;
