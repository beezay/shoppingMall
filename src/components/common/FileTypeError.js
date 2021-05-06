import React from "react";

const FileTypeError = (props) => {
  return (
    <p className="alert-danger py-2 rounded w-50 m-auto text-white">
      {" "}
      {props.error}{" "}
    </p>
  );
};

export default FileTypeError;
