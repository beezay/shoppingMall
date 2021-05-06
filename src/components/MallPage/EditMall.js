import React, { useEffect } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";
import uuid from "react-uuid";
import { fireStore, storage } from "../../firebase/firebase";
import {
  addShops,
  resetShops,
  selectAddedShops,
  selectNewAddedShops,
} from "../../redux/MallSlice";
import AddedAlert from "../common/AddedAlert";
import AddedToast from "../common/AddedToast";
import Alert from "../common/Alert";
import MallForm from "../common/MallForm";
import AddedMallDetails from "./AddedMallDetails";
import AddShop from "./AddShop";
import MallPreview from "./MallPreview";

const EditMall = (props) => {
  const [allMalls, setAllMalls] = useState([]);
  const [mall, setMall] = useState([]);
  const [dbShops, setDbShops] = useState();
  const [image, setImage] = useState();
  const [newMallImage, setNewMallImage] = useState();
  const [imgPreview, setImgPreview] = useState();
  const [imageError, setImageError] = useState();
  const [shopAdd, setShopAdd] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(false);

  const {
    handleSubmit,
    formState: { errors },
    reset,
    register,
  } = useForm();

  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams();
  console.log("ID", id);

  const imageTypes = ["image/png", "image/jpg", "image/jpeg"];

  useEffect(() => {
    const fetchMalls = async () => {
      const fetchedMalls = await fireStore.collection("mallInfo").get();
      const malls = [];
      fetchedMalls.forEach((mall) =>
        malls.push({
          id: mall.id,
          ...mall.data(),
        })
      );
      const singleMall = malls.filter((x) => x.id === id);
      setAllMalls(malls);
      setDbShops(singleMall[0].shops);
      setMall(singleMall);
      setImage(singleMall[0].mallImage);
      setImgPreview(singleMall[0].mallImage.imageUrl);
      singleMall[0].shops.map((shop) => dispatch(addShops(shop)));
    };
    dispatch(resetShops());
    fetchMalls();
    return fetchMalls;
  }, []);

  const addedShopsDetails = useSelector(selectAddedShops);
  const newAddedShopsDetails = useSelector(selectNewAddedShops);

  console.log("Malls", mall, dbShops, allMalls, image);
  console.log("Added Shops Details", addedShopsDetails);
  console.log("Db Shops Details", dbShops);

  const fileUploadChange = (e) => {
    const mallImage = e.target.files[0];

    setImgPreview(URL.createObjectURL(mallImage));
    if (mallImage && imageTypes.includes(mallImage.type)) {
      setNewMallImage(mallImage);
      setImageError("");
    } else {
      setNewMallImage("");
      setImageError("Please Select only  PNG/JPG");
    }
  };

  const handleAddShop = (val) => {
    if (shopAdd) {
      setShopAdd(val);
    }
    setShopAdd(val);
  };

  const handleCancelAddMall = () => {
    history.push(`/malls/${id}`);
  };

  const shopUpload = async (newId) => {
    console.log(newAddedShopsDetails);
    await Promise.all(
      newAddedShopsDetails.map((shop) =>
        Promise.all(
          shop.shopImages.map((item) =>
            storage.ref(`shopImages/${item.id}`).put(item.shopImgUrl)
          )
        )
      )
    );

    const newShopImageUrl = await Promise.all(
      newAddedShopsDetails.map((shop) =>
        Promise.all(
          shop.shopImages.map((item) =>
            storage.ref("shopImages").child(item?.id).getDownloadURL()
          )
        )
      )
    );
    console.log(newShopImageUrl);
    return newShopImageUrl;
  };

  const shopDetails = (imgArr) => {
    console.log("ShopDetails", imgArr);

    const shopArr = newAddedShopsDetails.map((shop, idx) => ({
      ...shop,
      shopImages: imgArr[idx].map((img, i) => ({
        shopImgId: shop.shopImages[i].id,
        shopImgUrl: img,
      })),
    }));
    console.log(shopArr);
    return shopArr;
  };

  const handleMallEditSubmit = async (data) => {
    console.log("Mall Submit => ", data);
    const newId = Date.now().toString();
    setIsSubmitting(true);
    let newShopImgArr;
    if (newAddedShopsDetails.length > 0) {
      console.log("loop Entered");
      newShopImgArr = await shopUpload(newId);
    }

    const newShopArr = shopDetails(newShopImgArr);
    console.log("New Shop Arr", newShopArr);
    console.log("Old Shop Arr", addedShopsDetails);

    const allShopsArr = [...newShopArr, ...addedShopsDetails];

    console.log("All SHops Arr", allShopsArr);
    let mallImgUrl;
    if (newMallImage) {
      await storage.ref(`mallImages/${newMallImage.name}`).put(newMallImage);
      mallImgUrl = await storage
        .ref("mallImages")
        .child(newMallImage.name)
        .getDownloadURL();
      console.log(mallImgUrl);
    }

    console.log("Image=> ", image);

    const mallImage = newMallImage
      ? {
          imageUrl: mallImgUrl,
          imageName: newMallImage.name,
        }
      : image;
    const editedMallData = {
      ...data,
      mallImage: mallImage,
      shops: [...allShopsArr],
    };
    console.log("Edited Mall Data", editedMallData);
    await fireStore.collection("mallInfo").doc(id).update(editedMallData);
    setIsSubmitting(false);
    dispatch(resetShops());
    handleCancelAddMall();
  };

  const singleMall = mall[0];

  return (
    <>
      {toast && <AddedToast />}
      <div className="container-fluid">
        {/* {showInfo && (
          <AddedAlert title="Mall has been Edited Sucessfully!!!" />
        )} */}
        {mall.length && (
          <MallForm
            onSubmit={handleMallEditSubmit}
            mall={singleMall}
            onChange={fileUploadChange}
            imageError={imageError}
            addedShopsDetails={addedShopsDetails}
            newAddedShopsDetails={newAddedShopsDetails}
            isSubmitting={isSubmitting}
            onCancel={handleCancelAddMall}
            handleAddShop={handleAddShop}
            shopAdd={shopAdd}
            setShopAdd={setShopAdd}
            mallImage={image}
            mallImgPreview={imgPreview}
            newMallImage={newMallImage}
            edit={true}
            setToast={setToast}
          />
        )}
      </div>
    </>
  );
};

export default EditMall;
