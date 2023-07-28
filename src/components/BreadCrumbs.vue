<script>
import { MAIN_PAGE_TITLE } from '@/constants';
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    breadCrumbs: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      pageMainTitle: MAIN_PAGE_TITLE
    }
  }
});
</script>

<template>
  <ul class="breadcrumbs">
    <li class="breadcrumbs__item">
      <router-link
        class="breadcrumbs__link"
        :to="{ name: 'main' }"
      >
        {{ pageMainTitle }}
      </router-link>
    </li>

    <li class="breadcrumbs__item" v-for="bc in breadCrumbs" :key="bc.text">
      <router-link
        class="breadcrumbs__link"
        :to="{ name: bc.routeName, params: { id: bc.paramId ?? null } }"
        v-if="bc.routeName"
      >
        {{ bc.text }}
      </router-link>

      <div v-else>{{ bc.text }}</div>
    </li>
  </ul>
</template>
