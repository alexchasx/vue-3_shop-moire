<script>
import { mapGetters } from 'vuex';
import CartItem from '@/components/CartItem.vue';
import { CART_PAGE_TITLE, MAIN_PAGE_TITLE } from '@/constants';
import BreadCrumbs from '@/components/BreadCrumbs.vue';
import BasePreloader from '@/components/BasePreloader.vue';

export default {
  components: {
    CartItem,
    BreadCrumbs,
    BasePreloader,
  },

  props: {
    cartLoading: Boolean,
  },

  data() {
    return {
      pageTitle: CART_PAGE_TITLE,
      pageMainTitle: MAIN_PAGE_TITLE,
    };
  },

  computed: {
    ...mapGetters({
      items: 'cartDetailProducts',
      totalPrice: 'cartTotalPrice',
      countProducts: 'cartCountProducts',
    }),

    breadCrumbs() {
      return [
        {
          text: CART_PAGE_TITLE,
          routeName: null,
        },
      ];
    },
  },

  methods: {
    reset() {
      this.items.forEach((item) => {
        this.$store.dispatch('deleteProductFromCart', item.basketItemId);
      });
    },
  },
};
</script>

<template>
  <div>
    <main class="content container">
      <div class="content__top">
        <bread-crumbs :bread-crumbs="breadCrumbs"></bread-crumbs>

        <div class="content__row">
          <h1 class="content__title">{{ pageTitle }}</h1>
          <span class="content__info">Всего товаров: {{ countProducts }} </span>
        </div>
      </div>

      <section class="cart">
        <form class="cart__form form" action="#" method="POST">
          <div class="cart__field">
            <base-preloader class="btn-spinner" v-if="cartLoading" />

            <ul class="cart__list" v-else-if="items.length > 0">
              <transition-group name="list">
                <cart-item
                  v-for="item in items"
                  :key="item.basketItemId"
                  :item="item"
                />
              </transition-group>
            </ul>

            <div v-else>
              <h3>Корзина пуста</h3>
              <div>
                <router-link :to="{ name: 'main' }">
                  <button class="button button--primery btn-link">
                    В каталог
                  </button>
                </router-link>
              </div>
            </div>
          </div>

          <div class="cart__block">
            <p class="cart__desc">
              Мы&nbsp;посчитаем стоимость доставки на&nbsp;следующем этапе
            </p>
            <p class="cart__price">
              Итого: <span>{{ totalPrice }} ₽</span>
            </p>

            <router-link v-if="items.length" :to="{ name: 'order' }">
              <button class="cart__button button button--primery" type="submit">
                Оформить заказ
              </button>
            </router-link>
          </div>

          <button
            class="filter__reset button button--second cart-clear"
            type="button"
            @click.prevent="reset"
            v-if="items.length"
          >
            Очистить корзину
          </button>
        </form>
      </section>
    </main>
  </div>
</template>

<style scoped>
.cart__button {
  text-align: center;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(130px);
}

.btn-spinner {
  position: absolute;
  left: 32%;
  top: 34%;
}

.btn-link {
  height: 53px;
  padding: 20px;
}

.mode-fade-enter-active,
.mode-fade-leave-active {
  transition: opacity 0.3s ease;
}

.mode-fade-enter-from,
.mode-fade-leave-to {
  opacity: 0;
}

.cart-clear {
  margin-top: 20px;
  width: 110px;
  padding: 10px;
}
</style>
