<script>
import { getItemNumber } from '@/utils';

export default {
  props: {
    items: {
      type: Array,
    },
    deliveryPrice: {
      type: String,
    },
    countProducts: {
      type: Number,
    },
    totalPrice: {
      type: Number,
    },
  },

  methods: {
    doGetItemNumber(item) {
      return getItemNumber({
        productId: item.product.id,
        colorId: item.color.id,
        sizeId: item.size.id,
      });
    },
  },
};
</script>

<template>
  <div class="cart__block" key="two">
    <ul class="cart__orders">
      <li v-for="item in items" :key="item.productId" class="cart__order">
        <h3>{{ item.product.title }}</h3>
        <b>{{ (item.amount || item.quantity) * item.product.price }} ₽</b>
        <span>Артикул: {{ item.itemNumber || doGetItemNumber(item) }}</span>
        <span>Размер: {{ item.sizeTitle || item.size.title }}</span>
      </li>
    </ul>

    <div class="cart__total">
      <p>
        Доставка: <b>{{ deliveryPrice }}</b>
      </p>
      <p>
        Итого: <b>{{ countProducts }}</b> товара на сумму
        <b>{{ totalPrice }} ₽</b>
      </p>
    </div>

    <slot></slot>
  </div>
</template>
