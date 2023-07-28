<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ColorsList',

  props: {
    colors: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      colorObj: null,
    };
  },

  emits: ['selectColor'],
});
</script>

<template>
  <ul class="colors colors--black" v-if="colors.length">
    <li
      class="colors__item"
      v-for="colorObj in colors"
      :key="colorObj.color.id"
    >
      <label class="colors__label" :title="colorObj.color.title">
        <input
          class="colors__radio sr-only"
          type="radio"
          name="color"
          :value="colorObj"
          @click="$emit('selectColor', colorObj)"
        />

        <span
          class="colors__value"
          :style="{
            backgroundColor: colorObj.color.code,
            border: '1px solid #999',
          }"
        >
        </span>
      </label>
    </li>
  </ul>
</template>
