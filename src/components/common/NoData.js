import React from "react";

const NoData = (props) => {
  return (
    <div className="alert alert-dismissible alert-secondary">
      <strong>Sorry! {props.title} </strong>
    </div>
  );
};

export default NoData;
