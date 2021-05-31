import React, { useState } from "react";

import { fireStore, storage } from "../../firebase/firebase";

import "./AddForm.css";
import { withRouter } from "react-router";
import { useForm } from "react-hook-form";
import AddedAlert from "../common/AddedAlert";
import { useDispatch, useSelector } from "react-redux";
import { selectAddedShops, resetShops } from "../../redux/MallSlice";

import AddedToast from "../common/AddedToast";
import MallForm from "../common/MallForm";
const AddMall = ({ history }) => {
  const [shopAdd, setShopAdd] = useState(false);
  const [image, setImage] = useState(null);
  const [imgPreview, setImgPreview] = useState();
  const [imageError, setImageError] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(false);

  const addedShopsDetails = useSelector(selectAddedShops);

  const imageTypes = ["image/png", "image/jpg", "image/jpeg"];
  const dispatch = useDispatch();
  const { reset } = useForm();

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
    return shopImageUrl;
  };

  const shopDetails = (imgArr) => {
    const shopArr = addedShopsDetails.map((shop, idx) => ({
      ...shop,
      shopImages: imgArr[idx].map((img, i) => ({
        shopImgId: shop.shopImages[i].id,
        shopImgUrl: img,
      })),
    }));
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

    fireStore.collection("mallInfo").doc(newId).set(mallData);

    setImage(null);
    reset({ defaultValue: "" });
    setShowInfo(true);
    dispatch(resetShops());
    setIsSubmitting(false);
    setShowInfo(true);
    dispatch(resetShops());
    const show = setTimeout(() => {
      setShowInfo(false);
      history.push("/");
    }, 1500);
  };

  return (
    <>
      {toast && <AddedToast />}
      <div className="container-fluid">
        {showInfo && (
          <AddedAlert title="New Mall has been added Sucessfully!!!" />
        )}
        <MallForm
          onSubmit={handleMallSubmit}
          onChange={fileUploadChange}
          imageError={imageError}
          addedShopsDetails={addedShopsDetails}
          isSubmitting={isSubmitting}
          onCancel={handleCancelAddMall}
          handleAddShop={handleAddShop}
          shopAdd={shopAdd}
          setShopAdd={setShopAdd}
          mallImage={image}
          mallImgPreview={imgPreview}
          setToast={setToast}
          edit={false}
        />
      </div>
    </>
  );
};

export default withRouter(AddMall);
