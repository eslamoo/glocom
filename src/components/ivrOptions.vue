<template>
  <div class="call-panel ">
    <div class="call-panel__header d-flex justify-content-between ">
      <div class="call-panel__header--title">
        <h5 v-bind="$attrs.nodeUUID">IVR Menu</h5>
      </div>
      <button class="close-panel" @click="closePanel">
        <i class="fa fa-times"></i>
      </button>
    </div>
    <div class="call-panel__form">
      <form @submit.prevent="closePanel">
        <div style="display:flex; flex-wrap: wrap;">
          <div
            style="flex: 0 0 33.333333%;text-align:center"
            v-for="(num, i) in dialPad"
            :key="i"
            class="dial"
          >
            <button
              :class="{ active: num.active }"
              @click.prevent="pushAction(num)"
            >
              {{ num.num }}
            </button>
          </div>
        </div>
        <div class="form-group">
          <label for="soundURL">Sound URL</label>
          <input
            type="text"
            v-model="sound.soundURL"
            class="form-control"
            id="soundURL"
          />
        </div>
        <button class="btn btn-info">Save</button>
      </form>
    </div>
  </div>
</template>
<script>
export default {
  props: ["nodeUUID", "soundName", "soundURL"],
  name: "ivr-options",
  data() {
    return {
      dialPad: [
        { num: 1, active: false },
        { num: 2, active: false },
        { num: 3, active: false },
        { num: 4, active: false },
        { num: 5, active: false },
        { num: 6, active: false },
        { num: 7, active: false },
        { num: 8, active: false },
        { num: 9, active: false },
        { num: "#", active: false },
        { num: 0, active: false },
        { num: "*", active: false }
      ],
      isActive: false,
      sound: {
        soundName: null,
        soundURL: null
      }
    };
  },
  created() {
    this.sound.soundName = this.soundName;
    this.sound.soundURL = this.soundURL;
  },
  methods: {
    pushAction(num) {
      this.isActive = !this.isActive;
      console.log(num);
    },
    closePanel() {
      this.$emit("closePanel", this.sound);
    }
  }
};
</script>
<style lang="scss" scoped>
.call-panel {
  .dial {
    button {
      background: #0000;
      border: 1px solid #49a3b8;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      margin-bottom: 10px;
      &.active {
        background: #49a3b8;
        color: #fff;
      }
      &:focus {
        outline: none;
      }
    }
  }
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
