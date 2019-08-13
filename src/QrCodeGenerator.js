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
  },

  render(h) {
    return this.$scopedSlots.qrDialog({
      imgUrl: this.imgUrl,
      countdownTime: this.countdownTime,
      closeDialog: this.closeDialog,
    });
  }
}