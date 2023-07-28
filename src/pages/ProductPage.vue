<script>
import FormCounter from '@/components/FormCounter.vue';
import { useStore } from 'vuex';
import BreadCrumbs from '@/components/BreadCrumbs.vue';
import {
  defineComponent,
  defineAsyncComponent,
  ref,
  computed,
  watch,
} from 'vue';
import ColorsList from '@/components/ColorsList.vue';
import BasePreloader from '@/components/BasePreloader.vue';
import { onBeforeRouteUpdate, useRoute } from 'vue-router';
import useProduct from '@/hooks/useProduct.js';

export default defineComponent({
  components: {
    FormCounter,
    BreadCrumbs,
    BasePreloader,
    ColorsList,
    MessageModal: defineAsyncComponent({
      loader: () => import('@/components/MessageModal.vue'),
      delay: 0,
    }),
  },

  setup(props, { emit }) {
    const $route = useRoute();
    const $store = useStore();
    const {
      product,
      category,
      fetchProduct,
      status: productStatus,
      selectedColor,
      selectedColorGallery,
      selectedSizeId,
      pageTitle,
      tabs,
      itemNumber,
    } = useProduct();

    const productAmount = ref(1);
    const updateInput = (amount) => {
      productAmount.value = amount;
    };

    const isProductAddSending = ref(false);
    const message = ref('');
    const isShowMessage = ref(false);
    const doTogglePreloader = (status) => {
      isProductAddSending.value = status;
      emit('productSending', isProductAddSending.value);
    };

    const selectColor = (colorObj) => {
      selectedColor.value = colorObj;
    };
    const addToCart = () => {
      isShowMessage.value = false;
      doTogglePreloader(true);

      if (productAmount.value > 0) {
        $store
          .dispatch('addProductToCart', {
            productId: product.value.id,
            colorId: selectedColor.value.color.id,
            sizeId: selectedSizeId.value,
            amount: productAmount.value,
          })
          .then(() => {
            message.value = 'Товар добавлен в корзину';
          })
          .catch((err) => {
            message.value = 'Произошла ошибка';
            console.error(err);
          })
          .finally(() => {
            isShowMessage.value = true;
            doTogglePreloader(false);
          });
      }
    };

    const colorIds = ref([]);
    const preview = ref(null);
    watch(selectedColor, () => {
      if (preview.value) {
        preview.value.src = selectedColor.value.gallery[0]?.file?.url;
      }
      selectedColorGallery.value = selectedColor.value.gallery;
    });

    const activeTabId = ref('info');
    const breadCrumbs = computed(() => {
      return [
        {
          paramId: category.value.id,
          text: category.value.title,
          routeName: 'category',
        },
        {
          text: pageTitle.value,
          routeName: null,
        },
      ];
    });

    fetchProduct($route.params.id);
    onBeforeRouteUpdate(() => {
      fetchProduct($route.params.id);
    });

    return {
      pageTitle,
      productAmount,
      productStatus,
      isProductAddSending,
      message,
      isShowMessage,
      colorIds,
      selectedColor,
      selectedColorGallery,
      selectedSizeId,
      activeTabId,
      tabs,
      product,
      category,
      breadCrumbs,
      addToCart,
      updateInput,
      selectColor,
      preview,
      fetchProduct,
      itemNumber,
    };
  },
});
</script>

<template>
  <main class="content container spinner-wrap" v-if="productStatus.isLoading">
    <base-preloader class="spinner" />
  </main>

  <main class="content container" v-else-if="productStatus.isFailed">
    Не удалось загрузить товар
    <button @click.prevent="fetchProduct($route.params.id)">
      Попробовать ещё раз
    </button>
  </main>

  <main class="content container" v-else>
    <div class="content__top">
      <bread-crumbs :bread-crumbs="breadCrumbs"></bread-crumbs>
    </div>

    <section class="item">
      <div class="item__pics pics">
        <div class="pics__wrapper">
          <img
            ref="preview"
            width="570"
            height="570"
            :src="product.defaultImage"
            :alt="product.title"
          />
        </div>

        <ul class="pics__list">
          <li
            class="pics__item"
            v-for="image in selectedColorGallery"
            :key="image.id"
          >
            <img
              width="98"
              height="98"
              :src="image?.file?.url"
              :alt="product.title"
            />
          </li>
        </ul>
      </div>

      <div class="item__info">
        <span class="item__code">Артикул: {{ itemNumber }}</span>
        <h2 class="item__title">
          {{ product.title }}
        </h2>
        <div class="item__form">
          <form
            class="form"
            action="#"
            method="POST"
            @submit.prevent="addToCart"
          >
            <div class="item__row item__row--center product-price">
              <form-counter @updateInput="updateInput" />

              <b class="item__price"> {{ product.price }} ₽ </b>
            </div>

            <fieldset class="form__block product-param">
              <legend class="form__legend">Цвет:</legend>

              <colors-list
                :colors="product.colors"
                @selectColor="selectColor"
              ></colors-list>
            </fieldset>

            <fieldset class="form__block product-param product-param--last">
              <legend class="form__legend">Размер</legend>
              <label class="form__label form__label--small form__label--select">
                <select
                  class="form__select"
                  name="category"
                  v-model="selectedSizeId"
                >
                  <option
                    :value="size.id"
                    v-for="size in product.sizes"
                    :key="size.id"
                  >
                    {{ size.title }}
                  </option>
                </select>
              </label>
            </fieldset>

            <transition name="mode-fade" mode="out-in">
              <div
                class="btn-spinner-wrap"
                key="one"
                v-if="isProductAddSending"
              >
                <base-preloader class="btn-spinner" />
              </div>

              <button
                class="item__button button button--primery"
                type="submit"
                :disabled="isProductAddSending"
                key="two"
                v-else
              >
                В корзину
              </button>
            </transition>

            <message-modal v-model:open="isShowMessage">
              {{ message }}
            </message-modal>
          </form>
        </div>
      </div>

      <div class="item__desc">
        <ul class="tabs">
          <li class="tabs__item" v-for="tab in tabs" :key="tab.id">
            <a
              :href="tab.href"
              active-class="tabs__link--current"
              class="tabs__link"
              :class="{ 'tabs__link--current': activeTabId === tab.id }"
              @click.prevent="activeTabId = tab.id"
            >
              {{ tab.title }}
            </a>
          </li>
        </ul>

        <div
          :id="tab.id"
          class="item__content"
          v-for="tab in tabs"
          :key="tab.id"
          v-show="activeTabId === tab.id"
        >
          {{ tab.content }}
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.product-price {
  margin-bottom: 20px;
}

.product-param {
  width: 26%;
  display: inline-block;
}

.product-param--last {
  margin-right: 100px;
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
  position: relative;
  width: 200px;
  height: 67px;
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
  margin-top: 20px;
  padding: 25px;
  width: 200px;
}
</style>
