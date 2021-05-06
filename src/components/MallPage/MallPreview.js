import React from "react";

const MallPreview = ({ image, preview }) => {
  // console.log(image); 
  return (
    <div className="d-flex align-items-center justify-content-center">
      <div
        className="card"
        style={{
          borderRadius: "50%",
          height: "100px",
          width: "100px",
          //   backgroundImage: `url(${preview})`
        }}
      >
        {" "}
        <img
          src={preview}
          alt=""
          style={{ height: "100px", width: "100px", borderRadius: "50%" }}
        />
      </div>
      <p className="mt-2 ml-5">  </p>
    </div>
  );
};

export default MallPreview;
