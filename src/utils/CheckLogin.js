import { useDispatch } from "react-redux";
import { setAdmin } from "../redux/MallSlice";

export const loginStatus = localStorage.getItem("loginStatus");

// export const dispatchAdminStatus = dispatch(setAdmin(loginStatus));
