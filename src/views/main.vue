<template>
  <div class="glocom-main d-flex"  id="work-container">

    <aside class="glocom-main__aside">
      <div class="glocom-main__aside__content box-card">
        <div class="glocom-main__aside__content--search">
          <input type="text" class="form-control" placeholder="Search Components..">
        </div>
        <hr>
        
        <div class="glocom-main__aside__content__components">
          <p>Messaging</p>
          <div class="item">
            <div class="glocom-main__aside__content__components--blue chart-item" id="call">
              <span><i class="fa fa-envelope"></i> Send SMS</span>
            </div>
          </div>
          <p class="mt-4">Voice</p>
          <div class="item">
            <div class="glocom-main__aside__content__components--purple chart-item">
              <span><i class="fa fa-align-center"></i> IVR Menu</span>
            </div>
          </div>
          <div class="item mt-2">
            <div class="glocom-main__aside__content__components--purple chart-item">
              <span><i class="fa fa-th"></i> Get Input</span>
            </div>
          </div>
          <div class="item mt-2">
            <div class="glocom-main__aside__content__components--purple chart-item">
              <span><i class="fa fa-phone"></i> Initiat Call</span>
            </div>
          </div>
          <div class="item mt-2">
            <div class="glocom-main__aside__content__components--purple chart-item">
              <span><i class="fa fa-phone-square"></i> Call Forward</span>
            </div>
          </div> 
          <div class="item mt-2">
            <div class="glocom-main__aside__content__components--purple chart-item">
              <span><i class="fa fa-ban"></i> Hangup</span>
            </div>
          </div>
          <div class="item mt-2">
            <div class="glocom-main__aside__content__components--purple chart-item">
              <span><i class="fa fa-microphone"></i> Record Audio</span>
            </div>
          </div>
          <div class="item mt-2">
            <div class="glocom-main__aside__content__components--purple chart-item">
              <span><i class="fa fa-users"></i> Multi-Party Call</span>
            </div>
          </div>
          <div class="item mt-2">
            <div class="glocom-main__aside__content__components--purple chart-item">
              <span><i class="fa fa-circle"></i>Conference Bridge</span>
            </div>
          </div>
          <p class="mt-4">Functions</p>
          <div class="item mt-2">
            <div class="glocom-main__aside__content__components--yellow chart-item">
              <span><i class="fa fa-compress"></i>HTTP Request</span>
            </div>
          </div>
          <div class="item mt-2">
            <div class="glocom-main__aside__content__components--yellow chart-item">
              <span><i class="fa fa-list-ol"></i>Counter</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
    <main class="glocom-main__workplace w-100">
      <div class="glocom-main__workplace--board workplace " id="workplace">
     
        <div  class="start-call chart-item position-absolute" id="start">
            <div class="start-call__header d-flex justify-content-between align-content-center">
            
              <div><i class="fa fa-circle"></i> Start</div>
              <i style="position: relative;top: 4px;" class="fa fa-times-circle "></i>
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
export default {
  name: "DragToWorkplace",
  data() {
    return {
      list: ["circle", "diamond", "ellipse", "rectangle"]
    };
  },
  mounted() {
    jsPlumb.ready(function() {
    
      let instance = jsPlumb.getInstance({
        // drag options
        DragOptions: { cursor: "pointer", zIndex: 2000 },
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
        dragOptions: { hoverClass: "hover", activeClass: "sourceAvtive" },
        // anchor:[ "Perimeter", { shape:"Square" } ],
        isSource: true,
        // isTarget: true,
        connector: [
          "Flowchart",
          {
            stub: [40, 10],
            gap: 1,
            cornerRadius: 5,
            alwaysRespectStubs: true
          }
        ],
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
        paintStyle: { fill: "#111", radius: 0 },
        hoverPaintStyle: endpointHoverStyle,
        maxConnections: 1,
        dropOptions: { hoverClass: "hover", activeClass: "active" },
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
      let init = function(connection) {
        console.log(connection);

        // connection.getOverlay("label").setLabel("123");
      };
      let addEndpoints = function(toId, sourceAnchors, targetAnchors) {
        console.log(toId, sourceAnchors, targetAnchors);

        for (var i = 0; i < sourceAnchors.length; i++) {
          var sourceUUID = toId + sourceAnchors[i];
          instance.addEndpoint(toId, sourceEndpoint, {
            anchor: sourceAnchors[i],
            
            uuid: sourceUUID
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
      };

      instance.batch(function() {
      instance.bind("connection", function(connInfo, originalEvent) {
          init(connInfo.connection);
        });


        instance.bind("click", function(conn, originalEvent) {
          if (confirm("Delete connection from " + conn.sourceId + " to " + conn.targetId + "?"))
            instance.detach(conn);
          conn.toggleType("basic");
        });

      });
    instance.draggable($("#start"));
 
    addEndpoints(
            $("#start"),
            ["BottomRight", "BottomCenter", "BottomLeft"], []
          );

      $(".box-card .chart-item").draggable({
        scope: "plant",
        helper: "clone",
        containment: $("#work-container"),
        // cursor : 'pointer',
        // tolerance : 'fit',
        // revert : true,
        
      });
      $("#workplace").droppable({
        scope: "plant",
        
        drop: function(ev, ui) {
          console.log(ev, ui);

          let id = "glocom" + new Date().getTime();

          let html = `
          <div id="${id}" class="start-call chart-item">
            <div class="start-call__header d-flex justify-content-between align-content-center">
            
              <div><i class="fa fa-circle"></i> Start</div>
              <i style="position: relative;top: 4px;" class="fa fa-times-circle "></i>
            </div>
            <div class="start-call__body">
              PHLO Execution will start from this node
            </div>
            <div class="start-call__footer d-flex justify-content-between">
              <div>Incoming SMS</div>
              <div>Incoming Call</div>
              <div>API Request</div>
            </div>
          
          </div>`;
          // ${ui.helper.html()}  

          $(this).append(html);
          $("#" + id).css({
            top: ui.position.top - 20 + "px",
            left: ui.position.left - 200 + "px"
          });
          addEndpoints(
            id,
             
            ["BottomRight", "BottomCenter", "BottomLeft"],
            ["TopCenter"]
          );
          instance.draggable(id, {
            grid: [1, 1]
          });
         
        }
      });

      jsPlumb.fire("jsPlumbDemoLoaded", instance);
    });

  
  },
  methods: {
  }
};
</script>
<style lang="scss">

.glocom-main{
  height: 100vh;
  &__aside{
    background-color: #f5f7fa;
    padding: 15px;
    width: 250px;
    &__content{
      &--search{
        input{
          border: 0;
          font-size: 12px;
        }
      }
      &__components{
        p{
          margin-bottom: 0;
        }
        &--blue{
          border: 1px solid #5dbcd2;
          display: block !important;
          text-align: left;
          padding: 7px 20px;
          background-color: #fff;
          i{
            color: #5dbcd2;
            margin-right: 10px;
          }
        }
        &--purple{
          border: 1px solid #b56adf;
          display: block !important;
          text-align: left;
          padding: 7px 20px;
          background-color: #fff;
          i{
            color: #b56adf;
            margin-right: 10px;
          }
        } 
        &--yellow{
          border: 1px solid #f9c662;
          display: block !important;
          text-align: left;
          padding: 7px 20px;
          background-color: #fff;
          i{
            color: #f9c662;
            margin-right: 10px;
          }
        }
      }
    }
  }
}
.start-call{
  width: 275px;
  border: 1px solid #53c251;
  border-radius: 4px;
  &__header{
    color: #53c251;
    border-bottom:1px solid #53c251;
    padding: 5px 15px;
    text-align: left;
  }
  &__body{
    color: rgba(52,58,64,.5);
    font-size: 13px;
    padding: 10px 15px;
    height: 80px;
    background-color: #fff;
   
  }
  &__footer{
    font-size: 12px;
    border-top: 1px solid #ddd;
    padding: 0 15px;
    height: 30px;
    line-height: 30px;
    div:nth-child(1){
      border-right: 1px solid #ddd;
      padding-right: 5px;
    }
    div:nth-child(3){
      border-left: 1px solid #ddd;
      padding-left: 5px;
    }
  }
}
.arrowdown {
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-top: 13px solid #3b3c3a;
    display: inline-block;
    position: absolute;
    z-index: 12;
    top: 1px;
    svg{
      opacity: 0;
    }
}
.jtk-endpoint-anchor{
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


