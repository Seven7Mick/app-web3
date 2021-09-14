<template>
  <div class="example">
    <validation-observer ref="validObserver">
      <div class="example__content">
        <div class="example__connect">
          <base-btn
            class="example__connect-btn"
            :disabled="isConnected"
            @click="connectWallet"
          >
            {{ buttonConnectName }}
          </base-btn>
        </div>
        <div class="example__amount">
          <label
            for="amount"
            class="example__amount-label"
          >Amount</label>
          <validation-provider
            v-slot="{ errors }"
            class="example__amount-field"
            tag="div"
            :rules="{ required: true }"
            name="amount"
          >
            <input
              id="amount"
              v-model="amount"
              class="example__amount-input"
              type="number"
              placeholder="0.0"
            >
            <select
              id="token"
              v-model="tokenSymbol"
              :disabled="!tokens.length"
              value="Select"
              class="example__amount-select"
            >
              <option
                v-if="!tokens.length"
              >
                Select
              </option>
              <option
                v-for="(item, i) of tokens"
                v-else
                :key="i"
                :value="item.symbol"
              >
                {{ item.symbol }}
              </option>
            </select>
            <p class="example__error">
              {{ errors[0] }}
            </p>
          </validation-provider>
        </div>
        <validation-provider
          v-slot="{ errors }"
          class="example__address"
          tag="div"
          :rules="{required: true, min: 42}"
          name="address"
        >
          <label
            for="address"
            class="example__address-label"
          >Address (recipient)</label>
          <input
            id="address"
            v-model="recipientAddress"
            class="example__address-input"
            type="text"
            placeholder="address"
          >
          <p class="example__error">
            {{ errors[0] }}
          </p>
        </validation-provider>
        <div class="example__balance">
          <span class="example__balance-label">Your balance:</span>
          <span class="example__balance-price">{{ nativeBalance }} {{ currentSymbol }}</span>
        </div>
        <div class="example__allowance">
          <span class="example__allowance-label">Your allowance:</span>
          <span class="example__allowance-price">{{ allowance }}</span>
        </div>
        <div class="btn-field">
          <base-btn
            class="btn-field__button"
            :disabled="buttonState"
            @click="getAllowance"
          >
            Get allowance
          </base-btn>
          <base-btn
            class="btn-field__button"
            :disabled="buttonState"
            @click="handlerApprove"
          >
            Approve
          </base-btn>
          <base-btn
            class="btn-field__button"
            :disabled="buttonState"
            @click="handlerTransfer"
          >
            Transfer
          </base-btn>
        </div>

        <div class="transactions">
          <h3 class="transactions__label">
            Your transactions
          </h3>

          <ul class="transactions__items">
            <li
              v-for="(item, i) of transactions"
              :key="i"
              class="transactions__item"
            >
              <div>
                <p>Type</p>
                <span>{{ item.type }}</span>
              </div>
              <div>
                <p>From</p>
                <span>{{ item.from }}</span>
              </div>
              <div>
                <p>To</p>
                <span>{{ item.to }}</span>
              </div>
              <div>
                <p>Amount</p>
                <span>{{ item.amount }} {{ item.token.symbol }}</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </validation-observer>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
import modals from '@/store/modals/modals';

