import StrategyMixin from './strategy-mixin';
import QrCodeComponent from './QrCodeComponent';

const sec = 1000;

export default {
  name: 'QrCode',

  mixins: [StrategyMixin],

  props: {
    tryCount: {
      type: Number,
      default: 10,
    },
    qrDuration: {
      type: Number,
      default: 50 * sec,
    }
  },

  data: () =>({
    showQrCode: false,
  }),

  computed: {
    tryAfter() {
      return this.qrDuration / this.tryCount;
    },
  },

  methods: {
    generateUrl() {
      return `bankid:///?autostarttoken=${this.urlData.autoStartToken}`;
    },

    performActorForUrl() {
      this.showQrCode = !this.showQrCode;
      this.requireSessionByInterval(this.tryCount);
    },

    requireSessionByInterval(tryCount) {
      let attempt = 1;
      let success = false;

      const intervalId = setInterval(async() => {
        if (attempt > tryCount || !this.showQrCode || success) {
          this.showQrCode = false;
          return clearInterval(intervalId);
        }

        const resp = await this.requestSession(this.urlData.orderRef);

        if (resp) {
          success = true;
          this.showQrCode = false;
          clearInterval(intervalId);
          return null;
        } else {
          console.warn(`Error to require session from bankId, attempt #${attempt} from ${tryCount}`);
        }

        ++attempt;
      }, this.tryAfter);
    },

    getBankIdAuthActor() {
      return this.showQrCode
        ? this.$createElement(QrCodeComponent, {
          props: {
            strToShow: this.url,
            visible: this.showQrCode,
            countdown: this.qrDuration,
          },
          on: {
            'update:visible': ($event) => this.showQrCode = $event,
          }
        })
        : '';
    },
  },
}
