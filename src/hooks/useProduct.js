import axios from 'axios';
import { API_PRODUCTS } from '@/constants';
import { getItemNumber, getUrlImage } from '@/utils';
import { computed, reactive, ref } from 'vue';

export default function () {
  const productData = ref(null);
  const selectedColor = ref(null);
  const selectedColorGallery = ref(null);
  const selectedSizeId = ref(0);
  const pageTitle = ref(document.title);
  const tabs = ref([
    {
      id: 'info',
      href: '#info',
      title: 'Информация о товаре',
      content: 'Информации нет',
    },
    {
      id: 'delivery',
      href: '#delivery',
      title: 'Доставка и возврат',
      content: 'Описано на странице корзины',
    },
  ]);
  const category = computed(() => {
    return productData.value.category;
  });

  const fillTabsContent = (content) => {
    for (const tab of tabs.value) {
      if (tab.id === 'info' && content) {
        tab.content = content;
        return;
      }
    }
  };

  const itemNumber = ref('');

  const fetchStatus = reactive({
    isLoading: false,
    isFailed: false,
  });
  const fetchProduct = (productId) => {
    fetchStatus.isLoading = true;
    fetchStatus.isFailed = false;
    axios
      .get(API_PRODUCTS + productId)
      .then((res) => {
        productData.value = Object.assign(res.data, {
          defaultImage: getUrlImage(res.data),
        });
        selectedColor.value = productData.value.colors[0];
        selectedColorGallery.value = productData.value.colors[0].gallery;
        selectedSizeId.value = productData.value.sizes[0].id;
        pageTitle.value = productData.value.title;
        document.title = pageTitle.value;
        itemNumber.value = getItemNumber({
          productId: productData.value.id,
          colorId: selectedColor.value.id,
          sizeId: selectedSizeId.value,
        });

        fillTabsContent(productData.value.content);
      })
      .catch(() => {
        fetchStatus.isFailed = true;
      })
      .finally(() => {
        fetchStatus.isLoading = false;
      });
  };

  return {
    product: productData,
    category,
    fetchProduct,
    status: fetchStatus,
    selectedColor,
    selectedColorGallery,
    selectedSizeId,
    pageTitle,
    tabs,
    itemNumber,
  };
}
