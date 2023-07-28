<script>
export default {
  props: {
    modelValue: {
      type: Number,
      required: true,
    },
    count: {
      type: Number,
      required: true,
    },
    perPage: {
      type: Number,
      required: true,
    },
  },

  computed: {
    pages() {
      return Math.ceil(this.count / this.perPage);
    },
    page() {
      return this.modelValue;
    },
  },

  methods: {
    paginate(page) {
      if (page > 0 && page <= this.pages) {
        this.$emit('update:modelValue', page);
      }
    },
  },
};
</script>

<template>
  <ul class="catalog__pagination pagination">
    <li class="pagination__item">
      <a
        href="#"
        class="pagination__link pagination__link--arrow"
        :class="{ 'pagination__link--disabled': page === 1 }"
        @click.prevent="paginate(page - 1)"
        aria-label="Предыдущая страница"
      >
        <svg width="8" height="14" fill="currentColor">
          <use xlink:href="#icon-arrow-left"></use>
        </svg>
      </a>
    </li>

    <li class="pagination__item" v-for="pageNumber in pages" :key="pageNumber">
      <a
        href="#"
        class="pagination__link"
        :class="{ 'pagination__link--current': pageNumber === page }"
        @click.prevent="paginate(pageNumber)"
      >
        {{ pageNumber }}
      </a>
    </li>

    <li class="pagination__item">
      <a
        href="#"
        class="pagination__link pagination__link--arrow"
        :class="{ 'pagination__link--disabled': page === pages }"
        @click.prevent="paginate(page + 1)"
        aria-label="Следующая страница"
      >
        <svg width="8" height="14" fill="currentColor">
          <use xlink:href="#icon-arrow-right"></use>
        </svg>
      </a>
    </li>
  </ul>
</template>
