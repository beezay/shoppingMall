import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";
import { fireStore, storage } from "../../firebase/firebase";
import { SelectIsAdmin } from "../../redux/MallSlice";
import { deleteShopStorage } from "../../utils/Delete";
import AddedToast from "../common/AddedToast";
import Card from "../common/Card";
import DeleteAlert from "../common/DeleteAlert";
import Loader from "../common/Loader";
import NoSearchedData from "../common/NoSearchedData";
import ShopAddForm from "../common/ShopAddForm";
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
  const [deleteToast, setDeleteToast] = useState(false);
  const [toast, setToast] = useState(false);
  const [searchError, setSearchError] = useState(false);
  const [imageError, setImageError] = useState(null);
  const [images, setImages] = useState([]);

  const isAdmin = useSelector(SelectIsAdmin);

  const { reset } = useForm();

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

  const imageTypes = ["image/png", "image/jpg", "image/jpeg"];

  const handleAddedShopImages = (e) => {
    setShopImages([]);
    const imageList = Object.values(e.target.files).map((file) => {
      let imgList = [];
      if (imageTypes.includes(file.type)) {
        imgList.push(file);
        setImageError("");
      } else {
        setImageError("Please select only PNG/JPG");
        return;
      }
      const shopImageList = Object.values(e.target.files);
      console.log(shopImageList);
      setShopImages(shopImageList);
      return imgList;
    });
    console.log("Check Return");
    console.log(shopImages);
    setImages(imageList);
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
    if (shopImages.length <= 0) {
      console.log("done");
      setImageError("Please select at least one Image");
      return;
    }
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
    setToast(true);
    setIsSubmitting(false);
    setAddShopStatus(false);
    setTimeout(() => {
      setToast(false);
    }, 1000);
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
      searchedShop?.length <= 0 && setSearchError(true);
      setFilterShops(searchedShop);
    } else {
      setSearchError(false);
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
      setDeleteToast(true);
      setTimeout(() => {
        setDeleteToast(false);
      }, 1500);
    }
  };

  const onClose = () => {
    setAddShopStatus(false);
    setImageError("");
    setShopImages([]);
  };

  return (
    <>
      {toast && <AddedToast />}
      {deleteToast && <DeleteAlert />}
      {isLoding && <Loader />}
      {addShopStatus && (
        <div className="add-shop-modal">
          <div className="add-shop-wrapper">
            <ShopAddForm
              onClose={onClose}
              onSubmit={handleAddShopSubmit}
              onChange={handleAddedShopImages}
              shopImages={shopImages}
              isSubmitting={isSubmitting}
              imageError={imageError}
            />
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
              <div className="searcherror mt-4 w-75 ml-auto mr-auto">
                {searchError && <NoSearchedData />}
              </div>
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
