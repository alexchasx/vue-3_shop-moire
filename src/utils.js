import { PUBLIC_PATH } from "./constants";

const DEFAULT_IMAGE = PUBLIC_PATH + '/img/default.jpg';

export const getUrlImage = (product = null, colorId = 0) => {
  let urlImage = '';
  const images = product?.colors[colorId]?.gallery;
  if (Array.isArray(images) && images.length > 0) {
    urlImage = images[0].file?.url;
  }
  if (!urlImage) {
    urlImage = DEFAULT_IMAGE;
  }

  return urlImage;
};

export const isEmptyObject = (obj) => {
  for (const name in obj) {
    // eslint-disable-next-line no-prototype-builtins
    if (obj.hasOwnProperty(name)) {
      return false;
    }
  }
  return true;
};

export const getItemNumber = (data) => {
  const {productId, colorId, sizeId} = data;
  return `${productId}-${colorId}-${sizeId}`;
}
