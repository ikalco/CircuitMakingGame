class IONodeConnectionHandler {
  constructor() {
    if (IONodeConnectionHandler.instance instanceof IONodeConnectionHandler) {
      return IONodeConnectionHandler.instance;
    }

    this.firstSelectNode = null;
    this.secondSelectNode = null;
    this.whichSelectNode = 0;

    this.connections = [];

    this.currentConnectionVerts = [];

    IONodeConnectionHandler.instance = this;
  }

  draw() {
    this.connections.forEach(connection => {
      push()
      stroke(connection.connectee.getValue() == 1 ? color(235,33,46) : color(28, 32, 35));
      strokeWeight(5);
      line(connection.connectee.x, connection.connectee.y, connection.x, connection.y);
      pop()
    });

    /*
    push();
    noFill();
    stroke(color(28, 32, 35));
    strokeWeight(5);
    beginShape();
    for (let i = 0; i < this.currentConnectionVerts.length; i++) {
      curveVertex(this.currentConnectionVerts[i][0], this.currentConnectionVerts[i][1]);
    }
    if (this.currentConnectionVerts.length < 1) curveVertex(mouseX, mouseY);
    curveVertex(mouseX, mouseY);
    endShape();
    pop();*/

    push();
    if (this.firstSelectNode != null && this.whichSelectNode == 1) {
      stroke(this.firstSelectNode.getValue() == 1 ? color(235,33,46) : color(28, 32, 35));
      strokeWeight(5);
      line(this.firstSelectNode.x, this.firstSelectNode.y, mouseX, mouseY);

      if (keyIsPressed && keyCode == 27) {
        // if you press escape then stop selection
        this.firstSelectNode = null;
        this.whichSelectNode = 0;
      }
    }
    //arrow(this.firstSelectNode.x, this.firstSelectNode.y, mouseX, mouseY, 20, false);
    pop();
  }

  handleConnectingNodes(object) {
    if (this.firstSelectNode == object) return;
    if (this.whichSelectNode == 0) {
      // saves first object and sets selector to second object
      this.firstSelectNode = object;
      this.whichSelectNode = 1;
      this.currentConnectionVerts.push([object.x, object.y])
    } else if (this.whichSelectNode == 1) {
      // saves second object and connects them
      this.secondSelectNode = object;
      this.connectNodesToEachother(this.firstSelectNode, this.secondSelectNode);
      this.whichSelectNode = 0;
      this.currentConnectionVerts.push([object.x, object.y])      
    }
  }

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

      this.connections.push(second);
    }
  }
}

/**
 * @param  {} x1
 * @param  {} y1
 * @param  {} x2
 * @param  {} y2
 * @param  {} radius
 * @param  {} arrowAtMiddle=true
 */
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