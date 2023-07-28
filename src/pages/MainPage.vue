<script>
import ProductList from '@/components/ProductList.vue';
import BasePagination from '@/components/BasePagination.vue';
import ProductFilter from '@/components/ProductFilter.vue';
import axios from 'axios';
import { getUrlImage } from '@/utils';
import { defineComponent } from 'vue';
import { API_PRODUCTS, DEFAULT_PER_PAGE } from '@/constants';
import QuantitySwitch from '@/components/QuantitySwitch.vue';
import BasePreloader from '@/components/BasePreloader.vue';

export default defineComponent({
  components: {
    ProductList,
    BasePagination,
    ProductFilter,
    BasePreloader,
    QuantitySwitch,
  },

  data() {
    return {
      filterPriceFrom: 0,
      filterPriceTo: 0,
      filterCategoryId: 0,
      filterColorIds: [],
      filterMaterialIds: [],
      filterSeasonIds: [],
      changePageTitleById: 0,

      page: 1,
      productsPerPage: DEFAULT_PER_PAGE,

      productsData: null,
      categoriesData: null,

      productsLoading: false,
      productsLoadingFailed: false,
      productSending: false,
    };
  },

  emits: ['productSending'],

  computed: {
    products() {
      if (this.productsData) {
        return this.productsData.items.map((product) => {
          return {
            ...product,
            defaultImage: getUrlImage(product),
          };
        });
      }

      return [];
    },

    countProducts() {
      return this.productsData ? this.productsData.pagination.total : 0;
    },
  },

  watch: {
    page() {
      this.loadProducts();
    },

    filterPriceFrom() {
      this.loadProducts();
    },

    filterPriceTo() {
      this.loadProducts();
    },

    filterCategoryId() {
      this.loadProducts();
    },

    filterColorIds() {
      this.loadProducts();
    },

    filterMaterialIds() {
      this.loadProducts();
    },

    filterSeasonIds() {
      this.loadProducts();
    },

    productSending() {
      this.$emit('productSending', this.productSending);
    },
  },

  created() {
    this.doFilterByCategory();
    this.loadProducts();
  },

  methods: {
    loadProducts() {
      this.productsLoading = true;
      this.productsLoadingFailed = false;

      axios
        .get(API_PRODUCTS, {
          params: {
            page: this.page,
            limit: this.productsPerPage,
            minPrice: this.filterPriceFrom,
            maxPrice: this.filterPriceTo,
            categoryId: this.filterCategoryId,
            colorIds: this.filterColorIds,
            materialIds: this.filterMaterialIds,
            seasonIds: this.filterSeasonIds,
          },
        })
        .then((res) => {
          this.productsData = res.data;
        })
        .catch(() => (this.productsLoadingFailed = true))
        .then(() => (this.productsLoading = false));
    },

    doFilterByCategory() {
      const id = +this.$route.params.id;
      if (this.$route.name === 'category') {
        this.filterCategoryId = id;
        this.changePageTitleById = +id;
      }
    },

    changeProductsPerPage(quantity) {
      this.productsPerPage = quantity;
      this.loadProducts();
    },
  },
});
</script>

<template>
  <main class="content container">
    <div class="content__top">
      <div class="content__row">
        <h1 class="content__title">Каталог</h1>
        <span class="content__info">Всего товаров: {{ countProducts }} </span>

        <quantity-switch
          :products-per-page="productsPerPage"
          @changeQuantityPerPage="changeProductsPerPage"
        />
      </div>
    </div>

    <div class="content__catalog">
      <product-filter
        v-model:price-from="filterPriceFrom"
        v-model:price-to="filterPriceTo"
        v-model:category-id="filterCategoryId"
        v-model:color-ids="filterColorIds"
        v-model:material-ids="filterMaterialIds"
        v-model:season-ids="filterSeasonIds"
        v-model:change-page-title-by-id="changePageTitleById"
      />

      <section class="catalog spinner-wrap" v-if="productsLoading">
        <base-preloader class="spinner" />
      </section>

      <section class="catalog error-message spinner-wrap" v-else-if="productsLoadingFailed">
        Произошла ошибка при загрузке товаров
        <button @click.prevent="loadProducts">Попробовать ещё раз</button>
      </section>

      <section class="catalog" v-else>
        <product-list
          :products="products"
          @productSending="productSending = $event"
        />

        <base-pagination v-if="products.length > 0"
          :count="countProducts"
          v-model="page"
          :per-page="productsPerPage"
        />
      </section>
    </div>
  </main>
</template>

<style scoped>
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

.error-message {
  width: 400px;
}
</style>
