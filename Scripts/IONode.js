  /**
   * @param  {} x
   * @param  {} y
   * @param  {} mainNode=false
   * @param  {} inputNode=false
   */
  class IONode {
  constructor(x, y, mainNode = false, inputNode = false) {
    this.value = 0;
    this.mainNode = mainNode;
    this.inputNode = inputNode;
    this.parent = null;
    this.relX = x;
    this.relY = y;
    this.r = mainNode == false ? 15 : 30;
    this.canChangeValue = false;

    //this.input = null;
  }

  update() {
    this.x = this.relX + (this.parent != undefined ? this.parent.x : 0);
    this.y = this.relY + (this.parent != undefined ? this.parent.y : 0);

    // if node is clicked on and is an input then start a connection
    if (this.clickedOn()) NodeConnector.handleConnectingNodes(this);

    this.draw();

    // update value of this node
    if (this.connectee != undefined) {
      this.value = this.connectee.getValue();
    }
  }

  clickedOn() {
    if (mouseIsPressed && mouseButton === LEFT) {
      // left mouse button has been clicked... somewhere
      if (dist(this.x, this.y, mouseX, mouseY) <= this.r / 2) {
        // this object has been clicked on
        if (keyIsPressed && keyCode === 16 && this.mainNode && !this.inputNode) {
          this.canChangeValue = true;
          return false;
        }
        return true;
      }
    }
    /*
    if (mouseIsPressed) {
      if (dist(this.x, this.y, mouseX, mouseY) <= this.r / 2) {
        if (mouseButton === LEFT) {
          return true;
        } else if (mouseButton === RIGHT) {
          return false;
        }
      }
    }*/
    
    if (this.canChangeValue) {
      this.value = 0 + !this.value;
      this.canChangeValue = false;
    }

    return false;
  }

  draw() {
    push();
    fill(this.value == 1 ? color(150, 0, 0) : color(10, 10, 10));
    ellipse(this.x, this.y, this.r);
    //shows value in text
    //fill(255)
    //textSize(10)
    //text(this.value, this.x, this.y);
    pop();
  }

  getValue() {
    return this.value;
  }

  setValue(value) {
    if (value == 1 || value == 0) {
      this.value = value;
    } else console.error('Value ' + value + ' is invalid and must be 0 or 1.');
  }
}
