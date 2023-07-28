import { createStore } from 'vuex';
import axios from 'axios';
import { API_BASE_URL } from '@/constants';
import { getUrlImage, getItemNumber } from '@/utils';

const API_BASKETS = API_BASE_URL + '/api/baskets';
const API_BASKETS_PRODUCTS = API_BASE_URL + '/api/baskets/products';
const API_DELIVERIES = API_BASE_URL + '/api/deliveries';
const API_PAYMENTS = API_BASE_URL + '/api/payments';
const API_ORDERS = API_BASE_URL + '/api/orders';

const syncProducts = (state) => {
  state.cartProducts = state.cartProductsData.map((item) => {
    return {
      itemNumber: getItemNumber({
        productId: item.product.id,
        colorId: item.color.id,
        sizeId: item.size.id,
      }),
      productId: item.product.id,
      colorId: item.color.color.id,
      sizeId: item.size.id,
      amount: item.quantity,
    };
  });
};

export default createStore({
  state: {
    cartProducts: [],
    userAccessKey: null,
    cartProductsData: [],
    orderInfo: null,
    deliveries: null,
    payments: null,
  },

  mutations: {
    updateOrderInfo(state, orderInfo) {
      state.orderInfo = orderInfo;
    },

    resetCart(state) {
      state.cartProducts = [];
      state.cartProductsData = [];
    },

    updateCartProductAmount(state, { productId, colorId, sizeId, amount }) {
      const item = state.cartProducts.find(
        (item) =>
          item.productId === productId &&
          item.colorId === colorId &&
          item.sizeId === sizeId
      );

      if (item) {
        item.colorId = colorId;
        item.sizeId = sizeId;
        item.amount = amount;
      }
    },

    deleteCartProduct(state, basketItemId) {
      state.cartProductsData = state.cartProductsData.filter(
        (item) => item.id !== basketItemId
      );

      syncProducts(state);
    },

    updateUserAccessKey(state, accessKey) {
      state.userAccessKey = accessKey;
    },

    updateCartProductsData(state, items) {
      state.cartProductsData = items;
    },

    syncCartProducts(state) {
      syncProducts(state);
    },

    updateDeliveries(state, deliveries) {
      state.deliveries = deliveries;
    },

    updatePayments(state, payments) {
      state.payments = payments;
    },
  },

  getters: {
    cartDetailProducts(state) {
      const dublicateItems = [];
      const items = state.cartProducts.map((cartProduct) => {
        const basketItem = state.cartProductsData.find(
          (item) =>
            item.product?.id === cartProduct.productId &&
            !dublicateItems.includes(item.id)
        );

        let obj = {};
        if (basketItem) {
          dublicateItems.push(basketItem.id);
          const product = basketItem?.product;
          obj = {
            basketItemId: basketItem?.id,
            sizeTitle: basketItem?.size.title,
            ...cartProduct,
            product: {
              ...product,
              defaultImage: getUrlImage(product),
            },
          };
        }

        return obj;
      });

      return items;
    },

    cartTotalPrice(state, getters) {
      const price = getters.cartDetailProducts.reduce(
        (acc, item) => item.product.price * item.amount + acc,
        0
      );
      return price;
    },

    cartCountProducts(state) {
      return state.cartProducts.length;
    },
  },

  actions: {
    async loadOrderInfo(context, orderId) {
      const res = await axios.get(API_ORDERS + '/' + orderId, {
        params: {
          userAccessKey: context.state.userAccessKey,
        },
      });
      context.commit('updateOrderInfo', res.data);
    },

    async loadCart(context) {
      const res = await axios.get(API_BASKETS, {
        params: {
          userAccessKey: context.state.userAccessKey,
        },
      });
      if (!context.state.userAccessKey) {
        localStorage.setItem('userAccessKey', res.data.user.accessKey);
        context.commit('updateUserAccessKey', res.data.user.accessKey);
      }
      context.commit('updateCartProductsData', res.data.items);
      context.commit('syncCartProducts');
    },

    async addProductToCart(context, { productId, colorId, sizeId, amount }) {
      await new Promise((resolve) => setTimeout(resolve, 500)); // sleep

      return await axios
        .post(
          API_BASKETS_PRODUCTS,
          {
            productId,
            colorId,
            sizeId,
            quantity: amount,
          },
          {
            params: {
              userAccessKey: context.state.userAccessKey,
            },
          }
        )
        .then((res) => {
          localStorage.setItem('userAccessKey', res.data.user.accessKey);

          context.commit('updateCartProductsData', res.data.items);
          context.commit('syncCartProducts');
        });
    },

    async updateCartProductAmount(
      context,
      { basketItemId, productId, colorId, sizeId, amount }
    ) {
      context.commit('updateCartProductAmount', {
        productId,
        colorId,
        sizeId,
        amount,
      });

      if (amount < 1) {
        return;
      }

      try {
        const res = await axios.put(
          API_BASKETS_PRODUCTS,
          {
            basketItemId,
            quantity: amount,
          },
          {
            params: {
              userAccessKey: context.state.userAccessKey,
            },
          }
        );
        context.commit('updateCartProductsData', res.data.items);
      } catch {
        context.commit('syncCartProducts');
      }
    },

    async deleteProductFromCart(context, basketItemId) {
      const res = await axios.delete(API_BASKETS_PRODUCTS, {
        params: { userAccessKey: context.state.userAccessKey },
        data: { basketItemId },
      });
      context.commit('deleteCartProduct', basketItemId);

      return res;
    },

    async loadDeliveries(context) {
      const res = await axios.get(API_DELIVERIES);
      context.commit('updateDeliveries', res.data);
    },

    async loadPayments(context, deliveryTypeId) {
      const res = await axios.get(API_PAYMENTS, {
        params: { deliveryTypeId },
      });
      context.commit('updatePayments', res.data);
    },

    async createOrder(context, formData) {
      const res = await axios.post(
        API_ORDERS,
        { ...formData },
        {
          params: {
            userAccessKey: context.state.userAccessKey,
          },
        }
      );
      context.commit('resetCart');
      context.commit('updateOrderInfo', res.data);

      return res;
    },
  },
});
