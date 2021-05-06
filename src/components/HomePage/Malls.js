import React from "react";
import { useHistory } from "react-router";
import { deleteMallStorage } from "../../utils/Delete";
import Card from "../common/Card";

const Malls = ({ filterMalls }) => {
  const history = useHistory();

  const handleSingleMallClick = (mallId) => {
    console.log(mallId);
    history.push(`malls/${mallId}`);
  };

  const handleSingleMallDelete = async (mallId) => {
    console.log(mallId);
    let confirm = window.confirm("Are you sure to Delete Mall??");
    if (confirm) {
      await deleteMallStorage(filterMalls, mallId);
    }
  };

  return (
    <div className="malls-wrapper">
      <div className="mall-heading">
        <h2>MALLS</h2>
      </div>
      <div className="image-wrapper">
        {filterMalls.map((mall) => (
          <Card
            className="image-container"
            func={handleSingleMallClick}
            name={mall.mallName}
            address={mall.mallAddress}
            imgUrl={mall.mallImage.imageUrl}
            key={mall.id}
            id={mall.id}
            onMallDelete={handleSingleMallDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default Malls;
