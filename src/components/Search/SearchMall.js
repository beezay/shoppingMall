import React from "react";
import "./Search.css";
const SearchMall = ({onchange, title}) => {
  return (
    <div className="search mb-2">
      <form className="form-inline my-2 my-lg-0">
        <input
          className="form-control mr-sm-2"
          type="text"
          placeholder={title ? title : "Search Mall..."}
          onChange={onchange}
          defaultValue=""
        />
        {/* <button className="btn btn-secondary my-2 my-sm-0" type="submit">
              Search
            </button> */}
      </form>
    </div>
  );
};

export default SearchMall;
