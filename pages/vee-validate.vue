<template>
  <validation-observer v-slot="{ handleSubmit }">
    <form
      action=""
      @submit.prevent="handleSubmit(click)"
    >
      <validation-provider
        v-slot="{ errors }"
        name="test value"
        :rules="'required'"
      >
        <input
          v-model="value"
          type="text"
          @keydown.enter="onEnter($event, handleSubmit, click)"
        >
        <div>
          errors: {{ errors }}
        </div>
      </validation-provider>
      <button>
        submit
      </button>
    </form>
  </validation-observer>
</template>
<script>

import modals from '~/store/modals/modals';

export default {
  data: () => ({
    value: '',
  }),
  methods: {
    click() {
      this.ShowModal({
        text: this.value,
      });
    },
    onEnter(e, handler, callback) {
      if (!e.ctrlKey) {
        e.preventDefault();
        handler(callback);
      }
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
