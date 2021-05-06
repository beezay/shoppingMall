import React from "react";

const Alert = ({title}) => {
  return (
    <p className="alert-warning py-1 rounded-pill w-50 mt-3 ml-auto mr-auto">
      {title}
    </p>
  );
};

export default Alert;
