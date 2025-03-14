import React from "react";
import { Outlet } from "react-router-dom";

export const Admin = () => {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <Outlet /> {/* ✅ This renders nested routes like create-listing */}
    </div>
  );
};
