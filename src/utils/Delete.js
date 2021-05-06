import { fireStore, storage } from "../firebase/firebase";

export const deleteShopStorage = async (malls, mallId, shopId) => {
  console.log("Delete Shop Activated", malls, shopId);
  let filteredMall = malls.filter((x) => x.id === mallId);
  console.log("Deleted Shop", filteredMall);
  const deletedShop = filteredMall[0].shops.filter((x) => x.id === shopId);
  let remainingShops = filteredMall[0]?.shops?.filter((x) => x.id !== shopId);
  const shopImagesName = deletedShop[0]?.shopImages?.map(
    (img) => img.shopImgId
  );
  console.log(shopImagesName);

  try {
    if (shopImagesName.length > 0) {
      await Promise.all(
        shopImagesName?.map((img) =>
          storage
            .ref("shopImages")
            .child(img)
            .delete()
            .then(() => console.log("Image Deleted"))
        )
      );
    }
    await fireStore
      .collection("mallInfo")
      .doc(mallId)
      .update({ shops: [...remainingShops] })
      .then(() => {
        console.log("All task Done");
        window.location.reload();
      });
  } catch (e) {
    console.log(e);
  }
};

export const deleteMallStorage = async (malls, mallId) => {
  console.log("delete mall Storage", malls, mallId);

  const mallToDelete = malls.find((x) => x.id === mallId);
  const remainingMalls = malls.filter((x) => x.id !== mallId);
  console.log("Deleted Mall=>", mallToDelete);

  const shopsToDelete = mallToDelete.shops;
  console.log(shopsToDelete);

  const allImages = mallToDelete?.shops?.reduce((arr, shop) => {
    const images = shop?.shopImages?.reduce((imgArr, img) => {
      imgArr.push(img.shopImgId);
      return imgArr;
    }, []);
    arr = [...arr, ...images];
    return arr;
  }, []);

  console.log("All Images", allImages);
  try {
    if (allImages.length > 0) {
      await Promise.all(
        allImages?.map((img) =>
          storage
            .ref("shopImages")
            .child(img)
            .delete()
            .then(() => console.log("Image Deleted"))
        )
      );
    }
    await storage
      .ref("mallImages")
      .child(`${mallId}mall`)
      .delete()
      .then(() => console.log("Image Deleted"));

    await fireStore
      .collection("mallInfo")
      .doc(mallId)
      .delete()
      .then(() => console.log("Mall Deleted"));
  } catch (error) {
    console.log("Check Malls.js");
  }
};
