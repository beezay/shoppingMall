import { createSlice } from "@reduxjs/toolkit";

// const initialState = {};

const mallSlice = createSlice({
  name: "malls",
  initialState: {
    malls: [],
    addedShops: [],
    newAddedShops: [],
    isAdmin: null,
  },
  reducers: {
    addShops: (state, action) => {
      return {
        ...state,
        addedShops: [...state.addedShops, action.payload],
      };
    },

    addNewShops: (state, action) => {
      return {
        ...state,
        newAddedShops: [...state.newAddedShops, action.payload],
      };
    },

    removeSingleShopImage: (state, action) => {
      return {
        ...state,
        newAddedShops: state.newAddedShops.map((shop) =>
          shop.id === action.payload.shopId
            ? {
                ...shop,
                shopImages: shop.shopImages.filter(
                  (img) => img.id !== action.payload.imgId
                ),
              }
            : shop
        ),
        addedShops: state.addedShops.map((shop) =>
          shop.id === action.payload.shopId
            ? {
                ...shop,
                shopImages: shop.shopImages.filter(
                  (img) => img.id !== action.payload.imgId
                ),
              }
            : shop
        ),
      };
    },

    removeShop: (state, action) => {
      return {
        ...state,
        newAddedShops: state.newAddedShops.filter(
          (shop) => shop.id !== action.payload
        ),
        addedShops: state.addedShops.filter(
          (shop) => shop.id !== action.payload
        ),
      };
    },

    resetShops: (state, action) => {
      return {
        ...state,
        newAddedShops: [],
        addedShops: [],
      };
    },

    setAdmin: (state, action) => {
      return {
        ...state,
        isAdmin: action.payload === "true" ? true : false,
      };
    },

    fetchMalls: (state, action) => {
      return {
        ...state,
        malls: [...state.malls, action.payload],
      };
    },
  },
});

export const {
  fetchMalls,
  addShops,
  addNewShops,
  removeShop,
  removeSingleShopImage,
  resetShops,
  setAdmin,
} = mallSlice.actions;

export const selectedAllMalls = (state) => state.malls.malls;
export const selectAddedShops = (state) => state.malls.addedShops;
export const selectNewAddedShops = (state) => state.malls.newAddedShops;
export const SelectIsAdmin = (state) => state.malls.isAdmin;

export default mallSlice.reducer;
