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
    Circuits.push(new Circuit('NOT', 10, 10, 1, 1));
  }
}

function keyReleased() {
  IONode.keyReleased = true;
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textSize(32);
  textAlign(CENTER, CENTER);
  //circuitCreatorButton = new Button(() => {});
  NodeConnector = new IONodeConnectionHandler();

  creationCircuit = new CreatorCircuit(2, 1);

  Circuits = [new Circuit('AND', 10, 10, 2, 1)];
}

function draw() {
  background(46, 46, 46);
  creationCircuit.update();
  NodeConnector.draw();
  for (let i = 0; i < Circuits.length; i++) {
    Circuits[i].update();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


// todo fix the alignment of main inputs and outputs they should be centered
class CreatorCircuit {
  constructor(numOfInputs, numOfOutputs) {
    this.x = windowWidth * 0.05;
    this.y = windowHeight * 0.1;
    this.width = windowWidth - windowWidth * 0.1;
    this.height = windowHeight - windowHeight * 0.2;
    
    this.numOfInputs = numOfInputs > 0 ? numOfInputs : 1;
    this.numOfOutputs = numOfOutputs > 0 ? numOfOutputs : 1;

    this.inputSpacing = this.height / this.numOfInputs;
    this.outputSpacing = this.height / this.numOfOutputs;

    this.inputs = [];
    this.outputs = [];

    this.createIONodes();
  }

  update() {
    this.x = windowWidth * 0.05;
    this.y = windowHeight * 0.1;
    this.width = windowWidth - windowWidth * 0.1;
    this.height = windowHeight - windowHeight * 0.2;

    for (let i = 0; i < this.inputs.length; i++) {
      this.inputs[i].relX = this.x;
      this.inputs[i].relY = this.inputSpacing * i + this.height / (2 * this.numOfInputs);
      this.inputs[i].update();
    }

    for (let i = 0; i < this.outputs.length; i++) {
      this.outputs[i].relX = this.x + this.width;
      this.outputs[i].relY = this.outputSpacing * i + this.height / (2 * this.numOfOutputs);
      this.outputs[i].update();
    }

    this.draw();
    this.drawIONodes();
  }

  draw() {
    // buttons are all 75
    push();
    fill(45,45,45)
    strokeWeight(10);
    stroke(60, 60, 60);
    rect(this.x, this.y, this.width, this.height);
    pop();
  }

  drawIONodes() {
    for (let i = 0; i < this.inputs.length; i++) this.inputs[i].draw(this.x, this.y);
    for (let i = 0; i < this.outputs.length; i++) this.outputs[i].draw(this.x, this.y);
  }

  createIONodes() {
    for (let i = 0; i < this.numOfInputs; i++) {
      let ioNode = new IONode(0, this.inputSpacing * i + this.height / (2 * this.numOfInputs), true, false);
      //ioNode.parent = this;
      this.inputs.push(ioNode);
    }
    for (let i = 0; i < this.numOfOutputs; i++) {
      let ioNode = new IONode(this.width, this.outputSpacing * i + this.height / (2 * this.numOfOutputs), true, true);
      //ioNode.parent = this;
      this.outputs.push(ioNode);
    }
  }
}