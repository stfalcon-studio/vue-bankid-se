import ActorMixin from './strategy-mixin';

export default {
  name: 'Redirect',

  mixins: [ActorMixin],

  created() {
    const url = new URL(location.href);
    const ref = url.searchParams.get('orderRef');

    if (ref) {
      this.requestSession(ref);
    }
  },

  methods: {
    generateUrl({ autoStartToken: tk, orderRef: oref }) {
      // const loc = location.href;
      // return `bankid:///?autostarttoken=${tk}&redirect=${loc}?orderRef=${oref}`;
      return `bankid:///?autostarttoken=${tk}&redirect=null`;
    },

    performActorForUrl(url) {
      window.location.href = url;
    }
  },
}