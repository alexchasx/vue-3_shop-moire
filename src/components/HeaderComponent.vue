<script>
import CartIndicator from '@/components/CartIndicator.vue';

export default {
  name: 'HeaderComponent',

  components: { CartIndicator },

  props: {
    productSending: Boolean,
  },
};
</script>

<template>
  <header class="header container">
    <div class="header__wrapper">
      <span class="header__info">Каталог</span>

      <router-link class="header__logo" :to="{ name: 'main' }">
        <img
          src="img/svg/logo-moire.svg"
          alt="Логотип интернет магазина Moire"
          width="116"
          height="34"
        />
      </router-link>

      <a class="header__tel" href="tel:8 800 600 90 09"> 8 800 600 90 09 </a>

      <cart-indicator :productSending="productSending" />
    </div>
  </header>
</template>
