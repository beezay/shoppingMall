import React from "react";

const AddedAlert = ({ title }) => {
  return (
    <div
      className="alert alert-success my-3 w-50 ml-auto mr-auto rounded-pill text-center"
      role="alert"
    >
      {title}
    </div>
  );
};

export default AddedAlert;
