import React from "react";

const DeleteAlert = () => {
  return (
    <div
      className="toast show"
      style={{
        position: "absolute",
        top: "12%",
        right: "2%",
        minWidth: "150px",
        zIndex: 100,
      }}
    >
      <div className="toast-body bg-success text-white rounded text-center">
        File Deleted!!
      </div>
    </div>
  );
};

export default DeleteAlert;
