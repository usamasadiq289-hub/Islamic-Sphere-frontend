import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user data from localStorage or sessionStorage (or wherever you store user data)
    localStorage.removeItem("user"); // Clear user data
    localStorage.removeItem("token"); // Clear authentication token if you are using one

    toast.success("Logged out successfully!");
    setTimeout(() => {
      navigate("/");
    }, 500);
  };

  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Logout;
