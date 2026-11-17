import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <main className="home-page">
      <header className="home-hero">
        <h1>ShelfSpace</h1>
        <p className="home-tagline">
          Keep track of your books, films and games, and who borrowed them.
        </p>
        <div className="home-actions">
          <Link to="/login" className="home-button home-button-secondary">
            Log in
          </Link>
          <Link to="/signup" className="home-button">
            Sign Up
          </Link>
        </div>
      </header>
      <section>
        <h2>How it works</h2>
        <ol>
          <li>
            <strong>Sign up</strong> with an email and password, or log in.
          </li>
          <li>
            <strong>My Library</strong> lists your collection. Use{" "}
            <strong>+ Add item</strong> to catalog something new, the search box
            and status filter to find items, and <strong>Update</strong> /{" "}
            <strong>Delete</strong> on each row to change them.
          </li>
          <li>
            <strong>My Loans</strong> lists everything you&apos;ve lent.
            <ul>
              <li>
                <strong>+ Add loan</strong>: choose the item, then enter who
                borrowed it and when it&apos;s due.
              </li>
              <li>
                Use the filter to show only <strong>Overdue</strong> loans when
                you want to follow up.
              </li>
              <li>
                <strong>Mark Returned</strong> when an item comes back.{" "}
                <strong>Edit Details</strong> fixes mistakes, and{" "}
                <strong>Delete</strong> removes a loan entirely.
              </li>
            </ul>
          </li>
          <li>
            <strong>Log out</strong> from the navigation bar when you&apos;re
            done.
          </li>
        </ol>
      </section>
      <section>
        <h2>Track Media You've Lent to Other People</h2>
        <ol>
          <li>
            Create a loan by choosing an item from your library and entering the
            borrower's name, email, date out and due date.
          </li>
          <li>Edit a loan, mark it returned in one click, or delete it.</li>
          <li>
            Filter loans by <strong>Active</strong>, <strong>Overdue</strong> or{" "}
            <strong>Returned</strong>. Overdue status is calculated from the due
            date, so loans become overdue on their own with no manual updates.
          </li>
        </ol>
      </section>
    </main>
  );
}

export default Home;
