import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { fireStore, storage } from "../../firebase/firebase";
import { SelectIsAdmin } from "../../redux/MallSlice";
import { deleteMallStorage } from "../../utils/Delete";
import AddButton from "../common/AddButton";
import Card from "../common/Card";
import Loader from "../common/Loader";
import SearchMall from "../Search/SearchMall";

const AdminAllMalls = () => {
  const [allMalls, setAllMalls] = useState();
  const [filteredMalls, setFilteredMalls] = useState();
  const [loading, setLoading] = useState(true);

  const history = useHistory();

  const isAdmin = useSelector(SelectIsAdmin);

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
      setAllMalls(malls);
      setFilteredMalls(malls);
    };
    fetchMalls();
    setLoading(false);
    return fetchMalls;
  }, []);

  const handleInfoClick = (mallId) => {
    console.log(mallId);
    history.push(`malls/${mallId}`);
  };

  const handleAddNewMall = () => {
    history.push("/addMall");
  };

  const onChangeSearch = (e) => {
    console.log(e.target.value);
    if (e.target.value) {
      const searchRegex = new RegExp(e.target.value, "gi");
      const searchedMall = allMalls.filter((mall) =>
        mall.mallName.match(searchRegex)
      );
      // debugger
      setFilteredMalls(searchedMall);
    } else {
      setFilteredMalls(allMalls);
    }
  };

  const handleSingleMallDelete = async (mallId) => {
    console.log(mallId);
    let confirm = window.confirm("Are you sure to Delete Mall??");
    if (confirm) {
      setLoading(true);
      await deleteMallStorage(filteredMalls, mallId);
      let newMall = allMalls.filter((x) => x.id !== mallId);
      setFilteredMalls(newMall);
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="malls-wrapper">
          <div className="mall-heading d-flex justify-content-between align-items-center w-100">
            <h2>MALLS</h2>
            <SearchMall onchange={onChangeSearch} />
            {isAdmin && <AddButton onClick={handleAddNewMall} />}
          </div>
          {loading && <h4>LOADING...</h4>}
          {filteredMalls && (
            <div className="image-wrapper">
              {filteredMalls.map((mall) => (
                <Card
                  className="image-container"
                  func={handleInfoClick}
                  name={mall.mallName}
                  address={mall.mallAddress}
                  imgUrl={mall.mallImage.imageUrl}
                  key={mall.id}
                  id={mall.id}
                  onMallDelete={handleSingleMallDelete}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default AdminAllMalls;
