import React from "react";

const Loader = () => {
  return (
    <div className="loader-wrapper">
      <div className="loader">
        <div className="spinner-box">
          <div className="circle-border">
            <div className="circle-core" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
