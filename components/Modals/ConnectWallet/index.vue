<template>
  <base-modal-box
    class="wallet"
    :title="'Connect to a wallet'"
  >
    <div class="wallet__content">
      <button
        class="wallet__btn"
        @click="handleConnectWallet"
      >
        <img
          :src="require(`@/assets/img/metamask.svg`)"
          alt="metamask"
        >
      </button>
    </div>
  </base-modal-box>
</template>

<script lang="ts">
import { mapGetters, mapActions } from 'vuex';
import BaseModalBox from '@/components/BaseModalBox/index.vue';
import tokensAddress from '@/config/index';

export default ({
  components: {
    'base-modal-box': BaseModalBox,
  },
  data: () => ({
  }),
  computed: {
    ...mapGetters({
      isConnected: 'web3/getIsConnected',
    }),
  },
  methods: {
    ...mapActions({
      connectWallet: 'web3/connectWallet',
      close: 'modals/hide',
      fetchToken: 'web3/fetchToken',
      fetchTransaction: 'web3/fetchTransaction',
    }),
    async handleConnectWallet() {
      this.SetLoader(true);
      this.CloseModal();
      await this.connectWallet();
      if (this.isConnected) {
        await Promise.all(tokensAddress.map((item) => this.fetchToken(item)));
        await Promise.all(tokensAddress.map((item) => this.fetchTransaction(item)));
      }
      this.SetLoader(false);
    },
  },
});
</script>
<style lang="scss" scoped>
.wallet::v-deep {
  .base-modal__content {
    padding: 0;
  }
}
.wallet {
  &__btn {
    align-items: center;
  }
  &__content {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    background-color: #f3f3f3;
    width: 100%;
    height: 218px;
  }
}
</style>
