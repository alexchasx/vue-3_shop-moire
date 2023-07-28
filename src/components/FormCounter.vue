<script>
export default {
  props: {
    wrapCssClass: {
      type: String,
      default: '',
    },
    itemCount: {
      type: Number,
      default: 1,
    },
  },

  data() {
    return {
      amount: 1,
    };
  },

  emits: ['updateInput'],

  watch: {
    amount(value) {
      if (value < 1) {
        this.amount = 1;
      }
    },
  },

  created() {
    this.amount = this.itemCount;
  },

  methods: {
    updateInput(value) {
      if (value < 1) {
        value = 1;
      }
      this.$emit('updateInput', value);
    },

    deleteOne() {
      this.updateInput(--this.amount);
    },

    addOne() {
      this.updateInput(++this.amount);
    },
  },
};
</script>

<template>
  <div class="form__counter" :class="wrapCssClass">
    <button type="button" aria-label="Убрать один товар" @click="deleteOne">
      <svg width="12" height="12" fill="currentColor">
        <use xlink:href="#icon-minus"></use>
      </svg>
    </button>

    <input
      type="text"
      name="count"
      :value="amount"
      @input="updateInput($event.target.value)"
    />

    <button type="button" aria-label="Добавить один товар" @click="addOne">
      <svg width="12" height="12" fill="currentColor">
        <use xlink:href="#icon-plus"></use>
      </svg>
    </button>
  </div>
</template>
