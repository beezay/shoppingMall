import React, { useEffect, useState } from "react";
import { set, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";
import uuid from "react-uuid";
import { fireStore, storage } from "../../firebase/firebase";
import {
  resetShops,
  selectedAllMalls,
  SelectIsAdmin,
} from "../../redux/MallSlice";
import { deleteShopStorage } from "../../utils/Delete";
import Alert from "../common/Alert";
import Card from "../common/Card";
import Loader from "../common/Loader";
import Malls from "../HomePage/Malls";
import SearchMall from "../Search/SearchMall";
import "./Details.css";
const MallsDetails = () => {
  const [allMalls, setAllMalls] = useState([]);
  const [mall, setMall] = useState([]);
  const [mallForDelete, setMallForDelete] = useState([]);
  const [dbShops, setDbShops] = useState();
  const [addShopStatus, setAddShopStatus] = useState(false);
  const [shopImages, setShopImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterShops, setFilterShops] = useState([]);
  const [isLoding, setIsLoading] = useState(true);

  const isAdmin = useSelector(SelectIsAdmin);

  const {
    handleSubmit,
    formState: { errors },
    register,
    reset,
  } = useForm();

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
      console.log(singleMall[0]?.shops, malls);
      setAllMalls(malls);
      setDbShops(singleMall[0]?.shops);
      setMall(singleMall[0]);
      setMallForDelete(singleMall);
      setFilterShops(singleMall[0].shops);
    };
    fetchMalls();
    setIsLoading(false);
    return fetchMalls;
  }, []);

  const { id } = useParams();

  const history = useHistory();
  const dispatch = useDispatch();

  const handleShopClick = (shopId) => {
    history.push(`/shop/${id}/${shopId}`);
  };

  const goToEditMall = () => {
    history.push(`/editMall/${id}`);
  };

  const handleAddedShopImages = (e) => {
    const shopImageList = Object.values(e.target.files);
    console.log(shopImageList);
    setShopImages(shopImageList);
  };

  const shopImageUploads = async (shop_id) => {
    console.log("ShopImages", shopImages);
    await Promise.all(
      shopImages.map((shopImg) =>
        storage.ref(`shopImages/${shop_id}${shopImg.name}`).put(shopImg)
      )
    );

    const shopImageUrl = await Promise.all(
      shopImages.map((shopImg) =>
        storage
          .ref("shopImages")
          .child(`${shop_id}${shopImg.name}`)
          .getDownloadURL()
      )
    );
    console.log(shopImageUrl);
    return shopImageUrl;
  };

  const handleAddShopSubmit = async (data) => {
    setIsSubmitting(true);
    const shop_id = Date.now().toString();
    console.log(data);
    let shopImgArr;
    shopImgArr = await shopImageUploads(shop_id);
    console.log(shopImgArr);
    const shopImagesData = shopImgArr.map((imgUrl, idx) => ({
      shopImgId: `${shop_id}${shopImages[idx].name}`,
      shopImgUrl: imgUrl,
    }));
    console.log(shopImagesData, "check");
    const shopData = {
      id: shop_id,
      ...data,
      shopImages: [...shopImagesData],
    };
    console.log(shopData);
    await fireStore
      .collection("mallInfo")
      .doc(id)
      .update({ shops: [...dbShops, shopData] });
    reset();
    setDbShops([...dbShops, shopData]);
    let newMall = mall;
    newMall.shops = [...dbShops, shopData];
    setFilterShops([...dbShops, shopData]);
    setMall(newMall);
    setShopImages([]);
    setIsSubmitting(false);
    setAddShopStatus(false);
  };
  console.log("Mall", mall);

  const handleShopSearch = (e) => {
    if (e.target.value) {
      console.log(e.target.value);
      const searchRegex = new RegExp(e.target.value, "gi");
      const searchedShop = mall.shops.filter((shop) =>
        shop.shopName.match(searchRegex)
      );
      console.log(searchedShop);
      setFilterShops(searchedShop);
    } else {
      setFilterShops(mall.shops);
    }
  };

  const onShopDelete = async (shopId, mallId) => {
    console.log(shopId, mallId);
    let confirm = window.confirm("Are you sure to Delete??");
    if (confirm) {
      setIsLoading(true);
      console.log("Confirmed", mallForDelete);

      await deleteShopStorage(mallForDelete, mallId, shopId);
      setIsLoading(false);
    }
  };
  return (
    <>
      {isLoding && <Loader />}
      {addShopStatus && (
        <div className="add-shop-modal">
          <div className="add-shop-wrapper">
            <div className="form-wrapper">
              <p className="close-btn" onClick={() => setAddShopStatus(false)}>
                X
              </p>
              <form onSubmit={handleSubmit(handleAddShopSubmit)}>
                <div className="form-floating">
                  <input
                    type="text"
                    className="form-control"
                    id="floatingInput"
                    defaultValue=""
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
                    defaultValue=""
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
                    <span>Upload IMAGEs + </span>
                  </label>
                  <span className="py-0 mt-2 text-info font-weight-light">
                    First Image will be shown as Thumbnail
                  </span>
                  {shopImages &&
                    shopImages.map((x) => (
                      <p className="text-dark"> {x.name} </p>
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
      <div className="container mt-2">
        {isAdmin && (
          <div className="d-flex justify-content-between flex-wrap">
            <button
              className="m-0 btn btn-outline-info"
              onClick={() => setAddShopStatus(true)}
            >
              Add Shop
            </button>
            <button
              className="m-0 btn btn-outline-success"
              onClick={goToEditMall}
            >
              Edit Mall
            </button>
          </div>
        )}
        {mall && (
          <div className="container-fluid m-0">
            <div className="mall-info text-center mt-1">
              <div className="detail-container">
                <h1> {mall?.mallName} </h1>
                <h3>{mall?.mallAddress} </h3>
              </div>
              <div className="searchbar">
                <SearchMall title="Search Shops" onchange={handleShopSearch} />
              </div>
            </div>
            <div className="single-mall-image-container">
              <img
                className="single-mall-image"
                src={mall?.mallImage?.imageUrl}
                alt=""
                // style={{ maxWidth: "200px", maxHeight: "200px" }}
              />
            </div>
            <div className="container-fluid text-center">
              <div className=" mt-5 shop-card-container">
                {filterShops &&
                  filterShops.map((shop) => (
                    <Card
                      key={shop.id}
                      className="image-container card-img mr-3"
                      name={shop?.shopName}
                      func={handleShopClick}
                      shop={{ mallId: mall.id }}
                      id={shop.id}
                      imgUrl={shop?.shopImages[0]?.shopImgUrl}
                      onShopDelete={onShopDelete}
                    />
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MallsDetails;
