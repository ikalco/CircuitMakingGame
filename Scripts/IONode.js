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
    this.r = mainNode == false ? 20 : 30;

    this.xOffset = 0;
    this.yOffset = 0;

    this.distFromThisToMouse = 100;

    //this.input = null;
  }

  update() {
    this.x = this.relX + (this.parent != null ? this.parent.x : 0) + this.xOffset;
    this.y = this.relY + (this.parent != null ? this.parent.y : 0) + this.yOffset;
    this.distFromThisToMouse = dist(this.x, this.y, mouseX, mouseY);

    // if node is clicked on and is an input then start a connection
    if (this.clickedOn()) NodeConnector.handleConnectingNodes(this);

    // update value of this node
    if (this.connectee != undefined) {
      this.value = this.connectee.getValue();
    }
  }

  clickedOn() {
    if (this.distFromThisToMouse <= this.r / 2) {
      if (mouseIsPressed && mouseButton === LEFT) {
        return true;
      }
    }

    return false;
  }

  draw() {
    if (this.distFromThisToMouse <= this.r / 2) {
      push();
      noStroke();
      fill(color(169, 169, 169));
      ellipse(this.x, this.y, this.r + 2.5);
      pop();
    } else {
      push();
      noStroke();
      fill(color(0, 0, 0));
      //if (!this.mainNode) fill(this.value == 1 ? color(235,33,46) : color(0, 0, 0));
      ellipse(this.x, this.y, this.r);
      pop();
    }
  }

  getValue() {
    return this.value;
  }

  setValue(value) {
    if (value == 1 || value == 0) {
      this.value = value;
    } else console.error("Value " + value + " is invalid and must be 0 or 1.");
  }
}

class NodeSwitch {
  constructor(node) {
    this.node = node;

    if (!this.node.inputNode) this.node.xOffset = this.node.r * 2;
    else this.node.xOffset = this.node.r * -2;
    this.node.yOffset = 0;

    this.x = this.node.x - this.node.xOffset;
    this.y = this.node.y - this.node.yOffset;
    this.r = this.node.r * 1.5;

    this.canChangeValue = false;
  }

  update() {
    this.x = this.node.x - this.node.xOffset;
    this.y = this.node.y - this.node.yOffset;

    this.clickedOn();
    this.draw();
  }

  draw() {
    push();
    strokeWeight(5);
    stroke(0);
    line(this.x, this.y, this.node.x, this.node.y);
    noStroke();
    fill(this.node.getValue() == 1 ? color(235, 33, 46) : color(29, 31, 41));
    ellipse(this.x, this.y, this.r);
    pop();
  }

  clickedOn() {
    if (mouseIsPressed && mouseButton === LEFT) {
      if (dist(this.x, this.y, mouseX, mouseY) <= this.r / 2) {
        this.canChangeValue = true;
        return true;
      }
    }

    if (this.canChangeValue) {
      this.node.setValue(0 + !this.node.getValue());
      this.canChangeValue = false;
    }

    return false;
  }
}
