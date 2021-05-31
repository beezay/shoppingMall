import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { addShops, addNewShops } from "../../redux/MallSlice";

import ShopAddForm from "../common/ShopAddForm";

const AddShop = ({ setShopAdd, shopDetails, edit, setToast }) => {
  const [images, setImages] = useState([]);
  const [imageError, setImageError] = useState();
  const [shopImages, setShopImages] = useState([]);

  const dispatch = useDispatch();

  const handleCloseShopAdd = () => {
    setShopAdd(false);
  };

  const { reset } = useForm();

  const imageTypes = ["image/png", "image/jpg", "image/jpeg"];

  const handleShopImageAdd = (e) => {
    const imageList = Object.values(e.target.files).map((file) => {
      let imgList = [];
      if (imageTypes.includes(file.type)) {
        imgList.push(file);
        setImageError("");
      } else {
        setImageError("Please Select only  PNG/JPG");
      }
      return imgList;
    });
    setImages(imageList);
    setShopImages(Object.values(e.target.files));
  };

  const check = (data) => {
    edit ? dispatch(addNewShops(data)) : dispatch(addShops(data));
  };

  const handleShopSubmit = (data) => {

    if (shopImages.length <= 0) {
      setImageError("Please select at least one Image");
      return;
    }


    const id = Date.now().toString();
    const shopData = {
      id: id.toString(),
      ...data,
      shopImages: images.map((image) => ({
        id: `${id}${image[0].name}`,
        shopImgUrl: image[0],
      })),
    };
    check(shopData);
    setShopAdd(false);
    reset({ defaultValue: "" });
    setToast(true);
    setTimeout(() => {
      setToast(false);
    }, 5000);
  };

  return (
    <>
      <div className="add-shop-form">
        <ShopAddForm
          onClose={handleCloseShopAdd}
          onSubmit={handleShopSubmit}
          onChange={handleShopImageAdd}
          imageError={imageError}
          shopImages={shopImages}
        />
      </div>
    </>
  );
};

export default AddShop;
