import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeSingleShopImage, selectAddedShops } from "../../redux/MallSlice";

const ImagePopup = ({ shopImages, setShowPopup, shopId, edit }) => {
  const [hoverStatus, setHoverStatus] = useState(false);

  console.log(shopImages);

  const dispatch = useDispatch();

  const handleShopImageDelete = (imgId) => {
    console.log(shopId, imgId);
    // const data = addedShops.map(shop => {
    //   if(shop.id === shopId) {}
    // })

    dispatch(removeSingleShopImage({ imgId, shopId }));
    setShowPopup(null);
  };

  return (
    <div className="image-popup card-img w-50 shadow">
      <div className="close-popup inline-block">
        {" "}
        <span onClick={() => setShowPopup(null)}>X</span>
      </div>
      <div className="d-flex justify-content-around">
        {shopImages.map((imgItem) => (
          <div className="shop-image-popup-container">
            <img
              src={
                edit === "true"
                  ? imgItem.shopImgUrl
                  : URL.createObjectURL(imgItem.shopImgUrl)
              }
              alt=""
              className="shop-image-popup"
              style={{
                borderRadius: "50%",
                width: "150px",
                height: "150px",
                marginRight: "20px",
                marginBottom: "20px",
              }}
            />
            <span
              className="remove-shop-image"
              onClick={() => handleShopImageDelete(imgItem.shopImgId)}
            >
              X
            </span>
          </div>
        ))}

        {hoverStatus && <span className="remove-shop-image">X</span>}
      </div>
    </div>
  );
};

export default ImagePopup;
