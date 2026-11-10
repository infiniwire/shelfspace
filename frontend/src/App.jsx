import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Nav from "./components/Nav/Nav";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import Library from "./components/Library/Library";
import AddItem from "./components/AddItem/AddItem";
import EditItem from "./components/EditItem/EditItem";

function App() {
  const location = useLocation();
  const hideNav =
    location.pathname === "/login" || location.pathname === "/signup";

  return (
    <>
      {!hideNav && <Nav />}
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/library" element={<Library />} />
        <Route path="/add-item" element={<AddItem />} />
        <Route path="/edit-item/:id" element={<EditItem />} />
      </Routes>
    </>
  );
}

export default App;
