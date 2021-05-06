import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router";
import { SelectIsAdmin, setAdmin } from "../../redux/MallSlice";
import SearchMall from "../Search/SearchMall";
import "./Dashboard.css";
import { fireStore } from "../../firebase/firebase";
import Malls from "./Malls";
import Shops from "./Shops";
import { loginStatus } from "../../utils/CheckLogin";
import NoData from "../common/NoData";
import AddButton from "../common/AddButton";
import Loader from "../common/Loader";
const Dashboard = ({ history }) => {
  // const allMalls = useSelector(selectedAllMalls);

  const [allMalls, setAllMalls] = useState([]);
  const [filteredMalls, setFilteredMalls] = useState([]);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  dispatch(setAdmin(loginStatus));
  const isAdmin = useSelector(SelectIsAdmin);
  console.log("IS ADMIN", isAdmin, loginStatus);

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
      setFilteredMalls(malls.slice(0, 3));
      setAllMalls(malls);
    };
    fetchMalls();
    setTimeout(() => {
      setLoading(false);
    }, 1000);
    return fetchMalls;
  }, []);

  const onChangeSearch = (e) => {
    console.log(e.target.value);
    if (e.target.value) {
      const searchRegex = new RegExp(e.target.value, "gi");
      const searchedMall = allMalls.filter((mall) =>
        mall.mallName.match(searchRegex)
      );
      // debugger
      console.log("SearchedMall", searchedMall);
      console.log("allMalls", allMalls);
      setFilteredMalls(searchedMall);
    } else {
      setFilteredMalls(allMalls.slice(0, 3));
    }
  };

  const shops = filteredMalls.map((mall) => ({
    mallId: mall.id,
    mallName: mall.mallName,
    shops: mall.shops,
  }));

  const handleAddNewMall = () => {
    history.push("/addMall");
  };

  const handleAllMalls = () => {
    history.push("/malls");
  };

  const handleAllShops = () => {
    history.push("/shops");
  };

  console.log("All Malls=>", allMalls);
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="container-fluid dashboard-wrapper h-100">
          <div className="dashboard-header">
            <div className="btn-wrapper">
              {isAdmin && <AddButton onClick={handleAddNewMall} />}
            </div>
            {allMalls.length > 0 && <SearchMall onchange={onChangeSearch} />}
          </div>
          {allMalls.length > 0 ? (
            <div className="wrapper-container malls-container">
              <Malls allMalls={allMalls} filterMalls={filteredMalls} />
              <p className="show-more" onClick={handleAllMalls}>
                {allMalls.length > 3 ? "View All" : ""}
              </p>
            </div>
          ) : (
            <NoData
              title={
                isAdmin
                  ? "No Any Malls to Show... Add One"
                  : "No Any Malls to Show...Visit Later!!!"
              }
            />
          )}

          <div className="wrapper-container shops-container mb-auto">
            {shops.length > 0 ? (
              <>
                <Shops shops={shops} malls={allMalls} />
                <p className="show-more" onClick={handleAllShops}>
                  {allMalls.length > 3 ? "View All" : ""}
                </p>
              </>
            ) : (
              <NoData title="No Any Shops to Show" />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default withRouter(Dashboard);
