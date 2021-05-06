import React from "react";

const AddedToast = () => {
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
        File Added Successfully !!!
      </div>
    </div>
  );
};

export default AddedToast;
