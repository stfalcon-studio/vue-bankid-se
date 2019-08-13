<template>
  <div class="qr-wrapper">
    <div
      class="qr-background"
      @click="closeDialog()"
    />
    <div class="qr-dialog">
      <img
        src="./close.svg"
        alt="close"
        class="qr-close-icon"
        @click="closeDialog()"
      >
      <div>{{ countdownTime }}</div>
      <img :src="imgUrl">
    </div>
  </div>
</template>

<script>
export default {
  name: 'DefaultPopup',

  props: {
    imgUrl: {
      type: String,
      required: true,
    },
    countdownTime: {
      type: String,
      required: true,
    },
    closeDialog: {
      type: Function,
      required: true,
    }
  },
}
</script>

<style lang="scss" scoped>
.qr-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.qr-background {
  position: fixed;
  overflow-y: scroll;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0,0,0,0.4);
}

.qr-close-icon {
  position: absolute;
  width: 10%;
  right: 10px;
}

.qr-dialog {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  background: white;
  padding: 10px;
  border-radius: 10px;
}
</style>
