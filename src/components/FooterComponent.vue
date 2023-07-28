<script>
export default {
  name: 'FooterComponent',

  data() {
    return {
      socialIcons: [
        {
          title: 'Вконтакте',
          href: '#icon-vk',
          width: 20,
          height: 11,
        },
        {
          title: 'Инстаграм',
          href: '#icon-insta',
          width: 17,
          height: 17,
        },
        {
          title: 'Facebook',
          href: '#icon-facebook',
          width: 17,
          height: 17,
        },
        {
          title: 'Twitter',
          href: '#icon-twitter',
          width: 17,
          height: 14,
        },
        {
          title: 'Telegram',
          href: '#icon-telegram',
          width: 19,
          height: 17,
        },
      ],
    };
  },
};
</script>

<template>
  <footer class="footer container">
    <div class="footer__wrapper">
      <ul class="footer__links">
        <li>
          <router-link class="footer__link" :to="{ name: 'main' }">
            Каталог
          </router-link>
        </li>
        <li>
          <a class="footer__link" href="tel:88006009009"> 8 800 600 90 09 </a>
        </li>
        <li>
          <a class="footer__link" href="mailto:hi@technozavrrr.com">
            hi@technozavrrr.com
          </a>
        </li>
        <li>
          <a class="footer__link" href="#"> Распродажа </a>
        </li>
        <li>
          <a class="footer__link footer__link--medium" href="#">
            Заказать звонок
          </a>
        </li>
      </ul>

      <ul class="footer__social social">
        <li class="social__item" v-for="icon in socialIcons" :key="icon.href">
          <a class="social__link" href="#" :aria-label="icon.title">
            <svg :width="icon.width" :height="icon.height" fill="currentColor">
              <use :xlink:href="icon.href"></use>
            </svg>
          </a>
        </li>
      </ul>

      <p class="footer__desc">
        Все права на&nbsp;материалы, находящиеся на&nbsp;сайте, охраняются
        в&nbsp;соответствии с&nbsp;законодательством&nbsp;РФ, в&nbsp;том числе
        об&nbsp;авторском праве и&nbsp;смежных правах.
      </p>

      <ul class="footer__data">
        <li>
          <a
            class="footer__link"
            href="#"
            target="_blank"
            rel="noopener"
            type="application/pdf"
          >
            Политика конфиденциальности
          </a>
        </li>
        <li>
          <a
            class="footer__link"
            href="#"
            target="_blank"
            rel="noopener"
            type="application/pdf"
          >
            Публичная оферта
          </a>
        </li>
      </ul>

      <span class="footer__copyright"> © 2020 Moire </span>
    </div>
  </footer>
</template>
