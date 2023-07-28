<script>
import ProductItem from './ProductItem.vue';

export default {
  components: {
    ProductItem,
  },

  props: {
    products: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      productSending: false,
    };
  },

  emits: ['productSending'],

  watch: {
    productSending() {
      this.$emit('productSending', this.productSending);
    },
  },
};
</script>

<template>
  <div class="catalog__list" v-if="products.length > 0">
    <product-item
      @productSending="productSending = $event"
      :product="product"
      v-for="product in products"
      :key="product.id"
    />
  </div>

  <div v-else>Ничего не найдено</div>
</template>
