<script>
import HeaderComponent from '@/components/HeaderComponent';
import FooterComponent from '@/components/FooterComponent.vue';
import { mapActions, mapMutations } from 'vuex';

export default {
  name: 'App',

  components: {
    HeaderComponent,
    FooterComponent,
  },

  data() {
    return {
      productSending: false,
      cartLoading: true,
    };
  },

  created() {
    const userAccessKey = localStorage.getItem('userAccessKey');

    if (userAccessKey) {
      this.updateUserAccessKey(userAccessKey);
    }
    this.loadCart().then(() => {
      this.cartLoading = false;
    });
  },

  methods: {
    ...mapActions(['loadCart']),
    ...mapMutations(['updateUserAccessKey']),
  },
};
</script>

<template>
  <header-component :productSending="productSending" />

  <router-view
    @productSending="productSending = $event"
    :cartLoading="cartLoading"
  />

  <footer-component />
</template>
