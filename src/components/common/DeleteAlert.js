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
      <div className="toast-body bg-danger text-white rounded text-center">
        File Deleted Successfully !!!
      </div>
    </div>
  );
};

export default DeleteAlert;
