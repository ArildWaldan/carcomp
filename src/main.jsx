import React from "react";
import { createRoot } from "react-dom/client";
import TCOComparator from "../tco-v7.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <TCOComparator />
  </React.StrictMode>
);
