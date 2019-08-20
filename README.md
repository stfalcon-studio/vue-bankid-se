# VUE-BANKID-SE

Component, which allows to simply implement swedish bankId at vue. It integrates with mobile app:
- if vue app is openned on mobile, then performes redirect to mobile BankId app by clicking on vue-bank-se component. And when user authenticates, mobile app redirects back and vue component requires session from the server.
- if vue app is openned on desktop, then showes QR code by clicking on vue-bank-se component. After that user can scan code with mobile bankId app and authenticate. Simultaniously the vue app requests session with some interval

## Installing

```shell
npm i @stfalcon/vue-bank-id-se
```

## Interface for use

It receives a component (in default slot) as an actor.

It receives a component as wrapper for showing QR-code in scoped slot `qrDialog`. This scoped slot returns `imgUrl`(base64 image to insert into `img` tag), `countdownTime`(time is left to close dialog) and `closeDialog`(function which you can call to close the dialog)

`requestToken: () => Promise<{ autoStartToken<string>, orderRef<string> }>` - required. Initialize BankId session at server.

`requestSesstion: ({ orderRef<string> }) => Promise<any>` - required. Requires session from server by `orderRef`. If you want that dialog will be closed automatically then requestSesstion should return any defined value.

`tryCount: Number` - optional(default 10), is used only for desktop. Number of tries to require `requestSesstion`

`qrDuration: Number` - optional(default 50), is used only for desktop. Full duration of showing QR-code.

_Note_: If you specify `tryCount = 2`, `qrDuration = 30` - it means that that QR popup will be shown within 30 seconds and it will make two requests to server: first at 15sec and second at 30sec.

## Example of usage

```html
<template>
  <BankIdLogin
    :request-session="onLogin"
    :request-token="startBankIdSession"
    :try-count="2"
    :qr-duration="30"
  >
    <button type="primary">
      Login with BankId
    </button>

    <template v-slot:qrDialog="props">
      <QrDialog v-bind="props"/>
    </template>
  </BankIdLogin>
</template>

<script>
import BankIdLogin from '@stfalcon/vue-bank-id-se';
import QrDialog from '@/components/MyDialog';

export default {
  name: 'Auth',
  components: { BankIdLogin, QrDialog },
  methods: {
    ...mapActions('auth', ['login', 'startBankIdSession']),
    async onLogin(ref) {
      await this.login(ref);
      this.$router.push('/registration');
    },
  },
};
</script>
```
