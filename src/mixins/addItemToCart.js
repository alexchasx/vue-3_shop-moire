import { getUrlImage } from '@/utils';

export default {
  props: ['title', 'error', 'placeholder', 'value'],

  data() {
    return {
      productAmount: 1,
      productAdded: false,
      productAddSending: false,
      selectedSizeId: 0,
    };
  },

  emits: ['productSending'],

  computed: {
    product() {
      return {
        ...this.productData,
        defaultImage: getUrlImage(this.productData),
      };
    },
  },

  watch: {
    selectedColor(colorObj) {
      if (this.$refs.preview) {
        this.$refs.preview.src = colorObj.gallery[0]?.file?.url;
      }
      this.selectedColorGallery = colorObj.gallery;
    },
  },

  methods: {
    addToCart() {
      this.productAdded = false;
      this.productAddSending = true;
      this.$emit('productSending', this.productAddSending);

      if (this.productAmount > 0) {
        this.addProductToCart({
          productId: this.product.id,
          colorId: this.selectedColor.color.id,
          sizeId: this.selectedSizeId,
          amount: this.productAmount,
        }).then(() => {
          this.productAdded = true;
          this.productAddSending = false;
          this.$emit('productSending', this.productAddSending);

          setTimeout(() => {
            this.productAdded = false;
          }, 1000);
        });
      }
    },
  },
};
