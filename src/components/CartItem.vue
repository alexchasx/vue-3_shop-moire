<script>
import { mapActions } from 'vuex';
import FormCounter from './FormCounter.vue';

export default {
  components: {
    FormCounter,
  },

  props: {
    item: {
      type: Object,
      required: true,
    },
  },

  computed: {
    itemPrice() {
      return this.item.amount * this.item.product.price;
    },

    amount: {
      get() {
        return this.item.amount;
      },
      set(value) {
        this.$store.dispatch('updateCartProductAmount', {
          basketItemId: this.item.basketItemId,
          productId: this.item.productId,
          colorId: this.item.colorId,
          sizeId: this.item.sizeId,
          amount: value,
        });
      },
    },

    allColors() {
      const colors = JSON.parse(localStorage.getItem('allColorsData')).items;
      return colors;
    },

    currentColor() {
      return this.allColors.find(
        (colorObj) => colorObj.id === this.item.colorId
      );
    },
  },

  methods: {
    ...mapActions({
      deleteProduct: 'deleteProductFromCart',
    }),

    updateInput(amount) {
      this.amount = amount;
    },
  },
};
</script>

<template>
  <li class="cart__item product">
    <div class="product__pic">
      <img
        :src="item.product.defaultImage"
        width="120"
        height="120"
        :alt="item.product.title"
      />
    </div>
    <h3 class="product__title">{{ item.product.title }}</h3>

    <p class="product__info product__info--color">
      Цвет:
      <span>
        <i
          :style="{
            backgroundColor: currentColor.code,
            border: '1px solid #999',
          }"
        ></i>
        {{ currentColor.title }}
      </span>
    </p>

    <span class="product-size"> Размер: {{ item.sizeTitle }} </span>

    <span class="product__code"> Артикул: {{ item.itemNumber }} </span>

    <form-counter
      :wrap-css-class="'product__counter'"
      :item-count="item.amount"
      @updateInput="updateInput"
    />

    <b class="product__price"> {{ itemPrice }} ₽ </b>

    <button
      class="product__del button-del"
      type="button"
      aria-label="Удалить товар из корзины"
      @click="deleteProduct(item.basketItemId)"
    >
      <svg width="20" height="20" fill="currentColor">
        <use xlink:href="#icon-close"></use>
      </svg>
    </button>
  </li>
</template>

<style scoped>
.button-del {
  cursor: pointer;
}

.product {
  grid-template-rows: 40px repeat(2, 35px);
}
.product__code {
  grid-row: 4/4;
}
.product-size {
  grid-column: 2/3;
  grid-row: 3/4;
  font-size: 14px;
  line-height: 1;
  color: #737373;
}
</style>
