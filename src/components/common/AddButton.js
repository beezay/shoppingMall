import React from "react";
import "./common.css";
const AddButton = (props) => {
  return (
    <button className="btn-add-mall" onClick={props.onClick}>
      ADD MALL
    </button>
  );
};

export default AddButton;
