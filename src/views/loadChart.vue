<template>
  <div class="glocom-main d-flex" id="work-container">
    <notifications group="foo" />
    <!-- <call-options ></call-options> -->
    <slideout-panel></slideout-panel>
    <aside class="glocom-main__aside">
      <div class="glocom-main__aside__content box-card">
        <div class="glocom-main__aside__content--search">
          <input
            type="text"
            class="form-control"
            placeholder="Search Components.."
          />
        </div>
        <hr />
        <div class="glocom-main__aside__content__components">
          <!-- <p>Messaging</p> -->
          <div class="item mt-2">
            <div
              class="glocom-main__aside__content__components--purple initiate-call "
              id="initCall"
            >
              <span><i class="fa fa-phone"></i> Initiat Call</span>
            </div>
          </div>
          <div class="item mt-2">
            <div
              class="glocom-main__aside__content__components--blue playAudio"
              id="playAudio"
            >
              <span><i class="fa fa-play"></i> Play Audio</span>
            </div>
          </div>
          <div class="item mt-2">
            <div
              class="glocom-main__aside__content__components--yellow playAudio"
              id="ivr"
            >
              <span><i class="fa fa-braille"></i>IVR Menu</span>
            </div>
          </div>
          <button class="btn btn-success d-block text-center mt-2" id="save">
            Save
          </button>
          <button class="btn btn-success d-block text-center mt-2" id="clear">
            Clear
          </button>
          <button class="btn btn-success d-block text-center mt-2" id="load">
            Load
          </button>
        </div>
      </div>
    </aside>
    <main class="glocom-main__workplace w-100">
      <div class="glocom-main__workplace--board workplace " id="workplace">
        <div
          v-for="block in blocks"
          v-bind:style="{ top: block.top, left: block.left }"
          v-html="block.html"
          :id="block.id"
          v-bind:key="block.id"
          class="chart-item node"
        ></div>
      </div>
    </main>
  </div>
