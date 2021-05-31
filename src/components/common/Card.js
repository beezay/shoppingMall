import React, { useState } from "react";
import { useSelector } from "react-redux";
import { SelectIsAdmin } from "../../redux/MallSlice";

const Card = (props) => {
  const [showCross, setShowCross] = useState(false);

  const isAdmin = useSelector(SelectIsAdmin);

  return (
    <div
      className={props?.className}
      onMouseOver={() => setShowCross(true)}
      onMouseLeave={() => setShowCross(false)}
    >
      {!showCross && <div className="card-overlay"></div>}
      <div
        className="detail-container"
        onClick={() => props.func(props?.id, props?.shop?.mallId)}
      >
        <h3> {props?.name}</h3>
        {props?.address && <h4>{props?.address}</h4>}
      </div>
      <img src={props?.imgUrl} alt={props?.name} />
      {isAdmin && showCross && (
        <span
          className="delete-on-card"
          onClick={() =>
            props.onShopDelete
              ? props?.onShopDelete(props.id, props.shop.mallId)
              : props.onMallDelete(props.id)
          }
        >
          X
        </span>
      )}
    </div>
  );
};

// Card.defaultProps ={

// }

export default Card;
