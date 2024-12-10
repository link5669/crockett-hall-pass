import { Link } from "react-router-dom";
export default function Navbar({ signedIn = true }) {
  return (
    <nav class="navbar">
      <Link to="/" style={{ color: "white", textDecoration: "none" }}>
        <div class="logo">Crockett Pass Dashboard</div>
      </Link>
      <div className="flex items-center gap-4">
        {signedIn && (
          <>
            <Link to="/">
              <button className="px-4 py-2 ">Approve Pending Passes</button>
            </Link>
            <Link to="/passes">
              <button className="px-4 py-2 ">Active Passes</button>
            </Link>
            <Link to="/lookup">
              <button className="px-4 py-2 ">Student Lookup</button>
            </Link>
            <Link to="/settings">
              <button className="px-4 py-2 ">Settings</button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
