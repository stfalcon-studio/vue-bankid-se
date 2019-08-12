<template>
  <div class="qr-wrapper">
    <div
      class="qr-background"
      @click="closeDialog"
    />
    <div class="qr-dialog">
      <img
        src="./close.svg"
        alt="close"
        class="qr-close-icon"
        @click="closeDialog"
      >
      <div>{{ countdownTime }}</div>
      <img :src="imgUrl">
    </div>
  </div>
</template>

<script>
import qrcode from 'qrcode/build/qrcode';

export default {
  name: 'QrCodeComponent',

  props: {
    strToShow: {
      type: String,
      required: true,
    },
    visible: {
      type: Boolean,
      required: true,
    },
    countdown: {
      type: Number,
      required: true,
    }
  },

  data: () => ({
    imgUrl: '',
    countdownTime: '00:00',
  }),

  created() {
    qrcode.toDataURL(this.strToShow, (error, url) => {
      if (error) {
        throw error;
      }

      this.imgUrl = url;
    });

    this.countdownTime = this.getFormatedTimeFrom(this.countdown);

  },

  methods: {
    getFormatedTimeFrom(duration) {
      let min = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
      let sec = Math.floor((duration % (1000 * 60)) / 1000);

      min = min < 0 ? `0` : min;
      sec = sec < 0 ? `0` : sec;

      min = min < 10 ? `0${min}` : min;
      sec = sec < 10 ? `0${sec}` : sec;

      return `${min}:${sec}`;
    },
    closeDialog() {
      this.$emit('update:visible', false);
    },
  },

  mounted() {
    let timeToLeft = this.countdown;
    const intervalId = setInterval(() => {
      timeToLeft = timeToLeft - (1 * 1000);
      this.countdownTime = this.getFormatedTimeFrom(timeToLeft);

      if (timeToLeft < 0) {
        clearInterval(intervalId);
        this.closeDialog();
      }
    }, 1000)
  }
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
