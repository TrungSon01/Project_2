import React from "react";
import Navbar from "../components/Navbar/Navbar";
export default function Template({ content }) {
  return (
    <div
      style={{
        minHeight: "100vh",
      }}
      className=" space-y-10 flex flex-col"
    >
      <Navbar />
      <div className="grow ">{content}</div>
    </div>
  );
}
