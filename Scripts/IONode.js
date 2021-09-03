class IONode {
  #value = 0;
  constructor(x, y, mainNode = false) {
    this.mainNode = mainNode;
    this.parent = null;
    this.relX = x;
    this.relY = y;
    this.r = mainNode == false ? 10 : 20;

    this.input = null;
  }

  update() {
    this.x = this.relX + (this.parent != undefined ? this.parent.x : 0);
    this.y = this.relY + (this.parent != undefined ? this.parent.y : 0);

    // if node is clicked on and is an input then start a connection
    if (this.clickedOn()) NodeConnector.handleConnectingNodes(this);

    this.draw();

    // update value of this node
    if (this.input != undefined) this.#value = this.input();
  }

  clickedOn() {
    if (mouseIsPressed && mouseButton === LEFT) {
      // left mouse button has been clicked... somewhere
      if (dist(this.x, this.y, mouseX, mouseY) <= this.r / 2) {
        // this object has been clicked on
        return true;
      }
    }

    return false;
  }

  draw() {
    push();
    fill(0)
    ellipse(this.x, this.y, this.r);
    pop();
  }

  getValue() {
    return this.#value;
  }

  setValue(value) {
    if (value == 1 || value == 0) this.#value = value;
    else {
      try {
        throw new Error('Value ' + value + ' is invalid must be between ' + 0 + ' and ' + 1 + '.');
      } catch (error) {
        console.error('Value ' + value + ' is invalid and must be between ' + 0 + ' and ' + 1 + '.');
      }
    }
  }
}

class IONodeCircuit extends IONode {
  constructor(x, y, mainNode = false) {
    super(x, y, mainNode = false);

    // if input then can only have one input
  }
}