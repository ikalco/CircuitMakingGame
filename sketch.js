let logicGatesImg;
let isMove = false;

function mouseReleased() {
  //Mouse Released
  if (mouseButton === LEFT) {
    isMove = false;    
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
    Circuits.push(new Circuit("NOT", 10, 10, 1, 1));
  }
}

function setup() {
  createCanvas(1200, 900);
  textSize(32);
  textAlign(CENTER, CENTER);
  circuitCreatorButton = new Button(() => {});
  NodeConnector = new IONodeConnectionHandler();

  MainInputs = [new IONode(20, 435, true, false), new IONode(20, 465, true, false)];
  MainOutputs = [new IONode(1180, 435, true, true)];
  Circuits = [new Circuit("AND", 10, 10, 2, 1)];
}

function draw() {
  background(220);
  for (let i = 0; i < Circuits.length; i++) {
    Circuits[i].update();
  }
  for (let i = 0; i < MainInputs.length; i++) {
    MainInputs[i].update();
  }
  for (let i = 0; i < MainOutputs.length; i++) {
    MainOutputs[i].update();
  }
  NodeConnector.draw();
}
