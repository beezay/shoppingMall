import React from "react";
import { useForm } from "react-hook-form";
import Alert from "./Alert";
import FileTypeError from "./FileTypeError";

const ShopAddForm = (props) => {
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm();

  return (
    <div className="form-wrapper">
      <div className="top-details">
        <div className="top-header">
          <p>SHOPS</p>
          <p className="close-btn" onClick={props.onClose}>
            X
          </p>
        </div>
        <hr className="w-75 mr-auto" />
      </div>
      <form onSubmit={handleSubmit(props.onSubmit)}>
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
              onChange={props.onChange}
            />
            <span>Upload IMAGEs + </span>
          </label>
          <span className="py-0 mt-2 text-info font-weight-light">
            First Image will be shown as Thumbnail
          </span>
          {props.imageError && <FileTypeError error={props.imageError} /> }
          {props.shopImages &&
            props.shopImages.map((x) => (
              <p className="text-dark"> {x.name} </p>
            ))}
        </div>
        <button
          className="btn btn-lg btn-warning mt-2 "
          type="submit"
          disabled={props.isSubmitting}
        >
          {props.isSubmitting ? "SAVING..." : "SAVE SHOP"}
        </button>
      </form>
    </div>
  );
};

export default ShopAddForm;
