import React, { useState } from "react";
import AddShop from "./AddShop";

import { fireStore, storage } from "../../firebase/firebase";

import "./AddForm.css";
import { withRouter } from "react-router";
import { useForm } from "react-hook-form";
import Alert from "../common/Alert";
import AddedAlert from "../common/AddedAlert";
import { useDispatch, useSelector } from "react-redux";
import AddedMallDetails from "./AddedMallDetails";
import MallPreview from "./MallPreview";
import {
  selectAddedShops,
  removeShop,
  resetShops,
} from "../../redux/MallSlice";
import uuid from "react-uuid";
import FileTypeError from "../common/FileTypeError";
const AddMall = ({ history }) => {
  const [shopAdd, setShopAdd] = useState(false);
  const [image, setImage] = useState(null);
  const [imgPreview, setImgPreview] = useState();
  const [imageError, setImageError] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addedShopsDetails = useSelector(selectAddedShops);

  const imageTypes = ["image/png", "image/jpg", "image/jpeg"];
  const dispatch = useDispatch();
  const {
    register,

    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  const handleAddShop = (val) => {
    if (shopAdd) {
      setShopAdd(val);
    }
    setShopAdd(val);
  };

  const handleCancelAddMall = () => {
    history.push("/");
  };

  const fileUploadChange = (e) => {
    const mallImage = e.target.files[0];

    if (mallImage && imageTypes.includes(mallImage.type)) {
      setImage(mallImage);
      setImageError("");
      setImgPreview(URL.createObjectURL(mallImage));
    } else {
      setImage("");
      setImageError("Please Select only  PNG/JPG");
    }
  };

  const shopUpload = async (newId) => {
    console.log(addedShopsDetails);
    await Promise.all(
      addedShopsDetails.map((shop) =>
        Promise.all(
          shop.shopImages.map((item) =>
            storage.ref(`shopImages/${item.id}`).put(item.shopImgUrl)
          )
        )
      )
    );

    const shopImageUrl = await Promise.all(
      addedShopsDetails.map((shop) =>
        Promise.all(
          shop.shopImages.map((item) =>
            storage.ref("shopImages").child(item?.id).getDownloadURL()
          )
        )
      )
    );
    console.log(shopImageUrl);
    return shopImageUrl;
  };

  const shopDetails = (imgArr) => {
    console.log("ShopDetails", imgArr);

    const shopArr = addedShopsDetails.map((shop, idx) => ({
      ...shop,
      shopImages: imgArr[idx].map((img, i) => ({
        shopImgId: shop.shopImages[i].id,
        shopImgUrl: img,
      })),
    }));
    console.log(shopArr);
    return shopArr;
  };

  const handleMallSubmit = async (data) => {
    if (!image) {
      setImageError("Mall Image is Required");
      return;
    }

    let newId = Date.now().toString();
    setIsSubmitting(true);
    let shopImgArr;
    if (addedShopsDetails.length > 0) {
      console.log("Loop Entered");
      shopImgArr = await shopUpload(newId);
    }

    const shopArr = shopDetails(shopImgArr);

    let imageName = newId + "mall";

    await storage.ref(`mallImages/${imageName}`).put(image);
    const imgUrl = await storage
      .ref("mallImages")
      .child(imageName)
      .getDownloadURL();

    const mallData = {
      id: newId,
      ...data,
      mallImage: {
        imageId: newId,
        imageUrl: imgUrl,
        imageName: imageName,
      },
      shops: shopArr,
    };

    console.log(mallData);

    fireStore.collection("mallInfo").doc(newId).set(mallData);

    setImage(null);
    reset({ defaultValue: "" });
    setShowInfo(true);
    dispatch(resetShops());
    setIsSubmitting(false);
    setShowInfo(true);
    const show = setTimeout(() => {
      setShowInfo(false);
      history.push("/");
    }, 1000);
  };

  let submitBtnClassName = "w-100 btn btn-lg btn-outline-primary btn-save";

  if (isSubmitting) {
    submitBtnClassName += " disabled";
  }

  return (
    <>
      <div className="container-fluid">
        {showInfo && (
          <AddedAlert title="New Mall has been added Sucessfully!!!" />
        )}
        <div className="row">
          <div className="add-mall-form col-4">
            <form onSubmit={handleSubmit(handleMallSubmit)}>
              <h1 className="h3 mb-3 fw-normal">
                Enter Your Mall Details Here!!!
              </h1>
              <div className="form-floating">
                <input
                  type="text"
                  className="form-control"
                  id="mall-name"
                  placeholder="Name of the Mall"
                  defaultValue=""
                  {...register("mallName", { required: true })}
                />
                {/* <label htmlFor="floatingInput">Mall Name</label> */}
                {errors.mallName && <Alert title="Mall Name is Required!" />}
              </div>
              <div className="form-floating">
                <input
                  type="text"
                  className="form-control"
                  id="mall-address"
                  placeholder="Address"
                  defaultValue=""
                  {...register("mallAddress", { required: true })}
                />
                {/* <label htmlFor="floatingPassword">Address</label> */}
                {errors.mallAddress && <Alert title="Address Required!" />}
              </div>

              <div className="form-floating">
                <label htmlFor="file-upload" className="image-add">
                  <input
                    id="file-upload"
                    type="file"
                    onChange={fileUploadChange}
                    // {
                    //   ...register("mallPic", {required:true})
                    // }
                  />
                  <span>+</span>
                </label>
                {image && <MallPreview image={image} preview={imgPreview} />}
                {imageError && (
                  <FileTypeError error={imageError} />
                )}
                {errors.mallPic && <Alert title="Image Required!" />}
              </div>
            </form>
            {shopAdd && (
              <AddShop
                setShopAdd={setShopAdd}
                shopDetails={addedShopsDetails}
              />
            )}
            <div className="add-shop">
              {shopAdd ? (
                <p className="add-shop-p" onClick={() => handleAddShop(false)}>
                  Cancel{" "}
                </p>
              ) : (
                <p className="add-shop-p" onClick={() => handleAddShop(true)}>
                  Add Shop <span>+</span>{" "}
                </p>
              )}
            </div>
            <button
              id="dynamic-btn"
              className={submitBtnClassName}
              type="submit"
              onClick={handleSubmit(handleMallSubmit)}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "SAVE MALL"}
            </button>
            <button
              className="w-100 btn btn-lg btn-outline-warning btn-cancel"
              type="button"
              onClick={handleCancelAddMall}
              disabled={isSubmitting}
            >
              CANCEL
            </button>
          </div>
          {addedShopsDetails.length > 0 && (
            <div className="col-6">
              <AddedMallDetails addedShopsDetails={addedShopsDetails} />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default withRouter(AddMall);
