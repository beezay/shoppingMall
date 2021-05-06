import uuid from "react-uuid";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { addShops, addNewShops } from "../../redux/MallSlice";
import Alert from "../common/Alert";
import FileTypeError from "../common/FileTypeError";
import ShopAddForm from "../common/ShopAddForm";
import AddedToast from "../common/AddedToast";

const AddShop = ({ setShopAdd, shopDetails, type, setToast }) => {
  console.log(shopDetails);

  const [images, setImages] = useState([]);
  const [imageError, setImageError] = useState();
  const [shopImages, setShopImages] = useState();

  const dispatch = useDispatch();

  const handleCloseShopAdd = () => {
    setShopAdd(false);
  };

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  const imageTypes = ["image/png", "image/jpg", "image/jpeg"];

  const handleShopImageAdd = (e) => {
    // console.log(e.target.files);
    const imageList = Object.values(e.target.files).map((file) => {
      let imgList = [];
      if (imageTypes.includes(file.type)) {
        console.log(file);
        imgList.push(file);
        setImageError("");
      } else {
        setImageError("Please Select only  PNG/JPG");
      }
      return imgList;
    });
    console.log(imageList);
    setImages(imageList);
    setShopImages(Object.values(e.target.files));
    // const imageListt = Object.values(e.target.files);
    // console.log(imageList);
  };

  const check = (data) => {
    type === "edit" ? dispatch(addNewShops(data)) : dispatch(addShops(data));
  };

  const handleShopSubmit = (data) => {
    console.log(images);

    const id = Date.now().toString();
    console.log("Shop Added", images);
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
