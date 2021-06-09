<template>
  <div class="call-panel ">
    <div class="call-panel__header d-flex justify-content-between ">
      <div class="call-panel__header--title">
        <h5 v-bind="$attrs.nodeUUID">Play Audio </h5>
      </div>
      <button class="close-panel" @click="closePanel">
        <i class="fa fa-times"></i>
      </button>
    </div>
    <div class="call-panel__form">
      <form @submit.prevent="closePanel">
        <div class="form-group">
          <label for="soundName">Sound Name</label>
          <input type="text" v-model="sound.soundName" class="form-control" id="soundName">
        </div>
        <div class="form-group">
          <label for="soundURL">Sound URL</label>
          <input type="text" v-model="sound.soundURL" class="form-control" id="soundURL">
        </div>
        <button class="btn btn-info">Save</button>
      </form>
    </div>
  </div>
</template>
<script>
  export default {
    props: ['nodeUUID', 'soundName', 'soundURL'],
    name: 'call-options',
    data() {
      return {
        sound: {
          soundName: null,
          soundURL: null,
        }
      }
    },
    created() {
      this.sound.soundName = this.soundName;
      this.sound.soundURL = this.soundURL;
    },
    methods: {
      closePanel() {
        this.$emit("closePanel", this.sound);
      }
    },
  }
</script>
<style lang="scss" scoped>
  .call-panel {
    &__header {
      border-bottom: 1px solid #ddd;
      padding: 12px 20px 10px 20px;
      background: #eee;
      h5 {
        margin-bottom: 0;
      }
      .close-panel {
        background: transparent;
        border: 0;
        &:focus {
          border: 0;
          outline: 0;
        }
      }
    }
    &__form {
      padding: 12px 20px 10px 20px;
    }
  }
</style>