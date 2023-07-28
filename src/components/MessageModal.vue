<script>
export default {
  props: {
    open: { type: Boolean },
  },

  methods: {
    onOutsideClick($event) {
      if (
        $event.target !== this.$refs.content &&
        $event.target.contains(this.$refs.content)
      ) {
        this.doClose();
      }
    },
    doClose() {
      this.$emit('update:open', false);
    },
  },
};
</script>

<template>
  <teleport v-if="open" to="#teleport-target">
    <div class="teleport-blackout"></div>
    <div class="teleport-modal" @click="onOutsideClick">
      <div class="teleport-modal__content" ref="content">
        <div class="cart__error form__error-block add-message">
          <h4><slot></slot></h4>
        </div>
        <button type="button" class="teleport-modal__close" @click="doClose">
          X
        </button>
      </div>
    </div>
  </teleport>
</template>

<style scoped>
.teleport-blackout {
  z-index: 1010;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.75;
  background-color: #000;
}

.teleport-modal {
  z-index: 1010;
  overflow: auto;
  overflow-y: scroll;
  display: flex;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 20px;
}
.teleport-modal__content {
  position: relative;
  max-width: 1000px;
  margin-top: auto;
  margin-bottom: auto;
  padding: 10px;
  background-color: #fff;
}
.teleport-modal__close {
  position: absolute;
  top: 5px;
  right: 5px;
  padding: 10px;
  line-height: 1;
}
</style>
