let logicGatesImg;
let isMove = false;

function mouseReleased() {
  //Mouse Released
  if (mouseButton === LEFT) {
    isMove = false;
  }
}

function setup() {
  createCanvas(1200, 900);
  textSize(32);
  textAlign(CENTER, CENTER);
  //circuitCreatorButton = new Button(() => {});
  NodeConnector = new IONodeConnectionHandler();

  MainInputs = [new IONode(20, 435, true), new IONode(20, 465, true)];
  MainOutputs = [new IONode(1180, 435, true)];
  Circuits = [new Circuit('AND', 10, 10, 1, 1)];
}

function draw() {
  background(220);
  for (let i = 0; i < MainInputs.length; i++) {
    MainInputs[i].update();
  }
  for (let i = 0; i < MainOutputs.length; i++) {
    MainOutputs[i].update();
  }
  for (let i = 0; i < Circuits.length; i++) {
    Circuits[i].update();
  }
  NodeConnector.draw();
}

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
    this.connections.forEach((connection) => {
      arrow(connection.input.parent.x, connection.input.parent.y, connection.x, connection.y, 20);
    });

    push()
    fill(150, 0, 0)
    if (this.firstSelectNode != null) ellipse(this.firstSelectNode.x, this.firstSelectNode.y, this.firstSelectNode.r);
    pop()
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

  connectNodesToEachother(first, second) {
    if (second.getValue == first.input) return;

    for (const conn in this.connections) {
      if (this.connections[conn] == second && this.connections[conn].input.parent == first) return;
    }

    // we push the second node to the connections array
    // and the second node's input func's (getValue) parent value is set to the first node
    // parent value is made up btw

    second.input = first.getValue;
    second.input.parent = first;

    this.connections.push(second);
  }
}

function arrow(x1, y1, x2, y2, radius) {
  line(x1, y1, x2, y2);
  let midX = (x1 + x2) / 2;
  let midY = (y1 + y2) / 2;

  push(); //start new drawing state
  var angle = atan2(y1 - y2, x1 - x2); //gets the angle of the line
  translate(midX, midY); //translates to the destination vertex
  rotate(angle - HALF_PI); //rotates the arrow point
  //                bottom left         bottom right        top
  //triangle(-radius * 0.5, radius, radius * 0.5, radius, 0, -radius / 2); //draws the arrow point as a triangle

  // bottom left to top
  line(-radius * 0.5, radius, 0, -radius / 2);

  // bottom right to top
  line(radius * 0.5, radius, 0, -radius / 2);

  pop();
}
