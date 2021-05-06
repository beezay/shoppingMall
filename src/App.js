import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, Route, Switch, withRouter } from "react-router";
import AdminAllMalls from "./components/Admin/AdminAllMalls";
import AdminAllShops from "./components/Admin/AdminAllShops";
import LoginAdmin from "./components/Admin/LoginAdmin";
import Navbar from "./components/Admin/Navbar";
import RegisterAdmin from "./components/Admin/RegisterAdmin";
import Dashboard from "./components/HomePage/Dashboard";
import Malls from "./components/HomePage/Malls";
import Shops from "./components/HomePage/Shops";
import AddMall from "./components/MallPage/AddMall";
import EditMall from "./components/MallPage/EditMall";
import MallsDetails from "./components/MallPage/MallsDetails";
import ShopId from "./components/Shop/ShopId";
import { fireStore } from "./firebase/firebase";
import { fetchMalls, SelectIsAdmin, setAdmin } from "./redux/MallSlice";
import { loginStatus } from "./utils/CheckLogin";

const App = () => {
  // const [showSearchbar, setShowSearchbar] = useState(false)
  const dispatch = useDispatch();
  dispatch(setAdmin(loginStatus));
  const isAdmin = useSelector(SelectIsAdmin);
  useEffect(() => {
    dispatch(setAdmin(loginStatus));
  }, []);

  // useEffect(() => {
  //   const data = fireStore
  //     .collection("mallInfo")
  //     .get()
  //     .then((snapshot) => {
  //       snapshot.forEach((doc) => {
  //         dispatch({
  //           type: fetchMalls,
  //           payload: {
  //             ...doc.data(),
  //             id: doc.id
  //           },
  //         });
  //       });
  //     }, []);

  //   console.log(data);
  // });

  return (
    <>
      <Navbar />
      <Switch>
        <Route
          exact
          path="/"
          render={() => <Dashboard showSearchbar="false" />}
        />
        <Route
          path="/addMall"
          render={() => (isAdmin ? <AddMall /> : <Redirect to="/" />)}
        />
        <Route
          path="/editMall/:id"
          render={() => (isAdmin ? <EditMall /> : <Redirect to="/" />)}
        />
        <Route path="/malls/:id" render={() => <MallsDetails />} />
        <Route path="/shop/:mallid/:shopid" render={() => <ShopId />} />
        <Route exact path="/malls" render={() => <AdminAllMalls />} />
        <Route exact path="/shops" render={() => <AdminAllShops />} />
        <Route path="/shops" render={() => <Shops />} />
        <Route path="/admin/register" render={() => <RegisterAdmin />} />
        <Route path="/admin/login" render={() => <LoginAdmin />} />
        <Redirect to="/" />
        {/* <Dashboard /> */}
      </Switch>
    </>
  );
};

export default withRouter(App);
