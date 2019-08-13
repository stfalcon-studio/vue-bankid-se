import StrategyMixin from './strategy-mixin';
import QrCodeGenerator from './QrCodeGenerator';
import DefaultPopup from './DefaultPopup';

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
    intervalId: null,
  }),

  computed: {
    tryAfter() {
      return this.qrDuration / this.tryCount;
    },
    qrDialog() {
      return this.$scopedSlots.qrDialog
        ? this.$scopedSlots.qrDialog
        : (props) => this.$createElement(DefaultPopup, { props })
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

      this.intervalId = setInterval(async() => {
        if (attempt > tryCount || !this.showQrCode || success) {
          this.setActorState(false)
          return null;
        }

        const resp = await this.requestSession(this.urlData.orderRef);

        if (resp) {
          success = true;
          this.setActorState(false)
          return null;
        } else {
          console.warn(`Error to require session from bankId, attempt #${attempt} from ${tryCount}`);
        }

        ++attempt;
      }, this.tryAfter);
    },

    setActorState(state) {
      this.showQrCode = state;
      clearInterval(this.intervalId);
    },

    getBankIdAuthActor() {
      return this.showQrCode
        ? this.$createElement(QrCodeGenerator, {
          props: {
            strToShow: this.url,
            visible: this.showQrCode,
            countdown: this.qrDuration,
          },
          scopedSlots: {
            qrDialog: this.qrDialog,
          },
          on: {
            'update:visible': this.setActorState,
          },
        })
        : '';
    },
  },
}
