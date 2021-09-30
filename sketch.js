let logicGatesImg;
let isMove = false;
let avgFps = 60;
let a = 0.9;

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

function drawFramerate() {
  avgFps = a * avgFps + (1.0 - a) * getFrameRate();
  let fpsString = 'FPS: ' + parseInt(avgFps);
  push();
  textSize(24);
  fill(255);
  text(fpsString, 50, 500);
  pop();
}

function keyPressed() {
  if (keyCode >= 49 && keyCode <= 57) {
    // any of the numbers
    if (CreatorCircuit.savedCircuits[keyCode - 49]) CreatorCircuit.CreateCircuit(keyCode - 49);
  }
  if (keyCode == 13) {
    // enter
    CreatorCircuit.SaveCircuit();
  }
}

function keyReleased() {
  IONode.keyReleased = true;
  if (CreatorCircuit.instance != undefined) CreatorCircuit.handleAddingRemovingNodes();
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textSize(48);
  textAlign(CENTER, CENTER);
  strokeCap(ROUND);

  NodeConnector = new IONodeConnectionHandler();

  creationCircuit = new CreatorCircuit(2, 1);

  createCircuitInput = new Input();

  Circuits = [];
}

function draw() {
  background(45, 45, 45);
  creationCircuit.update();
  NodeConnector.draw();
  creationCircuit.drawIONodes();
  for (let i = 0; i < Circuits.length; i++) {
    Circuits[i].update();
  }
  createCircuitInput.update();
  
  drawFramerate();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
