let logicGatesImg;
let isMove = false;

function mouseReleased() {
  //Mouse Released
  if (mouseButton === LEFT) {
    isMove = true;
    if (NodeConnector != undefined && NodeConnector != null) {
      if (NodeConnector.firstSelectNode == NodeConnector.secondSelectNode) {
        NodeConnector.firstSelectNode = null;
        NodeConnector.secondSelectNode = null;
        NodeConnector.whichSelectNode = 0;
      }
    }
  }
}

function keyPressed() {
  if (keyCode == 32) {
    // space
    if (Circuits == undefined && Circuits == null) return;
    CreatorCircuit.CreateCircuit(1);
  }
}

function keyReleased() {
  IONode.keyReleased = true;
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textSize(48);
  textAlign(CENTER, CENTER);

  createCircuitInput = new Input();

  createCircuitButton = new Button("Create", CreatorCircuit.CompileCircuit)

  NodeConnector = new IONodeConnectionHandler();

  creationCircuit = new CreatorCircuit(2, 1);

  Circuits = [];
  CreatorCircuit.CreateCircuit(0);
}

function draw() {
  background(46, 46, 46);
  creationCircuit.update();
  NodeConnector.draw();
  creationCircuit.drawIONodes();
  for (let i = 0; i < Circuits.length; i++) {
    Circuits[i].update();
  }
  createCircuitInput.update();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}