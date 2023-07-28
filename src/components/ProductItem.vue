<script>
import ColorsList from '@/components/ColorsList.vue';
import { mapActions } from 'vuex';
import BasePreloader from '@/components/BasePreloader.vue';
import axios from 'axios';
import { API_PRODUCTS } from '@/constants';

export default {
  components: {
    ColorsList,
    BasePreloader,
  },

  props: {
    product: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      selectedColor: null,
      selectedSizeId: 0,
      showMessage: false,
      productAddSending: false,
      message: '',
    };
  },

  emits: ['productSending'],

  watch: {
    selectedColor(colorObj) {
      if (colorObj.gallery) {
        this.$refs.preview.src = colorObj.gallery[0]?.file?.url;
        this.selectedColorGallery = colorObj.gallery;
      }
    },
  },

  mounted() {
    this.selectedColor = this.product.colors[0];
  },

  methods: {
    ...mapActions(['addProductToCart']),

    async addToCart() {
      this.showMessage = false;
      this.updatePreloaderStatus(true);
      const sizeId = await this.loadProductSize();

      this.addProductToCart({
        productId: this.product.id,
        colorId: this.selectedColor.color.id,
        sizeId,
        amount: 1,
      })
        .then(() => {
          this.message = 'Товар добавлен в корзину';
        })
        .catch((err) => {
          this.message = 'Произошла ошибка';
          console.error(err);
        })
        .finally(() => {
          this.showMessage = true;
          this.updatePreloaderStatus(false);
          setTimeout(() => {
            this.showMessage = false;
          }, 1000);
        });
    },

    selectColor(colorObj) {
      this.selectedColor = colorObj;
    },

    async loadProductSize() {
      this.productLoading = true;
      this.productLoadingFailed = false;
      const res = await axios.get(API_PRODUCTS + this.product.id);

      return res.data.sizes[0].id;
    },

    updatePreloaderStatus(status) {
      this.productAddSending = status;
      this.$emit('productSending', this.productAddSending);
    },
  },
};
</script>

<template>
  <article class="catalog__item">
    <transition name="mode-fade">
      <div class="cart__error form__error-block add-message" v-if="showMessage">
        <h4>{{ message }}</h4>
      </div>
    </transition>

    <router-link
      class="catalog__pic"
      :to="{ name: 'product', params: { id: product.id } }"
    >
      <img ref="preview" :src="product.defaultImage" :alt="product.title" />
    </router-link>

    <h3 class="catalog__title">
      <router-link :to="{ name: 'product', params: { id: product.id } }">
        {{ product.title }}
      </router-link>
    </h3>

    <span class="catalog__price"> {{ product.price }} ₽ </span>

    <form class="form" action="#" method="POST" @submit.prevent="addToCart">
      <colors-list
        :colors="product.colors"
        @selectColor="selectColor"
      ></colors-list>

      <transition name="mode-fade" mode="out-in">
        <div class="btn-spinner-wrap" key="one" v-if="productAddSending">
          <base-preloader class="btn-spinner" />
        </div>

        <button
          class="button button--primery mini-button"
          type="submit"
          :disabled="productAddSending"
          key="two"
          v-else
        >
          В корзину
        </button>
      </transition>
    </form>
  </article>
</template>

<style scoped>
.catalog__item {
  position: relative;
}
.mini-button {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 84px;
  padding: 10px;
  padding-top: 15px;
  font-size: 10px;
}

.spinner-wrap {
  height: 100vh;
}
.spinner {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transform: -webkit-translate(-50%, -50%);
  transform: -moz-translate(-50%, -50%);
  transform: -ms-translate(-50%, -50%);
}

.btn-spinner-wrap {
  position: absolute;
  bottom: -26px;
  right: 24px;
  width: 40px;
}
.btn-spinner {
  position: relative;
}

.mode-fade-enter-active,
.mode-fade-leave-active {
  transition: opacity 0.3s ease;
}

.mode-fade-enter-from,
.mode-fade-leave-to {
  opacity: 0;
}

.add-message {
  position: absolute;
  bottom: 10%;
  right: 0;
  margin-top: 20px;
  padding: 25px;
  width: 200px;
  background-color: white;
}
</style>
