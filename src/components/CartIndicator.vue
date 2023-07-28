<script>
import { mapGetters } from 'vuex';
import BasePreloader from './BasePreloader.vue';

export default {
  components: {
    BasePreloader,
  },

  props: {
    productSending: Boolean,
  },

  computed: {
    ...mapGetters({
      countProducts: 'cartCountProducts',
    }),
  },
};
</script>

<template>
  <div class="cart-indicator-wrap">
    <router-link
      class="header__cart"
      aria-label="Корзина с товарами"
      :to="{ name: 'cart' }"
    >
      <svg width="19" height="24" fill="currentColor">
        <use xlink:href="#icon-cart"></use>
      </svg>

      <base-preloader
        class="cart-indicator-preloader"
        v-if="productSending"
      />

      <span class="header__count" aria-label="Количество товаров" v-else>
        {{ countProducts }}
      </span>
    </router-link>
  </div>
</template>

<style scoped>
.cart-indicator-wrap {
  position: relative;
}
.cart-indicator-preloader {
  position: absolute;
  top: 5px;
  right: 0px;
  width: 15px;
  height: 15px;
}
</style>
