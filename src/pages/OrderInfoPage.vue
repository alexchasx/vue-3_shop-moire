<script>
import BreadCrumbs from '@/components/BreadCrumbs.vue';
import { CART_PAGE_TITLE } from '@/constants';
import CartOrderBlock from '@/components/CartOrderBlock.vue';

export default {
  components: {
    BreadCrumbs,
    CartOrderBlock,
  },

  data() {
    return {
      pageTitle: document.title,
      dictionaryList: [
        {
          property: 'name',
          title: 'Получатель',
        },
        {
          property: 'address',
          title: 'Адрес доставки',
        },
        {
          property: 'phone',
          title: 'Телефон',
        },
        {
          property: 'email',
          title: 'Email',
        },
        {
          property: 'paymentType',
          title: 'Способ оплаты',
        },
      ],
      order: null,
    };
  },

  computed: {
    items() {
      return this.order?.basket?.items;
    },

    deliveryPrice() {
      return this.order?.deliveryType?.price > 0
        ? this.order?.deliveryType?.price + ' ₽'
        : 'бесплатно';
    },

    totalPrice() {
      return this.order?.totalPrice;
    },

    countProducts() {
      return this.order?.basket?.items?.length;
    },

    breadCrumbs() {
      return [
        {
          text: CART_PAGE_TITLE,
          routeName: 'cart',
        },
        {
          text: this.pageTitle,
          routeName: null,
        },
      ];
    },
  },

  async created() {
    await this.$store.dispatch('loadOrderInfo', this.$route.params.id);
    this.order = this.$store.state.orderInfo;
  },
};
</script>

<template>
  <main class="content container">
    <div class="content__top">
      <bread-crumbs :bread-crumbs="breadCrumbs"></bread-crumbs>

      <h1 class="content__title">
        Заказ оформлен <span>№ {{ order?.id }}</span>
      </h1>
    </div>

    <section class="cart">
      <div class="cart__form form">
        <div class="cart__field">
          <p class="cart__message">
            Благодарим за&nbsp;выбор нашего магазина. На&nbsp;Вашу почту придет
            письмо с&nbsp;деталями заказа. Наши менеджеры свяжутся с&nbsp;Вами
            в&nbsp;течение часа для уточнения деталей доставки.
          </p>

          <ul class="dictionary">
            <li
              class="dictionary__item"
              v-for="dictionary in dictionaryList"
              :key="dictionary.property"
            >
              <span class="dictionary__key"> {{ dictionary.title }} </span>
              <span class="dictionary__value">
                {{ order?.[dictionary.property] }}
              </span>
            </li>
          </ul>
        </div>

        <cart-order-block
          :items="items"
          :deliveryPrice="deliveryPrice"
          :countProducts="countProducts"
          :totalPrice="totalPrice"
        >
        </cart-order-block>
      </div>
    </section>
  </main>
</template>
