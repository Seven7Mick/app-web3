<template>
  <div class="primary">
    <div class="primary__template template">
      <nuxt />
    </div>
    <base-modal-container />
    <loader-screen />
  </div>
</template>
<script>
export default {
};
</script>
<style lang="scss" scoped>
.primary {
  height: 100vh;
  overflow-y: auto;
  &__template {
    height: 100%;
  }
}

.template {
  height: 100%;
  min-height: 100vh;
  overflow: auto;
  &__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
  }
}
</style>
