<template>
  <div class="call-panel ">
    <div class="call-panel__header d-flex justify-content-between ">
      <div class="call-panel__header--title">
        <h5 v-bind="$attrs.nodeUUID">Initiate Call</h5>
      </div>
      <button class="close-panel" @click="closePanel">
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
            v-model="callInfo.nodeName"
            class="form-control"
            id="nodeName"
          />
        </div>
        <div class="form-group">
          <label for="calerID">Caller ID</label>
          <input
            type="text"
            v-model="callInfo.callerID"
            class="form-control"
            id="calerID"
          />
        </div>
        <div class="form-group">
          <label for="calleeID">Callee ID</label>
          <input
            type="text"
            v-model="callInfo.calleeID"
            class="form-control"
            id="calleeID"
          />
        </div>
        <button class="btn btn-info">Save</button>
      </form>
    </div>
  </div>
</template>
<script>
// import Vue from 'vue';
// import VueSlideoutPanel from 'vue2-slideout-panel';
// Vue.use(VueSlideoutPanel);
export default {
  props: ["nodeUUID", "callerID", "calleeID", "nodeName"],
  name: "call-options",
  data() {
    return {
      callInfo: {
        callerID: null,
        calleeID: null,
        nodeName: null
      }
    };
  },
  created() {
    this.callInfo.callerID = this.callerID;
    this.callInfo.calleeID = this.calleeID;
    this.callInfo.nodeName = this.nodeName;
  },
  methods: {
    closePanel() {
      if (!this.callInfo.nodeName) {
        alert("Please enter a name to this node");
      } else {
        this.$emit("closePanel", this.callInfo);
      }
    }
  }
};
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