</template>
<script>
import Vue from "vue";
import Notifications from "vue-notification";
import VueSweetalert2 from "vue-sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
Vue.use(VueSweetalert2);
import { mapGetters } from "vuex";
import initCallOptions from "@/components/initCallOptions";
Vue.component("call-options", initCallOptions);
import audioOptions from "@/components/audioOptions";
Vue.component("audio-options", audioOptions);
import IVROptions from "@/components/ivrOptions";
Vue.component("ivr-options", IVROptions);
import axios from "axios";
Vue.use(Notifications);
import { v4 as uuidv4 } from "uuid";
export default {
  name: "call-flow",
  data() {
    return {
      callerID: null,
      calleeID: null,
      soundName: null,
      soundURL: null,
      selectedBlock: {},
      blocks: [],
      top: null,
      left: null,
      options: {},
      connectorPaintStyle: {
        strokeWidth: 1,
        stroke: "#111",
        joinstyle: "square",
        outlineStroke: "white",
        outlineWidth: 1
      },
      connectorHoverStyle: {
        strokeWidth: 3,
        stroke: "#111",
        outlineWidth: 5,
        outlineStroke: "white"
      },
      endpointHoverStyle: {
        fill: "#111",
        stroke: "#111"
      },
      sourceEndpoint: {
        endpoint: "Rectangle",
        paintStyle: {
          stroke: "#111",
          fill: "transparent",
          radius: 10,
          strokeWidth: 1
        },
        maxConnections: -1,
        dragOptions: {
          hoverClass: "hover",
          activeClass: "sourceActive"
        },
        isSource: true,
        isTarget: false,
        connector: [
          "Flowchart",
          {
            stub: [40, 10],
            gap: 1,
            cornerRadius: 5,
            alwaysRespectStubs: true
          }
        ],
        connectorStyle: this.connectorPaintStyle,
        hoverPaintStyle: this.endpointHoverStyle,
        connectorHoverStyle: this.connectorHoverStyle
      },
      targetEndpoint: {
        endpoint: "Dot",
        paintStyle: {
          fill: "transparent",
          radius: 0
        },
        hoverPaintStyle: this.endpointHoverStyle,
        maxConnections: -1,
        dropOptions: {
          hoverClass: "hover",
          activeClass: "active"
        },
        isTarget: true,
        isSource: false,
        cssClass: "arrowdown",
        overlays: [
          [
            "Label",
            {
              location: [0.5, -0.5],
              label: "Drop",
              cssClass: "endpointTargetLabel",
              visible: false
            }
          ]
        ]
      }
    };
  },
  // components: {
  //   initCallOptions
  // },
  computed: {
    ...mapGetters(["currentNode"])
  },
  watch: {
    currentNode(val) {
      if (val.audioID && val.currentBlockID) {
        var conn = jsPlumb.getConnections({
          source: val.currentBlockID,
          target: val.audioID
        });
        if (conn[0]) {
          jsPlumb.deleteConnection(conn[0]);
        }
      }
    }
  },
  methods: {
    addStart() {
      let html = `
          <div class="start-call">
            <div class="start-call__header d-flex justify-content-between align-content-center">
              <div><i class="fa fa-circle"></i> Start</div>
            </div>
            <div class="start-call__body">
              PHLO Execution will start from this node
            </div>
            <div class="start-call__footer d-flex justify-content-between">
              <div>Incoming SMS</div>
              <div>Incoming Call</div>
              <div>API Request</div>
            </div>
          </div>
        `;
      this.addBlock(html, "start", 20 + "px", 20 + "px", "start");
    },
    computeStyles() {
      this.blocks.forEach(block => {
        block.top = window.getComputedStyle(
          document.getElementById(block.id)
        ).top;
        block.left = window.getComputedStyle(
          document.getElementById(block.id)
        ).left;
      });
    },
    addEndpoints(id, sourceAnchors, targetAnchors) {
      this.selectedBlock = this.blocks.find(block => {
        return block.id === id;
      });
      for (var i = 0; i < sourceAnchors.length; i++) {
        var sourceUUID = id + sourceAnchors[i];
        let s0 = jsPlumb.addEndpoint(id, this.sourceEndpoint, {
          anchor: sourceAnchors[i],
          uuid: sourceUUID
        });
      }
      for (var j = 0; j < targetAnchors.length; j++) {
        var targetUUID = id + targetAnchors[j];
        jsPlumb.addEndpoint(id, this.targetEndpoint, {
          anchor: targetAnchors[j],
          // anchor: 'Continuous',
          uuid: targetUUID
        });
      }
      var self = this;
      jsPlumb.bind("beforeDetach", function(connInfo, originalEvent) {
        let selectedBlock = self.blocks.find(block => {
          return block.id === connInfo.sourceId;
        });
        let selectedOption = selectedBlock.options.selectedNumbers.find(
          block => {
            return block.audioID == connInfo.targetId;
          }
        );
        if (selectedOption) {
          selectedBlock.options.selectedNumbers.splice(
            selectedBlock.options.selectedNumbers.indexOf(selectedOption),
            1
          );
        }
      });
      jsPlumb.bind("beforeDrop", function(connInfo, originalEvent) {
        String.prototype.includes = function(...args) {
          return (
            args.filter(str => this.indexOf(str) > -1).length === args.length
          );
        };
        if (
          connInfo.connection.endpoints[0].getUuid().includes("start") &&
          connInfo.dropEndpoint.getUuid().includes("playaudio")
        ) {
          Vue.notify({
            group: "foo",
            text: "Oops, something went wrong!",
            type: "error"
          });
          jsPlumb.deleteConnection(connInfo.connection);
        } else if (
          connInfo.connection.endpoints[0]
            .getUuid()
            .includes("start", "BottomCenter") &&
          connInfo.dropEndpoint.getUuid().includes("initcall")
        ) {
          Vue.notify({
            group: "foo",
            text: "Oops, something went wrong!",
            type: "error"
          });
          jsPlumb.deleteConnection(connInfo.connection);
        } else if (
          connInfo.connection.endpoints[0]
            .getUuid()
            .includes("start", "BottomLeft") &&
          connInfo.dropEndpoint.getUuid().includes("initcall")
        ) {
          Vue.notify({
            group: "foo",
            text: "Oops, something went wrong!",
            type: "error"
          });
          jsPlumb.deleteConnection(connInfo.connection);
        } else if (
          connInfo.connection.endpoints[0]
            .getUuid()
            .includes("initcall", "BottomRight") &&
          connInfo.dropEndpoint.getUuid().includes("playaudio")
        ) {
          Vue.notify({
            group: "foo",
            text: "Oops, something went wrong!",
            type: "error"
          });
          jsPlumb.deleteConnection(connInfo.connection);
        } else if (connInfo.connection.endpoints[0].getUuid().includes("ivr")) {
          Vue.notify({
            group: "foo",
            text: "Please connect nodes to IVR from Side Panel",
            type: "error"
          });
          jsPlumb.deleteConnection(connInfo.connection);
        } else if (
          connInfo.connection.endpoints[0]
            .getUuid()
            .includes("start", "BottomRight") &&
          connInfo.dropEndpoint.getUuid().includes("initcall")
        ) {
          init(connInfo.connection);
        } else {
          init(connInfo.connection);
        }
      });
    },
    deleteBlock(id) {
      let toDelete = this.blocks.find(block => {
        return block.id === id;
      });
      this.blocks.splice(this.blocks.indexOf(toDelete), 1);
      jsPlumb.remove($("#" + id));
    },
    showCallPanel(id) {
      this.selectedBlock = this.blocks.find(block => {
        return block.id === id;
      });
      const panel = this.$showPanel({
        component: "call-options",
        cssClass: "options",
        openOn: "right",
        width: "400",
        sync: true,
        keepAlive: false,
        disableBgClick: true,
        props: {
          callerID: this.selectedBlock.options.callerID,
          calleeID: this.selectedBlock.options.calleeID,
          nodeName: this.selectedBlock.options.nodeName
        }
      });
      panel.promise.then(result => {
        this.selectedBlock.options = {
          callerID: result.callerID,
          calleeID: result.calleeID,
          nodeName: result.nodeName
        };
      });
    },
    showAudioPanel(id) {
      this.selectedBlock = this.blocks.find(block => {
        return block.id === id;
      });
      const panel = this.$showPanel({
        component: "audio-options",
        cssClass: "audioOptions",
        openOn: "right",
        width: "400",
        sync: true,
        keepAlive: false,
        disableBgClick: true,
        props: {
          soundName: this.selectedBlock.options.soundName,
          soundURL: this.selectedBlock.options.soundURL,
          nodeName: this.selectedBlock.options.nodeName
        }
      });
      panel.promise.then(result => {
        this.selectedBlock.options = {
          soundName: result.soundName,
          soundURL: result.soundURL,
          nodeName: result.nodeName
        };
      });
    },
    showIVRPanel(id) {
      this.selectedBlock = this.blocks.find(block => {
        return block.id === id;
      });
      var filteredArray = this.blocks.filter(function(block) {
        return (
          block.id.includes("playaudio") ||
          block.id.includes("ivr") ||
          block.id.includes("initcall")
        );
      });
      filteredArray.splice(filteredArray.indexOf(this.selectedBlock), 1);
      const panel = this.$showPanel({
        component: "ivr-options",
        cssClass: "ivrOptions",
        openOn: "right",
        width: "400",
        sync: true,
        keepAlive: true,
        disableBgClick: true,
        props: {
          blocks: filteredArray,
          selectedNodes: this.selectedBlock.options.selectedNumbers,
          nodeName: this.selectedBlock.options.nodeName,
          currentBlock: this.selectedBlock
        }
      });
      panel.promise.then(result => {
        this.selectedBlock.options = {
          selectedNumbers: result.selectedNumbers,
          nodeName: result.nodeName
        };
        result.selectedNumbers.forEach(node => {
          var arr = jsPlumb.select({
            source: this.selectedBlock.id,
            target: node.audioID
          });
          if (arr.length == 0) {
            jsPlumb.connect({
              uuids: [
                `${this.selectedBlock.id}BottomCenter`,
                `${node.audioID}TopCenter`
              ]
            });
          }
        });
      });
    },
    reAddEndpoints(id) {
      this.blocks.find(block => {
        if (block.id.includes("initcall")) {
          this.addEndpoints(
            block.id,
            ["BottomRight", "BottomLeft"],
            ["TopCenter"]
          );
        }
        if (block.id.includes("playaudio")) {
          this.addEndpoints(block.id, [], ["TopCenter"]);
        }
        if (block.id.includes("ivr")) {
          this.addEndpoints(block.id, ["BottomCenter"], ["TopCenter"]);
        }
        if (block.id === "start") {
          this.addEndpoints(
            block.id,
            ["BottomRight", "BottomCenter", "BottomLeft"],
            []
          );
        }
      });
    },
    addBlock(html, id, top, left, type, options = null) {
      if (type === "call") {
        this.options = {
          callerID: null,
          calleeID: null,
          nodeName: null
        };
      } else if (type === "audio") {
        this.options = {
          sound: null
        };
      } else if (type === "ivr") {
        this.options = {
          selectedNumbers: [],
          nodeName: null
        };
      }
      if (options) {
        this.options = options;
      }
      this.blocks.push({
        id: id,
        left: left,
        top: top,
        width: parseInt($("#" + id).css("width"), 10),
        heigth: parseInt($("#" + id).css("heigth"), 10),
        html: html,
        type: type,
        options: this.options
      });
    }
  },
  mounted() {
    var self = this;
    if (localStorage.getItem("reloaded")) {
      localStorage.removeItem("reloaded");
    } else {
      localStorage.setItem("reloaded", "1");
      location.reload();
    }
    jsPlumb.ready(function() {
      let instance = jsPlumb.getInstance({
        DragOptions: {
          cursor: "pointer",
          zIndex: 2000
        },
        Container: "workplace"
      });
      jsPlumb.batch(function() {
        jsPlumb.bind("click", function(conn, originalEvent) {
          if (
            confirm(
              "Delete connection from " +
                conn.sourceId +
                " to " +
                conn.targetId +
                "?"
            )
          )
            jsPlumb.deleteConnection(conn);
          conn.toggleType("basic");
        });
        $(document).on("click", ".remove", function(e) {
          Vue.swal({
            title: "Are you sure?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
          }).then(result => {
            if (result.value) {
              Vue.swal("Deleted!", " ", "success");
              let parentID = e.currentTarget.id.substring(7);
              self.deleteBlock(parentID);
              jsPlumb.remove($("#" + parentID));
            } else {
              return false;
            }
          });
        });
      });
      self.addStart();
      self.$nextTick(function() {
        jsPlumb.draggable($("#start"));
        self.addEndpoints(
          "start",
          ["BottomRight", "BottomCenter", "BottomLeft"],
          []
        );
      });
      $(".initiate-call").draggable({
        scope: "plant",
        helper: "clone",
        containment: $("#work-container")
      });
      $(".playAudio").draggable({
        scope: "plant",
        helper: "clone",
        containment: $("#work-container")
      });
      $(".ivr").draggable({
        scope: "plant",
        helper: "clone",
        containment: $("#work-container")
      });
      $("#workplace").droppable({
        scope: "plant",
        drop: function(ev, ui) {
          // Detect if initiate call is dropped
          if (ui.draggable[0].id == "initCall") {
            let id = "initcall" + uuidv4();
            let html = `
                <div  class="init-call ">
                  <div class="init-call__header d-flex justify-content-between align-content-center">
                    <div><i class="fa fa-circle"></i> Initiate Call </div>
                    <a class="remove" id="remove-${id}"><i style="position: relative;top: 4px;" class="fa fa-times-circle "></i></a>
                  </div>
                  <div class="init-call__body">
                      Initiate a call to a list of phone numbers or endpoints
                  </div>
                  <div class="init-call__footer d-flex justify-content-between">
                    <div>Answered</div>
                    <div>Faild</div>
                  </div>
                  </div>
                `;
            var top = ui.position.top - 20 + "px";
            var left = ui.position.left - 200 + "px";
            this.top = top;
            this.left = left;
            self.addBlock(html, id, top, left, "call");
            self.$nextTick(function() {
              self.addEndpoints(
                id,
                ["BottomRight", "BottomLeft"],
                ["TopCenter"]
              );
              jsPlumb.draggable(id, {
                grid: [1, 1]
              });
              $("#" + id).dblclick(function() {
                self.showCallPanel(id);
              });
              $("#" + id).trigger("dblclick");
            });
          }
          // Play Audio
          if (ui.draggable[0].id == "playAudio") {
            let id = "playaudio" + uuidv4();
            let html = `
                <div class="play-audio ">
                  <div class="play-audio__header d-flex justify-content-between align-content-center">
                    <div><i class="fa fa-circle"></i> Play Audio </div>
                   <a class="remove" id="remove-${id}"> <i style="position: relative;top: 4px;" class="fa fa-times-circle "></i></a>
                  </div>
                  <div class="play-audio__body">
                      Initiate a call to a list of phone numbers or endpoints
                  </div>
                </div>
                `;
            // $(this).append(html);
            var top = ui.position.top - 20 + "px";
            var left = ui.position.left - 200 + "px";
            this.top = top;
            this.left = left;
            self.addBlock(html, id, top, left, "audio");
            self.$nextTick(function() {
              self.addEndpoints(id, [], ["TopCenter"]);
              jsPlumb.draggable(id, {
                grid: [1, 1]
              });
              $("#" + id).dblclick(function() {
                self.showAudioPanel(id);
              });
              $("#" + id).trigger("dblclick");
            });
          }
          if (ui.draggable[0].id == "ivr") {
            let id = "ivr" + uuidv4();
            let html = `
                <div class="ivr ">
                  <div class="ivr__header d-flex justify-content-between align-content-center">
                    <div><i class="fa fa-circle"></i> IVR Menu </div>
                   <a class="remove" id="remove-${id}"> <i style="position: relative;top: 4px;" class="fa fa-times-circle "></i></a>
                  </div>
                  <div class="ivr__body">
                      Initiate a call to a list of phone numbers or endpoints
                  </div>
                </div>
                `;
            // $(this).append(html);
            var top = ui.position.top - 20 + "px";
            var left = ui.position.left - 200 + "px";
            this.top = top;
            this.left = left;
            self.addBlock(html, id, top, left, "ivr");
            self.$nextTick(function() {
              self.addEndpoints(id, ["BottomCenter"], ["TopCenter"]);
              jsPlumb.draggable(id, {
                grid: [1, 1]
              });
              $("#" + id).dblclick(function() {
                self.showIVRPanel(id);
              });
              $("#" + id).trigger("dblclick");
            });
          }
        }
      });
      jsPlumb.fire("jsPlumbDemoLoaded", instance);
      (function(jsPlumbInstance) {
        self.$nextTick(function() {
          jsPlumb.load = function(options, plumbInstance) {
            if (!options || !options.savedObj || !options.containerSelector) {
              return;
            }
            var conn = options.savedObj;
            plumbInstance = plumbInstance || jsPlumb;
            var blocks = conn.blocks;
            // for (var i = 0 ; i < blocks.length; i++) {
            blocks.forEach(function(o) {
              self.addBlock(o.html, o.id, o.top, o.left, o.type, o.options);
              self.$nextTick(function() {
                if (o.id.includes("initcall")) {
                  $("#" + o.id).dblclick(function() {
                    self.showCallPanel(o.id);
                  });
                  self.addEndpoints(
                    o.id,
                    ["BottomRight", "BottomLeft"],
                    ["TopCenter"]
                  );
                }
                if (o.id.includes("playaudio")) {
                  $("#" + o.id).dblclick(function() {
                    self.showAudioPanel(o.id);
                  });
                  self.addEndpoints(o.id, [], ["TopCenter"]);
                }
                if (o.id.includes("ivr")) {
                  $("#" + o.id).dblclick(function() {
                    self.showIVRPanel(o.id);
                  });
                  self.addEndpoints(o.id, ["BottomCenter"], ["TopCenter"]);
                }
                if (o.id === "start") {
                  self.addEndpoints(
                    o.id,
                    ["BottomRight", "BottomCenter", "BottomLeft"],
                    []
                  );
                }
              });
            });
            self.$nextTick(function() {
              jsPlumb.draggable($(".node"), {
                drag: function() {}
              });
            });
            // }
            self.$nextTick(function() {
              var connections = conn.connections;
              for (var i = 0; i < connections.length; i++) {
                var connection1 = jsPlumb.connect({
                  source: connections[i].sourceId,
                  target: connections[i].targetId,
                  anchors: (function() {
                    var temp = [];
                    connections[i].anchors.forEach(function(anc) {
                      if (anc.type) {
                        temp.push(anc.type);
                      } else {
                        var x = anc.x;
                        var y = anc.y;
                        var arr = [x, y]
                          .concat(anc.orientation)
                          .concat(anc.offset);
                        temp.push(arr);
                      }
                    });
                    return temp;
                  })(),
                  paintStyle: connections[i].paintStyle,
                  hoverPaintStyle: connections[i].hoverPaintStyle,
                  endpointStyles: connections[i].endpointStyle,
                  endpoints: connections[i].endpoint,
                  connector: [
                    connections[i].connectorType,
                    connections[i].connectorAttr
                  ],
                  labelStyle: {
                    cssClass: connections[i].labelClassName
                  }
                });
                connections[i].overlays.forEach(function(overlay) {
                  connection1.addOverlay([overlay.type, overlay]);
                });
                // connection1.bind("click", function (conn) {
                //   if (confirm("Delete connection from " + conn.sourceId + " to " + conn.targetId + "?"))
                //     jsPlumb.deleteConnection(conn);
                //   conn.toggleType("basic");
                // });
              }
            });
          };
          jsPlumb.save = function(options, plumbInstance) {
            if (!options || !options.selector) {
              return {};
            }
            plumbInstance = plumbInstance || jsPlumb;
            var connection;
            connection = jsPlumb.getAllConnections();
            var connections = [];
            $.each(jsPlumb.getAllConnections(), function(idx, connection) {
              var id = connection.sourceId;
              var endpoints = jsPlumb.getEndpoints(connection.sourceId);
              var connector = connection.getConnector();
              var type = connector.type;
              var attrs = {};
              switch (type) {
                case "Bezier":
                  attrs["curviness"] = connector.getCurviness();
                  break;
                case "Straight": {
                  break;
                }
                case "Flowchart ": {
                  break;
                }
                case "State Machine": {
                  attrs["curviness"] = connector.getCurviness();
                  break;
                }
              }
              var endpointArray = [];
              connection.endpoints.forEach(function(endpoint) {
                var options = {};
                if (endpoint.type == "Image") {
                  options.url = endpoint.canvas.src;
                  options.anchor = endpoint.anchor;
                  endpointArray.push([endpoint.type, options]);
                } else {
                  options.anchor = endpoint.anchor;
                  endpointArray.push([endpoint.type, options]);
                }
              });
              connections.push({
                // path: connector.getPath(),
                // segment: connector.getSegments(),
                connectorType: type,
                connectorAttr: attrs,
                connectionId: connection.id,
                sourceId: connection.sourceId,
                targetId: connection.targetId,
                sourceEndpointUuid: connection.endpoints[0].getUuid(),
                targetEndpointUuid: connection.endpoints[1].getUuid(),
                paintStyle: connection.getPaintStyle(),
                endpointStyle: (function() {
                  var temp = [];
                  connection.endpoints.forEach(function(endpoint) {
                    temp.push(endpoint.getPaintStyle());
                  });
                  return temp;
                })(),
                hoverPaintStyle: connection.getHoverPaintStyle(),
                endpoint: endpointArray,
                anchors: (function() {
                  var temp = [];
                  connection.endpoints.forEach(function(endpoint) {
                    var tempObj = {
                      uuid: endpoint.getUuid(),
                      x: endpoint.anchor.x,
                      y: endpoint.anchor.y,
                      orientation: endpoint.anchor.orientation,
                      offset: endpoint.anchor.offsets,
                      parameters: endpoint.getParameters(),
                      type: endpoint.anchor.type
                    };
                    temp.push(tempObj);
                  });
                  return temp;
                })(),
                labelText: connection.getLabel(),
                overlays: $.map(connection.getOverlays(), function(overlay) {
                  var temp = new Array();
                  var obj = {};
                  for (var key in overlay) {
                    if (
                      typeof overlay[key] !== "function" &&
                      typeof overlay[key] !== "object" &&
                      typeof overlay[key] != "undefined"
                    ) {
                      if (key == "loc") {
                        obj["location"] = overlay[key];
                      } else {
                        obj[key] = overlay[key];
                      }
                    }
                  }
                  obj["cssClass"] = overlay.canvas.className;
                  temp.push(obj);
                  return temp;
                })
              });
            });
            var obj = {
              selector: options.selector,
              connections: connections,
              blocks: self.blocks
            };
            return obj;
          };
        });
      })(jsPlumb);
      $("#save").on("click", function() {
        self.computeStyles();
        var obj = jsPlumb.save({
          selector: ".node"
        });
        console.log(JSON.stringify(obj));
      });
      $("#load").on("click", function() {
        jsPlumb.reset();
        self.blocks = [];
        //Clear DOM
        $("#workplace").empty();
        axios
          .get("static/json/data.json")
          .then(function(response) {
            jsPlumb.load({
              savedObj: JSON.parse(JSON.stringify(response.data)),
              containerSelector: "#workplace"
            });
          })
          .catch(function(error) {
            // handle error
            console.log(error);
          });
        jsPlumb.bind("click", function(conn, originalEvent) {
          if (
            confirm(
              "Delete connection from " +
                conn.sourceId +
                " to " +
                conn.targetId +
                "?"
            )
          )
            jsPlumb.deleteConnection(conn);
          conn.toggleType("basic");
        });
      });
    });
  }
};
</script>
<style lang="scss">
.jtk-endpoint-connected:not(.arrowdown) {
  background-color: #000;
}
.glocom-main {
  height: 100vh;
  &__aside {
    background-color: #f5f7fa;
    padding: 15px;
    width: 250px;
    &__content {
      &--search {
        input {
          border: 0;
          font-size: 12px;
        }
      }
      &__components {
        p {
          margin-bottom: 0;
        }
        &--blue {
          border: 1px solid #5dbcd2;
          display: block !important;
          text-align: left;
          padding: 7px 20px;
          background-color: #fff;
          i {
            color: #5dbcd2;
            margin-right: 10px;
          }
        }
        &--purple {
          border: 1px solid #b56adf;
          display: block !important;
          text-align: left;
          padding: 7px 20px;
          background-color: #fff;
          i {
            color: #b56adf;
            margin-right: 10px;
          }
        }
        &--yellow {
          border: 1px solid #f9c662;
          display: block !important;
          text-align: left;
          padding: 7px 20px;
          background-color: #fff;
          i {
            color: #f9c662;
            margin-right: 10px;
          }
        }
      }
    }
  }
}
.playAudio,
.initiate-call {
  cursor: pointer;
}
.jtk-endpoint {
  z-index: auto !important;
}
.start-call {
  width: 275px;
  border: 1px solid #53c251;
  border-radius: 4px;
  &__header {
    color: #53c251;
    border-bottom: 1px solid #53c251;
    padding: 5px 15px;
    text-align: left;
  }
  &__body {
    color: rgba(52, 58, 64, 0.5);
    font-size: 13px;
    padding: 10px 15px;
    height: 80px;
    background-color: #fff;
  }
  &__footer {
    font-size: 12px;
    border-top: 1px solid #ddd;
    padding: 0 15px;
    height: 30px;
    line-height: 30px;
    div:nth-child(1) {
      border-right: 1px solid #ddd;
      padding-right: 5px;
    }
    div:nth-child(3) {
      border-left: 1px solid #ddd;
      padding-left: 5px;
    }
  }
}
.init-call {
  width: 275px;
  border: 1px solid #b56adf;
  border-radius: 4px;
  &__header {
    color: #b56adf;
    border-bottom: 1px solid #b56adf;
    padding: 5px 15px;
    text-align: left;
    background-color: #fff;
  }
  &__body {
    color: rgba(52, 58, 64, 0.5);
    font-size: 13px;
    padding: 10px 15px;
    height: 80px;
    background-color: #fff;
  }
  &__footer {
    font-size: 12px;
    border-top: 1px solid #ddd;
    padding: 0 15px;
    height: 30px;
    line-height: 30px;
    background-color: #fff;
    div:nth-child(1) {
      border-right: 1px solid #ddd;
      padding-right: 5px;
    }
    div:nth-child(3) {
      border-left: 1px solid #ddd;
      padding-left: 5px;
    }
  }
}
.play-audio {
  width: 275px;
  border: 1px solid #5dbcd2;
  border-radius: 4px;
  &__header {
    color: #5dbcd2;
    border-bottom: 1px solid #5dbcd2;
    padding: 5px 15px;
    text-align: left;
    background: #fff;
  }
  &__body {
    color: rgba(52, 58, 64, 0.5);
    font-size: 13px;
    padding: 10px 15px;
    height: 80px;
    background-color: #fff;
  }
  &__footer {
    font-size: 12px;
    border-top: 1px solid #ddd;
    padding: 0 15px;
    height: 30px;
    line-height: 30px;
    background-color: #fff;
    div:nth-child(1) {
      border-right: 1px solid #ddd;
      padding-right: 5px;
    }
    div:nth-child(3) {
      border-left: 1px solid #ddd;
      padding-left: 5px;
    }
  }
}
.ivr {
  width: 275px;
  border: 1px solid #f9c662;
  border-radius: 4px;
  &__header {
    color: #f9c662;
    border-bottom: 1px solid #f9c662;
    padding: 5px 15px;
    text-align: left;
    background: #fff;
  }
  &__body {
    color: rgba(52, 58, 64, 0.5);
    font-size: 13px;
    padding: 10px 15px;
    height: 80px;
    background-color: #fff;
  }
  &__footer {
    font-size: 12px;
    border-top: 1px solid #ddd;
    padding: 0 15px;
    height: 30px;
    line-height: 30px;
    background-color: #fff;
    div:nth-child(1) {
      border-right: 1px solid #ddd;
      padding-right: 5px;
    }
    div:nth-child(3) {
      border-left: 1px solid #ddd;
      padding-left: 5px;
    }
  }
}
.remove {
  cursor: pointer;
}
.arrowdown {
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 13px solid #3b3c3a;
  display: inline-block;
  position: absolute;
  z-index: auto;
  top: 1px;
  svg {
    opacity: 0;
  }
}
.jtk-endpoint-anchor {
  cursor: -webkit-grab;
}
.workplace {
  width: 100%;
  height: 100%;
  position: relative;
  background-image: radial-gradient(
    circle at 1px 1px,
    rgba(0, 0, 0, 0.058823529411764705) 1px,
    transparent 0
  );
  background-size: 17px 17px;
}
</style>
