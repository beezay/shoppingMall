import React, { useState } from "react";
import { useSelector } from "react-redux";
import { SelectIsAdmin } from "../../redux/MallSlice";

const ShopCard = (props) => {
  const [showCross, setShowCross] = useState(false);
  //   console.log(props);

  const isAdmin = useSelector(SelectIsAdmin);

  return (
    <div
      className={props?.className}
      onMouseOver={() => setShowCross(true)}
      onMouseLeave={() => setShowCross(false)}
    >
      <div
        className="detail-container"
        onClick={() => props.func(props.id, props.mallId)}
      >
        <h3> {props?.name}</h3>
        <h4>{props?.address}</h4>
      </div>
      <img src={props?.imgUrl} alt={props?.name} />
      {isAdmin && showCross && (
        <span
          className="delete-on-card"
          onClick={() => props.onShopDelete(props.id, props.mallId)}
        >
          X
        </span>
      )}
    </div>
  );
};

export default ShopCard;
