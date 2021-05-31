import React from "react";
import { useForm } from "react-hook-form";
import AddedMallDetails from "../MallPage/AddedMallDetails";
import AddShop from "../MallPage/AddShop";
import MallPreview from "../MallPage/MallPreview";
import Alert from "./Alert";

const MallForm = (props) => {
  let submitBtnClassName = "w-100 btn btn-lg btn-outline-primary btn-save";

  if (props?.isSubmitting) {
    submitBtnClassName += " disabled";
  }

  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm();

  return (
    <div className="row">
      <div className="add-mall-form col-4">
        <form onSubmit={handleSubmit(props?.onSubmit)}>
          <h1 className="h3 mb-3 fw-normal">Your Mall Details Here!!!</h1>
          <div className="form-floating">
            <input
              type="text"
              className="form-control"
              id="mall-name"
              placeholder="Name of the Mall"
              defaultValue={props?.mall?.mallName}
              {...register("mallName", { required: true })}
            />
            {/* <label htmlFor="floatingInput">Mall Name</label> */}
            {errors.mallName && <Alert title="Mall Name is Required!" />}
          </div>
          <div className="form-floating">
            <input
              type="text"
              className="form-control"
              id="mall-address"
              placeholder="Address"
              defaultValue={props?.mall?.mallAddress}
              {...register("mallAddress", { required: true })}
            />
            {/* <label htmlFor="floatingPassword">Address</label> */}
            {errors.mallAddress && <Alert title="Address Required!" />}
          </div>

          <div className="form-floating">
            <label htmlFor="file-upload" className="image-add">
              <input id="file-upload" type="file" onChange={props?.onChange} />
              <span>+</span>
            </label>
            {props.newMallImage ? (
              <MallPreview
                image={props?.newMallImage.imageName}
                preview={props?.mallImgPreview}
              />
            ) : (
              props.mallImage && (
                <MallPreview
                  image={props?.mallImage?.imageName}
                  preview={props?.mallImgPreview}
                />
              )
            )}
            {props?.imageError && (
              <p className="alert-danger py-2 rounded w-50 m-auto">
                {" "}
                {props?.imageError}{" "}
              </p>
            )}
          </div>
        </form>
        {props.shopAdd && (
          <AddShop
            setShopAdd={props?.setShopAdd}
            shopDetails={props?.addedShopsDetails}
            setToast={props?.setToast}
            edit={props?.edit}
          />
        )}
        <div className="add-shop">
          {props.shopAdd ? (
            <p className="add-shop-p" onClick={() => props.setShopAdd(false)}>
              Cancel{" "}
            </p>
          ) : (
            <p className="add-shop-p" onClick={() => props.setShopAdd(true)}>
              Add Shop <span>+</span>{" "}
            </p>
          )}
        </div>
        <button
          id="dynamic-btn"
          className={submitBtnClassName}
          type="submit"
          onClick={handleSubmit(props?.onSubmit)}
          disabled={props?.isSubmitting}
        >
          {props.edit
            ? props.isSubmitting
              ? "Updating..."
              : "UPDATE MALL"
            : props.isSubmitting
            ? "Saving..."
            : "Save MALL"}
        </button>
        <button
          className="w-100 btn btn-lg btn-outline-warning btn-cancel"
          type="button"
          onClick={props?.onCancel}
          disabled={props?.isSubmitting}
        >
          CANCEL
        </button>
      </div>
      {props?.addedShopsDetails?.length > 0 ||
      props?.newAddedShopsDetails?.length > 0 ? (
        <div className="col-6">
          <AddedMallDetails
            addedShopsDetails={props.addedShopsDetails}
            newAddedShopsDetails={props.newAddedShopsDetails}
            edit={props?.edit}
          />
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default MallForm;
