import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useParams, withRouter } from "react-router";
import uuid from "react-uuid";
import { fireStore, storage } from "../../firebase/firebase";
import { SelectIsAdmin } from "../../redux/MallSlice";
import Alert from "../common/Alert";
import FileTypeError from "../common/FileTypeError";
import Loader from "../common/Loader";
import "./Shop.css";

const ShopId = (props) => {
  const mallId = props.match.params.mallid;
  const shopId = props.match.params.shopid;

  // const {mallid, shopid} = useParams()

  // console.log(mallid, shopid);
  const [allMalls, setAllMalls] = useState([]);
  const [mall, setMall] = useState([]);
  const [dbShops, setDbShops] = useState();
  const [shop, setShop] = useState([]);
  const [deleteShop, setDeleteShop] = useState(null);
  const [editShop, setEditShop] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(null);
  const [shopImages, setShopImages] = useState([]);

  const [imageError, setImageError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAdmin = useSelector(SelectIsAdmin);

  //   IMPORTING REACT HOOK FORM
  const {
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm();

  const imageTypes = ["image/png", "image/jpg", "image/jpeg"];

  //! FETCHING SINGLE MALL AND SINGLE SHOP
  useEffect(() => {
    const fetchMall = async () => {
      const fetchedMall = await fireStore.collection("mallInfo").get();
      const malls = [];
      fetchedMall.forEach((mall) =>
        malls.push({
          id: mall.id,
          ...mall.data(),
        })
      );
      const singleMall = malls.filter((x) => x.id === mallId);
      console.log(singleMall[0].shops, malls);
      setAllMalls(malls);
      const shops = singleMall[0].shops.filter((x) => x.id !== shopId);
      setDbShops(shops);
      const shop = singleMall[0].shops.filter((shop) => shop.id === shopId);
      console.log("Shop", shop, shops);
      setShop(shop);
      setMall(singleMall);
    };
    fetchMall();
    setIsLoading(false);
  }, []);

  //! Delete SHop Images
  const handleCrossClick = async (imgId) => {
    console.log(imgId);
    let confirm = window.confirm("Are you Sure you want to Delete this Image?");
    if (confirm) {
      setIsLoading(true);
      const oldShopImages = shop[0].shopImages;
      console.log(oldShopImages);
      const filterAfterDeleteImages = oldShopImages.filter(
        (img) => img.shopImgId !== imgId
      );
      console.log("Current Shop", shop);
      let shopData = shop[0];
      console.log(shopData);
      let newShop = {
        ...shopData,
        shopImages: [...filterAfterDeleteImages],
      };
      console.log("New Shop", newShop);
      try {
        await fireStore
          .collection("mallInfo")
          .doc(mallId)
          .update({ shops: [...dbShops, newShop] });
        await storage
          .ref("shopImages")
          .child(`${imgId}`)
          .delete()
          .then(() => console.log("Image Deleted"));
      } catch (e) {
        console.log(e);
      }
      setShop([newShop]);
      setIsLoading(false);
    }
  };

  const handleAddedShopImages = (e) => {
    // const shopImagesList = Object.values(e.target.files);
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
    setShopImages(imageList);
    // console.log(shopImages, "shopImageList");
  };

  const shopImageUploads = async (uniqueId) => {
    console.log("ShopImages", shopImages);

    await Promise.all(
      shopImages.map((shopImg) =>
        storage.ref(`shopImages/${uniqueId}${shopImg[0].name}`).put(shopImg[0])
      )
    );

    const shopImageUrl = await Promise.all(
      shopImages.map((shopImg) =>
        storage
          .ref("shopImages")
          .child(`${uniqueId}${shopImg[0]?.name}`)
          .getDownloadURL()
      )
    );
    console.log(shopImageUrl);
    return shopImageUrl;
  };

  //   HANDLING EDIT FORM
  const handleEditShopSubmit = async (data) => {
    // setIsLoading(true)
    let uniqueId = Date.now().toString();
    const oldShopImages = shop[0].shopImages;
    setIsSubmitting(true);
    let shopImgArr;
    shopImgArr = await shopImageUploads(uniqueId);
    const addedShopImages = shopImgArr.map((imgUrl, idx) => ({
      shopImgId: `${uniqueId}${shopImages[idx][0].name}`,
      shopImgUrl: imgUrl,
    }));
    // console.log(shopImagesData, "Arr");
    const shopData = {
      ...data,
      id: shopId,
      shopImages: [...oldShopImages, ...addedShopImages],
    };
    await fireStore
      .collection("mallInfo")
      .doc(mallId)
      .update({ shops: [...dbShops, shopData] });
    console.log(shopData, "Data");
    reset();
    setShopImages([]);
    setEditShop(false);
    setIsSubmitting(false);

    setShop([shopData]);
  };
  console.log("After Edit => ", shop);

  return (
    <>
      {editShop && (
        <div className="add-shop-modal">
          <div className="add-shop-wrapper">
            <div className="form-wrapper">
              <p className="close-btn" onClick={() => setEditShop(false)}>
                X
              </p>
              <form onSubmit={handleSubmit(handleEditShopSubmit)}>
                <div className="form-floating">
                  <input
                    type="text"
                    className="form-control"
                    id="floatingInput"
                    defaultValue={shop[0]?.shopName}
                    placeholder="Name of the Shop"
                    {...register("shopName", { required: true })}
                  />
                  {/* <label htmlFor="floatingInput">Mall Name</label> */}
                  {errors.shopName && <Alert title="Please write about Shop" />}
                </div>
                <div className="form-floating">
                  <textarea
                    type="text"
                    className="form-control"
                    id="floatingPassword"
                    defaultValue={shop[0]?.shopDesc}
                    placeholder="Description"
                    {...register("shopDesc", { required: true })}
                  />
                  {/* <label htmlFor="floatingPassword">Address</label> */}
                  {errors.shopDesc && <Alert title="Please write about Shop" />}
                </div>

                <div className="form-floating mt-2">
                  <label htmlFor="file-uploads" className="image-add-shop">
                    <input
                      id="file-uploads"
                      type="file"
                      multiple
                      onChange={handleAddedShopImages}
                    />
                    <span>Add IMAGEs + </span>
                  </label>
                  <span className="py-0 mt-2 text-info font-weight-light">
                    First Image will be shown as Thumbnail
                  </span>
                  {imageError && <FileTypeError error={imageError} />}
                  {shopImages &&
                    shopImages.map((x) => (
                      <p className="text-dark"> {x[0].name} </p>
                    ))}
                </div>
                <button
                  className="btn btn-lg btn-warning mt-2 "
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "SAVING..." : "SAVE SHOP"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
      {isLoading && <Loader />}
      <div className="container-fluid text-center py-4">
        <div className="container">
          <h1> {shop[0]?.shopName} </h1>
          <h5> {shop[0]?.shopDesc} </h5>
        </div>
      </div>
      {isAdmin && (
        <div className="btn-wrapper">
          <button
            className="btn-add-mall ml-5"
            onClick={() => setEditShop(true)}
          >
            Edit Shop
          </button>
        </div>
      )}
      <div className="container-fluid text-center py-4">
        <div className="container d-flex align-items-center shop-container">
          {shop[0]?.shopImages.map((img) => (
            <div
              className="shop-image-container"
              onMouseOver={() => setDeleteShop(true)}
              onMouseLeave={() => setDeleteShop(null)}
              key={img.shopImgId}
            >
              <img src={img.shopImgUrl} alt={img.shopImgId} />
              {isAdmin && deleteShop && (
                <span
                  className="delete-on-card"
                  onClick={() => handleCrossClick(img.shopImgId)}
                >
                  X
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default withRouter(ShopId);
