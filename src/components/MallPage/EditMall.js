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
import Alert from "../common/Alert";
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

  let submitBtnClassName = "w-100 btn btn-lg btn-outline-primary btn-save";

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
            storage
              .ref(`shopImages/${item.id}`)
              .put(item.shopImgUrl)
          )
        )
      )
    );

    const newShopImageUrl = await Promise.all(
      newAddedShopsDetails.map((shop) =>
        Promise.all(
          shop.shopImages.map((item) =>
            storage
              .ref("shopImages")
              .child(item?.id)
              .getDownloadURL()
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
      This is Edit page
      <div className="container-fluid">
        {/* {showInfo && (
          <AddedAlert title="Mall has been Edited Sucessfully!!!" />
        )} */}
        {mall.length && (
          <div className="row">
            <div className="add-mall-form col-4">
              <form onSubmit={handleSubmit(handleMallEditSubmit)}>
                <h1 className="h3 mb-3 fw-normal">Your Mall Details Here!!!</h1>
                <div className="form-floating">
                  <input
                    type="text"
                    className="form-control"
                    id="mall-name"
                    placeholder="Name of the Mall"
                    defaultValue={singleMall.mallName}
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
                    defaultValue={singleMall.mallAddress}
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
                  {newMallImage ? (
                    <MallPreview
                      image={newMallImage.imageName}
                      preview={imgPreview}
                    />
                  ) : (
                    image && (
                      <MallPreview
                        image={image.imageName}
                        preview={imgPreview}
                      />
                    )
                  )}
                  {imageError && (
                    <p className="alert-danger py-2 rounded w-50 m-auto">
                      {" "}
                      {imageError}{" "}
                    </p>
                  )}
                  {errors.mallPic && <Alert title="Image Required!" />}
                </div>
              </form>
              {shopAdd && (
                <AddShop
                  setShopAdd={setShopAdd}
                  shopDetails={addedShopsDetails}
                  type="edit"
                />
              )}
              <div className="add-shop">
                {shopAdd ? (
                  <p
                    className="add-shop-p"
                    onClick={() => handleAddShop(false)}
                  >
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
                onClick={handleSubmit(handleMallEditSubmit)}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating..." : "UPDATE MALL"}
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
                <AddedMallDetails
                  addedShopsDetails={addedShopsDetails}
                  newAddedShopsDetails={newAddedShopsDetails}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default EditMall;
