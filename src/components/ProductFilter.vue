<script>
import axios from 'axios';
import { API_BASE_URL, MAIN_PAGE_TITLE } from '@/constants';

const API_PRODUCT_CATEGORIES = API_BASE_URL + '/api/productCategories';
const API_COLORS = API_BASE_URL + '/api/colors';
const API_MATERIALS = API_BASE_URL + '/api/materials';
const API_SEASONS = API_BASE_URL + '/api/seasons';

const getTitle = (list, id) => {
  let title = '';
  if (id) {
    title = list.find((obj) => {
      return obj.id === id;
    }).title;

    document.title = MAIN_PAGE_TITLE + ' | ' + title;
    return true;
  }
  return false;
};

export default {
  props: {
    priceFrom: {
      type: [Number, String],
      required: true,
    },
    priceTo: {
      type: [Number, String],
      required: true,
    },
    categoryId: {
      type: Number,
      required: true,
    },
    colorIds: {
      type: Array,
      required: true,
    },
    materialIds: {
      type: Array,
      required: true,
    },
    seasonIds: {
      type: Array,
      required: true,
    },
    changePageTitleById: Number,
  },

  data() {
    return {
      isFilterSubmitted: false,
      currentPriceFrom: 0,
      currentPriceTo: 0,
      currentCategoryId: 0,
      currentColorIds: [],
      currentMaterialIds: [],
      currentSeasonIds: [],

      categoriesData: null,
      allColorsData: null,
      allMaterialsData: null,
      allSeasonsData: null,
    };
  },

  computed: {
    categories() {
      const categories = this.categoriesData ? this.categoriesData.items : [];
      return categories;
    },

    allColors() {
      return this.allColorsData ? this.allColorsData.items : [];
    },

    allMaterials() {
      return this.allMaterialsData ? this.allMaterialsData.items : [];
    },

    allSeasons() {
      return this.allSeasonsData ? this.allSeasonsData.items : [];
    },
  },

  created() {
    this.loadCategories();
    this.loadAllColors();
    this.loadAllMaterials();
    this.loadAllSeasons();
  },

  methods: {
    submit() {
      this.isFilterSubmitted = true;
      this.$emit('update:priceFrom', this.currentPriceFrom);
      this.$emit('update:priceTo', this.currentPriceTo);
      this.$emit('update:categoryId', this.currentCategoryId);
      this.$emit('update:colorIds', this.currentColorIds);
      this.$emit('update:materialIds', this.currentMaterialIds);
      this.$emit('update:seasonIds', this.currentSeasonIds);
      getTitle(this.categoriesData.items, this.currentCategoryId);
    },

    reset() {
      this.currentPriceFrom = 0;
      this.currentPriceTo = 0;
      this.currentCategoryId = 0;
      this.currentColorIds = [];
      this.currentMaterialIds = [];
      this.currentSeasonIds = [];
      this.submit();
      this.isFilterSubmitted = false;
      document.title = MAIN_PAGE_TITLE;
    },

    loadCategories() {
      axios.get(API_PRODUCT_CATEGORIES).then((res) => {
        this.categoriesData = res.data;

        if (getTitle(this.categoriesData.items, this.changePageTitleById)) {
          this.currentCategoryId = this.changePageTitleById;
          this.submit();
        }
      });
    },

    loadAllColors() {
      axios.get(API_COLORS).then((res) => {
        this.allColorsData = res.data;
        localStorage.setItem(
          'allColorsData',
          JSON.stringify(this.allColorsData)
        );
      });
    },

    loadAllMaterials() {
      axios.get(API_MATERIALS).then((res) => {
        this.allMaterialsData = res.data;
      });
    },

    loadAllSeasons() {
      axios.get(API_SEASONS).then((res) => {
        this.allSeasonsData = res.data;
      });
    },
  },
};
</script>

<template>
  <aside class="filter">
    <h2 class="filter__title">Фильтры</h2>

    <form
      class="filter__form form"
      action="#"
      method="get"
      @submit.prevent="submit"
    >
      <fieldset class="form__block">
        <legend class="form__legend">Цена</legend>
        <label class="form__label form__label--price">
          <input
            class="form__input"
            type="text"
            name="min-price"
            v-model.number="currentPriceFrom"
          />
          <span class="form__value">От</span>
        </label>
        <label class="form__label form__label--price">
          <input
            class="form__input"
            type="text"
            name="max-price"
            v-model.number="currentPriceTo"
          />
          <span class="form__value">До</span>
        </label>
      </fieldset>

      <fieldset class="form__block">
        <legend class="form__legend">Категория</legend>
        <label class="form__label form__label--select">
          <select
            class="form__select"
            name="category"
            v-model.number="currentCategoryId"
          >
            <option value="0">Все категории</option>
            <option
              :value="category.id"
              v-for="category in categories"
              :key="category.id"
            >
              {{ category.title }}
            </option>
          </select>
        </label>
      </fieldset>

      <fieldset class="form__block">
        <legend class="form__legend">Цвет</legend>
        <ul class="colors">
          <li class="colors__item" v-for="color in allColors" :key="color.id">
            <label class="colors__label" :title="color.title">
              <input
                class="colors__radio sr-only"
                type="checkbox"
                name="selectedColors"
                :value="color.id"
                v-model="currentColorIds"
              />
              <span
                class="colors__value"
                :style="{
                  backgroundColor: color.code,
                  border: '1px solid #999',
                }"
              >
              </span>
            </label>
          </li>
        </ul>
      </fieldset>

      <fieldset class="form__block">
        <legend class="form__legend">Материал</legend>
        <ul class="check-list">
          <li
            class="check-list__item"
            v-for="material in allMaterials"
            :key="material.id"
          >
            <label class="check-list__label" :title="material.title">
              <input
                class="check-list__check sr-only"
                type="checkbox"
                name="material"
                :value="material.id"
                v-model="currentMaterialIds"
              />
              <span class="check-list__desc">
                {{ material.title }}
                <span>({{ material.productsCount }})</span>
              </span>
            </label>
          </li>
        </ul>
      </fieldset>

      <fieldset class="form__block">
        <legend class="form__legend">Коллекция</legend>
        <ul class="check-list">
          <li
            class="check-list__item"
            v-for="season in allSeasons"
            :key="season.id"
          >
            <label class="check-list__label">
              <input
                class="check-list__check sr-only"
                type="checkbox"
                name="collection"
                :value="season.id"
                v-model="currentSeasonIds"
              />
              <span class="check-list__desc">
                {{ season.title }}
                <span>({{ season.productsCount }})</span>
              </span>
            </label>
          </li>
        </ul>
      </fieldset>

      <button class="filter__submit button button--primery" type="submit">
        Применить
      </button>

      <button
        class="filter__reset button button--second"
        type="button"
        @click.prevent="reset"
        v-if="isFilterSubmitted"
      >
        Сбросить
      </button>
    </form>
  </aside>
</template>

<style scoped>
.colors__label:hover .colors__value::before,
.colors__label:focus .colors__value::before,
.colors__radio:checked ~ .colors__value::before {
  border-color: #222;
}
</style>
