import MainPage from '@/pages/MainPage';
import ProductPage from '@/pages/ProductPage';
import { createRouter, createWebHashHistory } from 'vue-router';
import CartPage from '@/pages/CartPage';
import NotFoundPage from '@/pages/NotFoundPage';
import OrderPage from '@/pages/OrderPage';
import { MAIN_PAGE_TITLE, CART_PAGE_TITLE, PUBLIC_PATH } from '@/constants';
import OrderInfoPage from '@/pages/OrderInfoPage';

const routes = [
  {
    path: '/',
    name: 'main',
    component: MainPage,
    meta: { title: MAIN_PAGE_TITLE },
  },
  {
    path: '/category/:id',
    name: 'category',
    component: MainPage,
    meta: { title: MAIN_PAGE_TITLE },
  },
  {
    path: '/product/:id',
    name: 'product',
    component: ProductPage,
  },
  {
    path: '/cart/',
    name: 'cart',
    component: CartPage,
    meta: { title: CART_PAGE_TITLE },
  },
  {
    path: '/order/',
    name: 'order',
    component: OrderPage,
    meta: { title: 'Оформление заказа' },
  },
  {
    path: '/order/:id',
    name: 'orderInfo',
    component: OrderInfoPage,
    meta: { title: 'Заказ оформлен' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    component: NotFoundPage,
    meta: { title: 'Not found' },
  },
];

const router = createRouter({
  routes,
  history: createWebHashHistory(PUBLIC_PATH),
});

router.beforeEach((to, from, next) => {
  to.path = PUBLIC_PATH + to.path;
  document.title = to.meta.title || MAIN_PAGE_TITLE;
  next();
});

export default router;
