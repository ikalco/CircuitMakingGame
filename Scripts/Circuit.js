class Circuit {

  constructor(name, x, y, numOfInputs, numOfOutputs) {
    this.x = x;
    this.y = y;

    this.name = name.toUpperCase();

    this.numOfInputs = numOfInputs > 0 ? numOfInputs : 1;
    this.numOfOutputs = numOfOutputs > 0 ? numOfOutputs : 1;

    this.width = this.calculateWidth();
    this.height = this.calculateHeight();

    this.color = [random(20, 235), random(20, 235), random(20, 235), 255];

    this.placed = false;

    this.inputs = [];
    this.outputs = [];

    this.createIONodes();
  }

  update() {
    if (this.placed) {
      this.dragDrop();
    } else {
      this.x = mouseX - this.width / 2;
      this.y = mouseY - this.height / 2;
      if (mouseIsPressed && mouseButton === LEFT) this.placed = true;
    }

    for (let i = 0; i < this.inputs.length; i++) {
      this.inputs[i].update();
    }

    for (let i = 0; i < this.outputs.length; i++) {
      this.outputs[i].update();
    }

    this.draw();
    this.drawIONodes();
  }

  draw() {
    push();
    fill(this.color);
    rect(this.x, this.y, this.width, this.height);
    fill(255);
    text(this.name, this.x + this.width / 2, this.y + this.height / 2 + 2.5);
    pop();
  }

  drawIONodes() {
    for (let i = 0; i < this.inputs.length; i++) this.inputs[i].draw(this.x, this.y);
    for (let i = 0; i < this.outputs.length; i++) this.outputs[i].draw(this.x, this.y);
  }

  createIONodes() {
    let inputSpacing = this.height / this.numOfInputs;
    let outputSpacing = this.height / this.numOfOutputs;
    for (let i = 0; i < this.numOfInputs; i++) {
      let ioNode = new IONode(0, inputSpacing * i + this.height / (2 * this.numOfInputs));
      ioNode.parent = this;
      this.inputs.push(ioNode);
    }
    for (let i = 0; i < this.numOfOutputs; i++) {
      let ioNode = new IONode(this.width, outputSpacing * i + this.height / (2 * this.numOfOutputs));
      ioNode.parent = this;
      this.outputs.push(ioNode);
    }
  }

  calculateWidth() {
    // width should be the width needed to print the name of the circuit
    return textWidth(this.name + 5);
  }

  calculateHeight() {
    return max(max(this.numOfInputs, this.numOfOutputs) * 10 + 25, textAscent() + 10);
  }

  dragDrop() {
    if (keyIsPressed && key === 'Control') {
      if (mouseIsPressed && mouseButton === LEFT) {
        if (mouseX >= this.x && mouseX <= this.x + this.width) {
          if (mouseY >= this.y && mouseY <= this.y + this.height) {
            isMove = true;
          }
        }
      }

      // Drag and drop occurs here
      if (isMove == true) {
        this.x = mouseX - this.width / 2;
        this.y = mouseY - this.height / 2;
      }
    }
  }
}
