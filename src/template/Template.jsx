import React from "react";
import Navbar from "../components/Navbar/Navbar";

export default function Template({ content }) {
  return (
    <div>
      <Navbar />
      <div
        style={{
          marginLeft: "80px",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        {content}
      </div>
    </div>
  );
}