export default {
  data: () => ({
    amount: '',
    tokenSymbol: 'Select',
    recipientAddress: '',
  }),
  computed: {
    ...mapGetters({
      isConnected: 'web3/getIsConnected',
      userAddress: 'web3/getUserAddress',
      tokens: 'web3/getTokens',
      nativeBalance: 'web3/getNativeBalance',
      allowance: 'web3/getAllowance',
      transactions: 'web3/getTransactions',
    }),
    buttonConnectName() {
      if (!this.isConnected) {
        return 'Connect Wallet';
      }
      const address = `${this.userAddress}`;
      return `${address.substring(0, 5)}..${address.substring(35)}`;
    },
    currentSymbol() {
      return this.tokenSymbol !== 'Select' ? this.tokenSymbol : '';
    },
    buttonState() {
      return !this.recipientAddress || !this.amount;
    },
  },
  watch: {
    tokens: {
      handler(val) {
        this.tokenSymbol = val[0].symbol;
      },
    },
    tokenSymbol: {
      handler(val) {
        this.fetchCurrentBalance(val);
      },
    },
  },
  mounted() {
  },
  methods: {
    ...mapActions({
      fetchCurrentBalance: 'web3/fetchCurrentBalance',
      fetchCurrentAllowance: 'web3/fetchCurrentAllowance',
      transfer: 'web3/transfer',
      approve: 'web3/approve',
      showModal: 'modals/show',
    }),

    connectWallet() {
      this.showModal({
        key: modals.connectWallet,
      });
    },

    async getAllowance() {
      if (!this.isConnected) return;
      await this.fetchCurrentAllowance({
        symbol: this.tokenSymbol,
        recipientAddress: this.recipientAddress,
      });
    },

    async handlerApprove() {
      this.SetLoader(true);
      await this.approve({
        symbol: this.tokenSymbol,
        recipientAddress: this.recipientAddress,
        amount: +this.amount,
      });
      this.SetLoader(false);
    },

    async handlerTransfer() {
      this.SetLoader(true);
      await this.transfer({
        symbol: this.tokenSymbol,
        recipientAddress: this.recipientAddress,
        amount: +this.amount,
      });
      this.SetLoader(false);
    },
  },

};
</script>

<style lang="scss" scoped>
.example {
  min-height: 100vh;
  max-width: 100%;
  background: #dbdfe3;
  &__content {
    max-width: 1260px;
    margin: 0 auto;
    padding: 40px 20px;
  }
  &__connect {
    margin-bottom: 30px;
  }
  &__connect-btn {
    max-width: max-content;
    margin-left: auto;
  }
  &__amount {
    margin-bottom: 30px;
  }

  &__amount-field {
    position: relative;
    display: flex;
    justify-content: space-between;
    width: 100%;
  }

  &__amount-label {
    display: inline-block;
  }

  &__amount-input {
    display: block;
    width: 100%;
    height: 70px;
    margin-right: 30px;
    padding: 0 20px;
    border: none;
    border-radius: 5px;
    background: #F3F5FA;
  }

  &__error {
    font-size: 14px;
    color: rgba(216, 38, 38, 0.945);
    position: absolute;
    bottom: -20px;
    left: 20px;
  }

  &__amount-select {
    font-size: 16px;
    font-weight: 600;
    max-width: 145px;
    width: 100%;
    text-align: center;
    background-color: #63BCD8;
    color: #fff;

    &:disabled {
      background-color: rgba(18,37,43,0.70588);
    }
  }

  &__address {
    position: relative;
    margin-bottom: 50px;
  }

  &__address-label {
    display: inline-block;
  }

  &__address-input {
    display: block;
    width: 100%;
    height: 70px;
    padding: 0 20px;
    border: none;
    border-radius: 5px;
    background: #F3F5FA;
  }

  &__balance {
    margin-bottom: 30px;
  }

  &__balance-label {
    max-width: 300px;
    margin-right: 20px;
  }

  &__balance-price {
    max-width: 300px;
    margin-right: 20px;
  }

  &__allowance {
    margin-bottom: 30px;
  }

  &__allowance-label {
    max-width: 300px;
    margin-right: 20px;
  }

  &__allowance-price {
    max-width: 300px;
    margin-right: 20px;
  }

  .btn-field {
    display: flex;
    margin-bottom: 30px;

    &__button {
      max-width: 200px;

      &:not(:last-child){
        margin-right: 20px;
      }
    }
  }

  .transactions {

    &__label {
      margin-bottom: 20px;
    }

    &__item {
      width: 100%;
      display: grid;
      grid-template-columns: 150px 1fr 1fr 200px;
      column-gap: 10px;
      background-color: #F3F5FA;
      padding: 10px;

      &:not(:last-child) {
        margin-bottom: 15px;
      }
    }
  }

  @include _1199 {
    &__title {
      font-size: 40px;
    }
  }
  @include _767 {
    &__title {
      font-size: 30px;
    }
  }
  @include _575 {
    &__title {
      font-size: 18px;
    }
  }
}
</style>
