<script>
import { DEFAULT_PER_PAGE } from '@/constants';

export default {
  props: {
    productsPerPage: {
      type: Number,
    },
  },

  emits: ['changeQuantityPerPage'],

  data() {
    return {
      quantitySwitch: [
        {
          quantity: 6,
        },
        {
          quantity: 9,
        },
        {
          quantity: DEFAULT_PER_PAGE,
        },
      ],
    };
  },

  methods: {
    changeQuantity(quantity) {
      this.$emit('changeQuantityPerPage', quantity);
    },
  },
};
</script>

<template>
  <div class="quantity-switch">
    Количество товаров на странице:&nbsp;&nbsp;
    <button
      class="quantity-switch__item button--primery"
      :class="{
        'quantity-switch__item--active': productsPerPage == btn.quantity,
      }"
      v-for="btn in quantitySwitch"
      :key="btn.quantity"
      @click="changeQuantity(btn.quantity)"
    >
      {{ btn.quantity }}
    </button>
  </div>
</template>

<style scoped>
.quantity-switch {
  margin: 0 50px;
  display: flex;
}

.quantity-switch__item {
  width: 40px;
  height: 20px;
}

.quantity-switch__item:not(:last-child) {
  margin-right: 10px;
}

.quantity-switch__item--active {
  background-color: #222;
  color: #fff;
}
</style>
