import React, { useState } from "react";
import { useHistory } from "react-router";
import { deleteMallStorage } from "../../utils/Delete";
import Card from "../common/Card";
import DeleteAlert from "../common/DeleteAlert";
import Loader from "../common/Loader";
import NoSearchedData from "../common/NoSearchedData";

const Malls = ({ filterMalls, allMalls, setFilterMalls, searchError }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [deleteToast, setDeleteToast] = useState(false);
  const history = useHistory();

  const handleSingleMallClick = (mallId) => {
    console.log(mallId);
    history.push(`malls/${mallId}`);
  };

  const handleSingleMallDelete = async (mallId) => {
    console.log(mallId);
    let confirm = window.confirm("Are you sure to Delete Mall??");
    if (confirm) {
      setIsLoading(true);
      await deleteMallStorage(filterMalls, mallId);
      let newMalls = allMalls.filter((x) => x.id !== mallId);
      setFilterMalls(newMalls);
      setIsLoading(false);
      setDeleteToast(true);
      setTimeout(() => {
        setDeleteToast(false);
      }, 1500);
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      {deleteToast && <DeleteAlert />}
      <div className="malls-wrapper">
        <div className="mall-heading">
          <h2>MALLS</h2>
        </div>
        {searchError && <NoSearchedData />}
        <div className="image-wrapper">
          {filterMalls.map((mall) => (
            <Card
              className="image-container"
              func={handleSingleMallClick}
              name={mall.mallName}
              address={mall.mallAddress}
              imgUrl={mall.mallImage.imageUrl}
              key={mall.id}
              id={mall.id}
              onMallDelete={handleSingleMallDelete}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Malls;
