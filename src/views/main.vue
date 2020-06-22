<template>
  <div class="glocom-main d-flex" id="work-container">
    <notifications group="foo" />
   
    <aside class="glocom-main__aside">
      <div class="glocom-main__aside__content box-card">
        <div class="glocom-main__aside__content--search">
          <input type="text" class="form-control" placeholder="Search Components..">
        </div>
        <hr>
        <div class="glocom-main__aside__content__components">
          <!-- <p>Messaging</p> -->

          <div class="item mt-2">
            <div class="glocom-main__aside__content__components--purple initiate-call" id="initCall">
              <span><i class="fa fa-phone"></i> Initiat Call</span>
            </div>
          </div>
          <div class="item mt-2">
            <div class="glocom-main__aside__content__components--blue playAudio" id="playAudio">
              <span><i class="fa fa-play"></i> Play Audio</span>
            </div>
          </div>
           <button class="btn btn-success d-block text-center mt-2" id="save">Save</button>
        </div>
      </div>
    </aside>
    <main class="glocom-main__workplace w-100">
      <div class="glocom-main__workplace--board workplace " id="workplace">
        <div class="start-call chart-item position-absolute node" id="start">
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
      </div>
    </main>
  </div>
</template>
<script>
  import Vue from 'vue'
  import Notifications from 'vue-notification'
  import VueSweetalert2 from 'vue-sweetalert2';
  import 'sweetalert2/dist/sweetalert2.min.css';
  Vue.use(VueSweetalert2);
  /*
  or for SSR:
  import Notifications from 'vue-notification/dist/ssr.js'
  */
  Vue.use(Notifications)
  import {
    v4 as uuidv4
  } from 'uuid';
  export default {
    name: "DragToWorkplace",
    data() {
      return {
        list: ["circle", "diamond", "ellipse", "rectangle"],
        uuid: uuidv4()
      };
    },
    mounted() {
      jsPlumb.ready(function () {
        let instance = jsPlumb.getInstance({
          // drag options
          DragOptions: {
            cursor: "pointer",
            zIndex: 2000
          },
          // overlays
          ConnectionOverlays: [
            // [
            //   "Arrow",
            //   {
            //     location: 1,
            //     visible: true,
            //     width: 11,
            //     height: 30,
            //     id: "Arrow"
            //   }
            // ],
            // [
            //   "Label",
            //   {
            //     location: 2,
            //     id: "Label",
            //     cssClass: "arrow-label",
            //     events: {
            //       tap() {
            //         console.log("Label");
            //       }
            //     }
            //   }
            // ]
          ],
          Container: "workplace"
        });
        let connectorPaintStyle = {
          strokeWidth: 1,
          stroke: "#111",
          joinstyle: "square",
          outlineStroke: "white",
          outlineWidth: 1,
        };
        let connectorHoverStyle = {
          strokeWidth: 3,
          stroke: "#111",
          outlineWidth: 5,
          outlineStroke: "white"
        };
        let endpointHoverStyle = {
          fill: "#111",
          stroke: "#111"
        };
        // source endpoints
        let sourceEndpoint = {
          endpoint: "Rectangle",
          // anchor: [.8, 1, .1, .1],
          paintStyle: {
            stroke: "#111",
            fill: "transparent",
            radius: 10,
            strokeWidth: 1,
          },
          dragOptions: {
            hoverClass: "hover",
            activeClass: "sourceAvtive"
          },
          // anchor:[ "Perimeter", { shape:"Square" } ],
          isSource: true,
          // isTarget: true,
          // connector: [
          //   "Flowchart",
          //   {
          //     stub: [40, 10],
          //     gap: 1,
          //     cornerRadius: 5,
          //     alwaysRespectStubs: true
          //   }
          // ],
          connectorStyle: connectorPaintStyle,
          hoverPaintStyle: endpointHoverStyle,
          connectorHoverStyle: connectorHoverStyle,
          // overlays: [
          //   [
          //     "Label",
          //     {
          //       location: [0.5, 1.5],
          //       label: "Drag",
          //       cssClass: "endpointSourceLabel",
          //       visible: true
          //     }
          //   ]
          // ]
        };
        // target endpoints
        let targetEndpoint = {
          endpoint: "Dot",
          // anchors: [[.8, 1, .1, .1], [.8, .5, .1, .1]],
          // anchor:[ "Perimeter", { shape:"Square", anchorCount:150 }],
          paintStyle: {
            fill: "#111",
            radius: 0
          },
          hoverPaintStyle: endpointHoverStyle,
          maxConnections: 1,
          dropOptions: {
            hoverClass: "hover",
            activeClass: "active"
          },
          isTarget: true,
          cssClass: "arrowdown",
          overlays: [
            [
              "Label",
              {
                location: [0.5, -0.5],
                label: "Drop",
                cssClass: "endpointTargetLabel",
                visible: false,
              }
            ]
          ]
        };

        let init = function (connection) {
          // console.log(connection);
          connection.getOverlay("label").setLabel("123");
        };
        let addEndpoints = function (toId, sourceAnchors, targetAnchors) {
          // console.log(toId, sourceAnchors, targetAnchors);
          for (var i = 0; i < sourceAnchors.length; i++) {
            var sourceUUID = toId + sourceAnchors[i];
            let s0 = instance.addEndpoint(toId, sourceEndpoint, {
              anchor: sourceAnchors[i],
              uuid: sourceUUID,
            });
          }
          for (var j = 0; j < targetAnchors.length; j++) {
            var targetUUID = toId + targetAnchors[j];
            instance.addEndpoint(toId, targetEndpoint, {
              anchor: targetAnchors[j],
              // anchor: 'Continuous',
              uuid: targetUUID
            });
          }
          instance.bind("beforeDrop", function (connInfo, originalEvent) {
            String.prototype.includes = function (...args) {
              return args.filter(str => this.indexOf(str) > -1).length === args.length;
            };
            console.log(connInfo.connection.endpoints[0].getUuid() + ' --> ' + connInfo.dropEndpoint
            .getUuid());

            if (connInfo.connection.endpoints[0].getUuid().includes("start") && connInfo.dropEndpoint
              .getUuid().includes("playaudio")) {
              Vue.notify({
                group: 'foo',
                // title: 'Important message',
                text: 'Oops, something went wrong!',
                type: 'error'
              })
              instance.deleteConnection(connInfo.connection)
            } else if (connInfo.connection.endpoints[0].getUuid().includes("start", "BottomCenter") &&
              connInfo.dropEndpoint.getUuid().includes("initcall")) {
              Vue.notify({
                group: 'foo',
                // title: 'Important message',
                text: 'Oops, something went wrong!',
                type: 'error'
              })
              instance.deleteConnection(connInfo.connection)
            } else if (connInfo.connection.endpoints[0].getUuid().includes("start", "BottomLeft") && connInfo
              .dropEndpoint.getUuid().includes("initcall")) {
              Vue.notify({
                group: 'foo',
                // title: 'Important message',
                text: 'Oops, something went wrong!',
                type: 'error'
              })
              instance.deleteConnection(connInfo.connection)
            } else if (connInfo.connection.endpoints[0].getUuid().includes("initcall", "BottomRight") &&
              connInfo
              .dropEndpoint.getUuid().includes("playaudio")) {
              Vue.notify({
                group: 'foo',
                // title: 'Important message',
                text: 'Oops, something went wrong!',
                type: 'error'
              })
              instance.deleteConnection(connInfo.connection)
            } else if (connInfo.connection.endpoints[0].getUuid().includes("start", "BottomRight") && connInfo
              .dropEndpoint.getUuid().includes("initcall")) {
              init(connInfo.connection);
            } else {
              init(connInfo.connection);

            }
          })
        };

        instance.batch(function () {
          instance.bind("click", function (conn, originalEvent) {
            if (confirm("Delete connection from " + conn.sourceId + " to " + conn.targetId + "?"))
              instance.deleteConnection(conn);
            conn.toggleType("basic");
          });
          $(document).on('click', '.remove', function () {
            Vue.swal({
              title: 'Are you sure?',
              // text: "You won't be able to revert this!",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
              instance.remove($(this).parent().parent());
              if (result.value) {
                Vue.swal(
                  'Deleted!',
                  ' ',
                  'success'
                )
              }
            })

            //other logic goes here...
          });
        });
        instance.draggable($("#start"));
        addEndpoints(
          "start",
          ["BottomRight", "BottomCenter", "BottomLeft"], []
        );
        $(".initiate-call").draggable({
          scope: "plant",
          helper: "clone",
          containment: $("#work-container"),
        });
        $(".playAudio").draggable({
          scope: "plant",
          helper: "clone",
          containment: $("#work-container"),
        });
        $("#workplace").droppable({
          scope: "plant",
          drop: function (ev, ui) {
            ;
            // console.log(ev, ui);
            // Detect if initiate call is dropped 
            if (ui.draggable[0].id == 'initCall') {
              let id = 'initcall' + uuidv4();
              // console.log(id);
              let html = `
                <div id="${id}" class="init-call chart-item node">
                  <div class="init-call__header d-flex justify-content-between align-content-center">
                    <div><i class="fa fa-circle"></i> Initiate Call </div>
                    <a class="remove"><i style="position: relative;top: 4px;" class="fa fa-times-circle "></i></a>
                  </div>
                  <div class="init-call__body">  
                      Initiate a call to a list of phone numbers or endpoints
                  </div>
                  <div class="init-call__footer d-flex justify-content-between">
                    <div>Answered</div>
                    <div>Faild</div>
                  </div>
                </div>`;
              $(this).append(html);
              $("#" + id).css({
                top: ui.position.top - 20 + "px",
                left: ui.position.left - 200 + "px"
              });
              addEndpoints(
                id,
                ["BottomRight", "BottomLeft"], ["TopCenter"]
              );
              instance.draggable(id, {
                grid: [1, 1]
              });
            }
            // Play Audio
            if (ui.draggable[0].id == 'playAudio') {
              let id = 'playaudio' + uuidv4();
              // console.log(id);
              let html = `
                <div id="${id}" class="play-audio chart-item node">
                  <div class="play-audio__header d-flex justify-content-between align-content-center">
                    <div><i class="fa fa-circle"></i> Play Audio </div>
                   <a class="remove"> <i style="position: relative;top: 4px;" class="fa fa-times-circle "></i></a>
                  </div>
                  <div class="play-audio__body">  
                      Initiate a call to a list of phone numbers or endpoints
                  </div>
                </div>`;
              $(this).append(html);
              $("#" + id).css({
                top: ui.position.top - 20 + "px",
                left: ui.position.left - 200 + "px"
              });
              addEndpoints(
                id,
                [], ["TopCenter"]
              );
              instance.draggable(id, {
                grid: [1, 1]
              });
            }
          }
        });
        jsPlumb.fire("jsPlumbDemoLoaded", instance);
//          function Save() {
//     $(".chart-item").resizable("destroy");
//     Objs = [];
//     $('.chart-item').each(function() {
//         Objs.push({id:$(this).attr('id'), html:$(this).html(),left:$(this).css('left'),top:$(this).css('top'),width:$(this).css('width'),height:$(this).css('height')});
//     });
//     console.log(Objs);
// }
$('#save').on('click', function() {
//  console.log(instance.getAllConnections());
       
        var nodes = []

        $(".workplace .node").each(function (idx, elem) {
            var $elem = $(elem);
            var endpoints = instance.getEndpoints($elem.attr('id'));
            nodes.push({
                id: $elem.attr('id'),
                // text: $elem.find($(".node")).text(),
                positionX: parseInt($elem.css("left"), 10),
                positionY: parseInt($elem.css("top"), 10)
            });
        });
        var connections = [];
        $.each(instance.getAllConnections(), function (idx, connection) {
            connections.push({
                connectionId: connection.id,
                sourceId: connection.sourceId,
                targetId: connection.targetId,
                // anchors: $.map(connection.endpoints, function (endpoint) {

                //     return [[endpoint.anchor.x,
                //     endpoint.anchor.y,
                //     endpoint.anchor.orientation[0],
                //     endpoint.anchor.orientation[1],
                //     endpoint.anchor.offsets[0],
                //     endpoint.anchor.offsets[1]]];

                // })
            });
        });

        var flowChart = {};
        flowChart.nodes = nodes;
        flowChart.connections = connections;
        console.log(JSON.stringify(flowChart));
        // console.log(flowChart);
});


      });
    },
    methods: {
      save(){
        this.save();
      }
     
    }
  };

</script>
<style lang="scss">
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
.jtk-endpoint{
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
      color: rgba(52, 58, 64, .5);
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
      color: rgba(52, 58, 64, .5);
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
      color: rgba(52, 58, 64, .5);
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
    cursor: crosshair;
  }

  .workplace {
    width: 100%;
    height: 100%;
    position: relative;
    background-image: radial-gradient(circle at 1px 1px, rgba(0, 0, 0, 0.058823529411764705) 1px, transparent 0);
    background-size: 17px 17px;
  }

</style>
