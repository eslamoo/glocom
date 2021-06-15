<template>
  <div class="call-panel ">
    <div class="call-panel__header d-flex justify-content-between ">
      <div class="call-panel__header--title">
        <h5 v-bind="$attrs.nodeUUID">IVR Menu</h5>
      </div>
      <button class="close-panel" @click="closePanelWithOutAction">
        <i class="fa fa-times"></i>
      </button>
    </div>
    <div class="call-panel__form">
      <form @submit.prevent="closePanel">
        <div class="form-group">
          <label for="nodeName">Node Name</label>
          <input
            type="text"
            required
            v-model="name"
            class="form-control"
            id="nodeName"
          />
        </div>
        <p>Allowed Inputs</p>
        <div style="display:flex; flex-wrap: wrap;width: 180px;">
          <div
            style="text-align:center"
            v-for="(num, i) in dialPad"
            :key="i"
            class="dial ml-1"
          >
            <button
              :class="{ active: num.active }"
              @click.prevent="pushAction(num)"
            >
              {{ num.num }}
            </button>
          </div>
        </div>
        <!-- {num: 1 , audioID: dddd} -->
        <div v-for="(action, i) in selectedNumbers" :key="i">
          <div class="form-group">
            <label>Click #{{ action.num }}</label>
            <select
              required
              v-model="selectedNumbers[i].audioID"
              class="form-control"
            >
              <option disabled value="">Select Audio Node Name</option>
              <option v-for="(block, i) in blocks" :key="i" :value="block.id">{{
                block.options.nodeName
              }}</option>
            </select>
          </div>
        </div>

        <button class="btn btn-info">Save</button>
      </form>
    </div>
  </div>
</template>
<script>
export default {
  props: ["nodeUUID", "blocks", "selectedNodes", "nodeName"],
  name: "ivr-options",
  data() {
    return {
      name: "",
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
      selectedNumbers: [],
      sound: {
        soundName: null,
        soundURL: null
      }
    };
  },
  created() {
    this.name = this.nodeName;
    if (Array.isArray(this.selectedNodes) && this.selectedNodes.length) {
      this.selectedNumbers = this.selectedNodes;
      this.selectedNumbers.forEach(block => {
        this.dialPad.forEach(num => {
          if (block.num == num.num) {
            num.active = true;
          }
        });
      });
    }
  },
  methods: {
    pushAction(num) {
      num.active = !num.active;
      if (num.active) {
        this.selectedNumbers.push({ num: num.num, audioID: "" });
      } else {
        let toDelete = this.selectedNumbers.find(block => {
          return block.num === num.num;
        });
        this.selectedNumbers.splice(this.selectedNumbers.indexOf(toDelete), 1);
      }
    },
    closePanelWithOutAction() {
      this.$emit("closePanel");
    },
    closePanel() {
      if (!this.name) {
        alert("Please fill all inputs");
      } else {
        this.$emit("closePanel", {
          selectedNumbers: this.selectedNumbers,
          dialStat: this.dialPad,
          nodeName: this.name
        });
      }
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
