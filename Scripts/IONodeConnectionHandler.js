class IONodeConnectionHandler {
  constructor() {
    if (IONodeConnectionHandler.instance instanceof IONodeConnectionHandler) {
      return IONodeConnectionHandler.instance;
    }

    this.firstSelectNode = null;
    this.secondSelectNode = null;
    this.whichSelectNode = 0;

    this.connections = [];

    IONodeConnectionHandler.instance = this;
  }

  draw() {
    this.connections.forEach(connection => {
      line(connection.connectee.x, connection.connectee.y, connection.x, connection.y);
      //arrow(connection.connectee.x, connection.connectee.y, connection.x, connection.y, 20);
    });

    push();
    //fill(0, 220, 0)
    if (this.firstSelectNode != null && this.whichSelectNode == 1) line(this.firstSelectNode.x, this.firstSelectNode.y, mouseX, mouseY);
    //arrow(this.firstSelectNode.x, this.firstSelectNode.y, mouseX, mouseY, 20, false);
    pop();
  }

  handleConnectingNodes(object) {
    if (this.firstSelectNode == object) return;
    if (this.whichSelectNode == 0) {
      // saves first object and sets selector to second object
      this.firstSelectNode = object;
      this.whichSelectNode = 1;
    } else if (this.whichSelectNode == 1) {
      // saves second object and connects them
      this.secondSelectNode = object;
      this.connectNodesToEachother(this.firstSelectNode, this.secondSelectNode);
      this.whichSelectNode = 0;
    }
  }

  /*
  if (mouseIsPressed) {
    if (NodeConnector.firstSelectNode == NodeConnector.secondSelectNode) {
      NodeConnector.firstSelectNode = null;
      NodeConnector.secondSelectNode = null;
      NodeConnector.whichSelectNode = 0;
    }
  }
  */

  connectNodesToEachother(first, second) {
    // make sure not to connect to self
    if (first == second) return;

    if (!first.mainNode && !second.mainNode) 
      if (first.parent == second.parent) 
        return;

    if (!first.inputNode && second.inputNode) {
      // make sure not connecting input nodes to each other
      //if (first.inputNode && second.inputNode) return;

      // make sure not connecting output nodes to each other
      //if (!first.inputNode && !second.inputNode) return;

      // make sure to delete old connection if node already has one
      this.connections.forEach((val, ind) => {
        if (val == first) {
          this.connections.splice(ind, 1);
        }
      });

      // we push the second node to the connections array
      // and the second node's input func's (getValue) parent value is set to the first node
      // parent value is made up btw

      // dont use getValue function
      // just set connectee variable to the node.

      second.input = first.getValue;
      second.connectee = first;

      //console.log(this.connections);

      this.connections.push(second);
      //console.log(this.connections);
    }
  }
}

function arrow(x1, y1, x2, y2, radius, arrowAtMiddle = true) {
  line(x1, y1, x2, y2);
  let arrowX = (x1 + x2) / 2;
  let arrowY = (y1 + y2) / 2;
  if (!arrowAtMiddle) {
    arrowX = x2;
    arrowY = y2;
  }

  push(); //start new drawing state
  var angle = atan2(y1 - y2, x1 - x2); //gets the angle of the line
  translate(arrowX, arrowY); //translates to the destination vertex
  rotate(angle - HALF_PI); //rotates the arrow point
  //                bottom left         bottom right        top
  //triangle(-radius * 0.5, radius, radius * 0.5, radius, 0, -radius / 2); //draws the arrow point as a triangle

  // bottom left to top
  line(-radius * 0.5, radius, 0, -radius / 2);

  // bottom right to top
  line(radius * 0.5, radius, 0, -radius / 2);

  pop();
}