<template>
  <div>
    <!-- Adds new windows to the page -->
    <div class="window" style="left: 600px" id="details">
      <p style="text-align: center">Window</p>
      <div class="button_container">
        <div class="button_add_window">Add</div>
      </div>
    </div>

    <!-- Primary window - used as html templated for descendants -->
    <div class="window" style="left: 20px" id="container0">
      <div class="button_container">
        <div class="button_add">Add</div>
        <div class="button_remove">Remove</div>
      </div>
    </div>

    <div class="window" style="left: 200px" id="container1"></div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      anEndpointSource: {
        endpoint: "Rectangle",
        isSource: true,
        isTarget: false,
        maxConnections: 1,

        anchor: [1, 0, 1, 0],
      },
      anEndpointDestination: {
        endpoint: "Dot",
        isSource: false,
        isTarget: true,
        maxConnections: 1,

        anchor: [0, 1, -1, 0],
      },
    };
  },
  methods: {
    fixEndpoints(parentnode) {
      //get list of current endpoints
      var endpoints = jsPlumb.getEndpoints(parentnode);

      //there are 2 types - input and output

      var inputAr = $.grep(endpoints, function (elementOfArray, indexInArray) {
        return elementOfArray.isSource; //input
      });

      var outputAr = $.grep(endpoints, function (elementOfArray, indexInArray) {
        return elementOfArray.isTarget; //output
      });

      this.calculateEndpoint(inputAr, true);
      this.calculateEndpoint(outputAr, false);

      jsPlumb.repaintEverything();
    },
    calculateEndpoint(endpointArray, isInput) {
      //multiplyer
      var mult = 1 / (endpointArray.length + 1);

      for (var i = 0; i < endpointArray.length; i++) {
        if (isInput) {
          //position
          endpointArray[i].anchor.x = 1;
          endpointArray[i].anchor.y = mult * (i + 1);
        } else {
          //position
          endpointArray[i].anchor.x = 0;
          endpointArray[i].anchor.y = mult * (i + 1);
        }
      }
    },
  },
  mounted() {
      let that = this
       jsPlumb.draggable($(".window"));
           $(("#container1"))[0].innerHTML = $(("#container0"))[0].innerHTML;
    jsPlumb.ready(function () {
      $(".button_add").on("click", function () {
        var parentnode = $(this)[0].parentNode.parentNode;

        jsPlumb.addEndpoint(parentnode, this.anEndpointSource);

        jsPlumb.addEndpoint(parentnode, this.anEndpointDestination);

        that.fixEndpoints(parentnode);
      });
      $(".button_remove").on("click", function () {
        var parentnode = $(this)[0].parentNode.parentNode;

        //get list of current endpoints
        var endpoints = jsPlumb.getEndpoints(parentnode);
console.log(endpoints[0]);
        //remove 2 last one

        if (endpoints.length > 1) {
          jsPlumb.deleteEndpoint(endpoints[endpoints.length - 2]);
        }

        if (endpoints.length > 0) {
          jsPlumb.deleteEndpoint(endpoints[endpoints.length - 1]);
        }

        that.fixEndpoints(parentnode);
      });
      $(".button_add_window").click(function () {
        var id = "dynamic_" + $(".window").length;

        //create new window and add it to the body
        $('<div class="window" id="' + id + '" >')
          .appendTo("body")
          .html($("#container0")[0].innerHTML);

        //set jsplumb properties
        jsPlumb.draggable($("#" + id));
      });
    });
  },
};
</script>

<style lang="scss">
.window {
  background-color: #eeeeef;
  border: 1px solid #346789;
  border-radius: 0.5em;
  box-shadow: 2px 2px 5px #aaaaaa;
  color: black;
  height: 5em;
  position: absolute;
  width: 5em;
}

.window:hover {
  box-shadow: 2px 2px 19px #aaaaaa;
  cursor: pointer;
}

.button_add,
.button_add_window,
.button_remove,
.button {
  background-color: deepskyblue;
  text-align: center;
  border: 1px solid;
}

.button_container {
  margin: 5px;
  background-color: #aaaaaa;
}
</style>