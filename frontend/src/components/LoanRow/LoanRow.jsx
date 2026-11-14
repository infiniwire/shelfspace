import "./LoanRow.css";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

function LoanRow({ loan, onDelete, onReturn }) {
  return (
    <div className="loan-row">
      <div>
        <p className="loan-row-borrower-name">{loan.borrowerName}</p>
        <p className="loan-row-due">
          {new Date(loan.dueDate).toLocaleDateString()}
        </p>
        <p className="loan-row-status">{loan.status}</p>
        <button
          type="button"
          className="loan-row-delete"
          onClick={() => onDelete(loan._id)}
        >
          Delete
        </button>
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
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
  onReturn: PropTypes.func.isRequired,
};

export default LoanRow;
