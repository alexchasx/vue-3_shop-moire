<script>
import { mapGetters } from 'vuex';
import { CART_PAGE_TITLE } from '@/constants';
import BreadCrumbs from '@/components/BreadCrumbs.vue';
import BasePreloader from '@/components/BasePreloader.vue';
import { isEmptyObject } from '@/utils';
import CartOrderBlock from '@/components/CartOrderBlock.vue';

const DEFAULT_DELIVERY_PRICE = '290 ₽';

export default {
  components: {
    BreadCrumbs,
    BasePreloader,
    CartOrderBlock,
  },

  data() {
    return {
      pageTitle: document.title,
      orderSending: false,

      deliveryPrice: DEFAULT_DELIVERY_PRICE,
      pickedDeliveryId: 2,
      pickedPaymentId: 2,
      payments: [],

      formData: {
        deliveryTypeId: 2,
        paymentTypeId: 2,
      },
      formError: {},
      formErrorMessage: '',
      formInputs: [
        {
          propName: 'name',
          title: 'ФИО',
          type: 'text',
          placeholder: 'Введите ваше полное имя',
        },
        {
          propName: 'address',
          title: 'Адрес доставки',
          type: 'text',
          placeholder: 'Введите ваш адрес',
        },
        {
          propName: 'phone',
          title: 'Телефон',
          type: 'tel',
          placeholder: 'Введите ваш телефон',
        },
        {
          propName: 'email',
          title: 'Email',
          type: 'email',
          placeholder: 'Введите ваш Email',
        },
      ],
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
          routeName: 'cart',
        },
        {
          text: this.pageTitle,
          routeName: null,
        },
      ];
    },

    orderDeliveries() {
      return this.$store.state.deliveries;
    },
  },

  watch: {
    pickedDeliveryId(value) {
      this.formData.deliveryTypeId = value;
      this.updatePayments(value);
      this.pickedPaymentId = value;
    },

    pickedPaymentId(value) {
      this.formData.paymentTypeId = value;
    },

    deliveryPrice(value) {
      const val = parseFloat(value);
      if (val <= 0) {
        this.deliveryPrice = 'бесплатно';
      }
    },
  },

  async created() {
    await this.$store.dispatch('loadDeliveries');
    this.updatePayments(this.pickedDeliveryId);
  },

  methods: {
    checkForm() {
      const messageForEmpty = 'Поле не должно быть пустым';
      if (!this.formData.name) {
        this.formError.name = messageForEmpty;
      }
      if (!this.formData.address) {
        this.formError.address = messageForEmpty;
      }
      if (!this.formData.phone) {
        this.formError.phone = messageForEmpty;
      }
      if (!/^\S+@\S+\.\S+$/.test(this.formData.email)) {
        this.formError.email = 'Неправильный email';
      }
      if (!this.formData.email) {
        this.formError.email = messageForEmpty;
      }
      if (!isEmptyObject(this.formError)) {
        this.orderSending = false;

        return false;
      }
      return true;
    },

    doOrderSubmit() {
      this.formError = {};
      this.orderSending = true;
      if (!this.checkForm()) {
        return;
      }

      this.formErrorMessage = '';
      this.$store
        .dispatch('createOrder', this.formData)
        .then((res) => {
          this.$router.push({ name: 'orderInfo', params: { id: res.data.id } });
        })
        .catch((error) => {
          const errorData = error.response.data.error;
          this.formError = errorData.request || {};
          this.formErrorMessage = errorData.message;
        })
        .finally(() => {
          this.orderSending = false;
        });
    },

    async updatePayments(pickedDeliveryId) {
      await this.$store.dispatch('loadPayments', pickedDeliveryId);
      this.payments = this.$store.state.payments;
      this.updateDeliveryPrice();
    },

    updateDeliveryPrice() {
      this.deliveryPrice =
        this.orderDeliveries.find(
          (delivery) => delivery.id == this.pickedDeliveryId
        ).price + ' ₽';
    },
  },
};
</script>

<template>
  <main class="content container">
    <div class="content__top">
      <bread-crumbs :bread-crumbs="breadCrumbs"></bread-crumbs>

      <div class="content__row">
        <h1 class="content__title">{{ pageTitle }}</h1>
      </div>
    </div>

    <section class="cart">
      <form
        class="cart__form form"
        action="#"
        method="POST"
        @submit.prevent="doOrderSubmit"
      >
        <div class="cart__field">
          <div class="cart__data">
            <label
              class="form__label"
              v-for="formInput in formInputs"
              :key="formInput.propName"
            >
              <input
                class="form__input"
                v-model="formData[formInput.propName]"
                :type="formInput.type"
                :placeholder="formInput.placeholder"
              />
              <span class="form__value">{{ formInput.title }}</span>
              <span class="form__error" v-if="formError[formInput.propName]">{{
                formError[formInput.propName]
              }}</span>
            </label>

            <label class="form__label">
              <textarea
                class="form__input form__input--area"
                v-model="formData.comment"
                placeholder="Ваши пожелания"
              ></textarea>
              <span class="form__value">Комментарий к заказу</span>
              <span class="form__error" v-if="formError.comment">{{
                formError.comment
              }}</span>
            </label>
          </div>

          <div class="cart__options">
            <h3 class="cart__title">Доставка</h3>

            <ul class="cart__options options">
              <li
                class="options__item"
                v-for="delivery in orderDeliveries"
                :key="delivery.id"
              >
                <label class="options__label">
                  <input
                    class="options__radio sr-only"
                    type="radio"
                    name="delivery"
                    checked=""
                    :value="delivery.id"
                    v-model="pickedDeliveryId"
                  />
                  <span class="options__value">
                    {{ delivery.title }}
                    <b>{{
                      +delivery.price > 0 ? delivery.price + ' ₽' : 'бесплатно'
                    }}</b>
                  </span>
                </label>
              </li>
            </ul>

            <h3 class="cart__title">Оплата</h3>

            <ul name="list" class="cart__options options">
              <transition-group name="list">
                <li class="options__item" v-for="pay in payments" :key="pay.id">
                  <label class="options__label">
                    <input
                      class="options__radio sr-only"
                      type="radio"
                      name="pay"
                      checked=""
                      :value="pay.id"
                      v-model="pickedPaymentId"
                    />
                    <span class="options__value"> {{ pay.title }} </span>
                  </label>
                </li>
              </transition-group>
            </ul>
          </div>
        </div>

        <transition name="mode-fade" mode="out-in">
          <base-preloader key="one" v-if="orderSending" />

          <cart-order-block
            :items="items"
            :deliveryPrice="deliveryPrice"
            :countProducts="countProducts"
            :totalPrice="totalPrice"
            v-else
          >
            <button class="cart__button button button--primery" type="submit">
              Оформить заказ
            </button>
          </cart-order-block>
        </transition>

        <transition name="mode-fade">
          <div class="cart__error form__error-block" v-if="formErrorMessage">
            <h4>Заявка не отправлена!</h4>
            <p>
              Похоже произошла ошибка. Попробуйте отправить снова или
              перезагрузите страницу.
            </p>
            <p>{{ formErrorMessage }}</p>
          </div>
        </transition>
      </form>
    </section>
  </main>
</template>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(50px);
}
.list-move {
  transition: transform 0.4s ease;
}

.mode-fade-enter-active,
.mode-fade-leave-active {
  transition: opacity 0.3s ease;
}
.mode-fade-enter-from,
.mode-fade-leave-to {
  opacity: 0;
}
</style>
