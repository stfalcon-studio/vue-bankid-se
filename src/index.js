import isMobileOfTablet from './device-type';
import QrCode from './QrCodeStrategy';
import Redirect from './RedirectStrategy';

const sec = 1000;

export default {
  name: 'BankidButton',

  props: {
    requestSession: {
      type: Function,
      required: true
    },
    requestToken: {
      type: Function,
      required: true
    },
    tryCount: {
      type: Number,
      default: 10,
    },
    qrDuration: {
      type: Number,
      default: 50,
    },
  },

  data: () => ({
    isMobile: false,
  }),

  computed: {
    RegistrationComponent() {
      return this.isMobile ? Redirect : QrCode;
    },
    qrDurationSec() {
      return this.qrDuration * sec;
    },
  },

  async created() {
    this.isMobile = isMobileOfTablet();
  },

  render(h) {
    return h(
      'component',
      {
        is: this.RegistrationComponent,
        props: {
          requestToken: this.requestToken,
          requestSession: this.requestSession,
          tryCount: this.tryCount,
          qrDuration: this.qrDurationSec,
        },
        scopedSlots: {
          qrDialog: this.$scopedSlots.qrDialog,
        },
      },
      [this.$slots.default]
    );
  }
};
