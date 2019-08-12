function throwErrorForNotDefined(fnName) {
  throw new Error(`method "${fnName}" is not defined at "${this.$options.name}" component`);
}

export default {
  props: {
    requestToken: {
      type: Function,
      required: true,
    },
    requestSession: {
      type: Function,
      required: true,
    },
  },

  data: () => ({
    url: '',
    urlData: {},
  }),

  methods: {
    async initBankIdSession() {
      try {
        this.urlData = await this.requestToken();
      } catch (error) {
        console.error(error); // eslint-disable-line
      }
    },
    getBankIdAuthActor() {
      return '';
    },
    onUrlDataChange(value) {
      if (!Object.keys(value).length) {
        return null;
      }

      this.url = this.generateUrl(value);
      this.performActorForUrl(this.url);
    },
    generateUrl() {
      throwErrorForNotDefined.call(this, 'generateUrl');
    },
    performActorForUrl(url) { // eslint-disable-line
      throwErrorForNotDefined.call(this, 'performActorForUrl');
    },
  },

  watch: {
    urlData: {
      handler: 'onUrlDataChange',
      deep: true,
    },
  },

  render(h) {
    return h(
      'div',
      [
        this.getBankIdAuthActor(),
        h('div', { on: { click: this.initBankIdSession } }, [this.$slots.default]),
      ]
    );
  },
}