import React, { useState } from "react";
import { useHistory } from "react-router";
import { deleteShopStorage } from "../../utils/Delete";
import Card from "../common/Card";
import DeleteAlert from "../common/DeleteAlert";

const Shops = ({ shops, malls }) => {
  const [deleteToast, setDeleteToast] = useState(false);
  const history = useHistory();
  console.log("Shops=> ", shops);

  const handleSingleShopClick = (shopId, mallId) => {
    console.log(shopId, mallId);
    if (shopId && mallId) {
      history.push(`/shop/${mallId}/${shopId}`);
    }
    return;
  };

  const handleShopDelete = async (shopId, mallId) => {
    console.log("Delete Clicked", shopId, mallId);
    let confirm = window.confirm("Are you Sure you want to Delete this Shop");
    if (confirm) {
      await deleteShopStorage(malls, mallId, shopId);
      setDeleteToast(true);
      setTimeout(() => {
        setDeleteToast(false);
      }, 1500);
    }
  };

  return (
    <>
      {deleteToast && <DeleteAlert />}
      <div className="shops-wrapper">
        <div className="shop-heading">
          <h2>SHOPS</h2>
        </div>
        <div className="image-wrapper">
          {shops?.map((shop) => (
            <Card
              className="image-container"
              shop={shop}
              name={
                shop?.shops[0]?.shopName
                  ? shop?.shops[0]?.shopName
                  : "NO SHOPS FOR"
              }
              imgUrl={shop?.shops[0]?.shopImages[0]?.shopImgUrl}
              address={shop?.mallName}
              key={shop?.mallId}
              id={shop?.shops[0]?.id}
              onShopDelete={handleShopDelete}
              func={handleSingleShopClick}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Shops;
