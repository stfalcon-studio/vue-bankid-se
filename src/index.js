export default {
  name: "BankidButton",

  props: {
    requestSession: {
      type: Function,
      required: true
    },
    requestToken: {
      type: Function,
      required: true
    }
  },

  data: () => ({
    orderRef: "",
    autoStartToken: ""
  }),

  async created() {
    const url = new URL(location.href);
    const ref = url.searchParams.get("orderRef");

    if (ref) {
      try {
        await this.requestSession(ref);
      } catch (ex) {
        // eslint-disable-next-line
        console.error(ex);
      }
    } else {
      this.getRef();
    }
  },

  methods: {
    async getRef() {
      try {
        const { orderRef, autoStartToken } = this.requestToken();
        this.orderRef = orderRef;
        this.autoStartToken = autoStartToken;
      } catch (ex) {
        // eslint-disable-next-line
        console.error(ex);
      }
    },
    handleClick() {
      window.location.href = `https://app.bankid.com/?autostarttoken=${
        this.autoStartToken
      }&redirect=${location.href}?orderRef=${this.orderRef}`;
    }
  },

  render(h) {
    return h(
      "button",
      {
        on: {
          click: this.handleClick
        }
      },
      [this.$slots.default]
    );
  }
};
