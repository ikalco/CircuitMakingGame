class Button {
  static xOffsetForNextButton = 1;

  constructor(name, func, xOffset = 2) {
    push();
    textSize(24);
    this.x = Button.xOffsetForNextButton;
    this.y = windowHeight - windowHeight * 0.1 / 3 * 2;
    this.w = textWidth(name + 5);
    this.h = windowHeight - this.y;

    Button.xOffsetForNextButton += this.w + xOffset;

    this.button = createButton(name);
    this.button.size(this.w, this.h - this.h * 0.2);
    this.button.position(this.x, this.y + this.h * 0.1);
    this.button.style("background: rgb(40, 40, 40)");
    this.button.style("color: white");
    this.button.style("border: none");
    this.button.style("cursor: pointer");
    this.button.style("user-select: none");
    // prettier-ignore
    this.button.mouseOver(() => {this.button.style("background: rgb(60, 60, 60)");});
    // prettier-ignore
    this.button.mouseOut(() => {this.button.style("background: rgb(40, 40, 40)");});
    this.button.style("font-size: 24px");
    this.button.style("text-align: center");
    if (func instanceof Function) this.button.mouseReleased(func);
    pop();
  }
  /*
  resize() {
    Button.buttonSpacingWidth = windowWidth / 8;
    this.button.size(Button.buttonSpacingWidth - 2, windowHeight * 0.1 - 20);
    this.button.position(Button.buttonSpacingWidth * this.buttonNum, windowHeight - windowHeight * 0.1 + 10);
  }
  */
}

class Input {
  constructor() {
    this.input = createInput();
    this.input.size(windowWidth - windowWidth * 0.1, windowHeight * 0.1 - 20);
    this.input.position(windowWidth * 0.05, 10);
    this.input.style("background-color: rgb(60, 60, 60)");
    this.input.style("border: none");
    this.input.style("cursor: default");
    this.input.style("color: white");
    this.input.style("outline: none");
    this.input.style("text-transform:uppercase");
    this.input.style("font-size: calc((75vw - 4.5rem) / 14)");
    this.input.style("font-weight: 500");
  }

  update() {
    this.input.size(windowWidth - windowWidth * 0.1 + 2.5, windowHeight * 0.1 - 20);
    this.input.position(windowWidth * 0.05 - 2.5, 10);
    this.input.style("font-size: calc((75vw - 4.5rem) / 14)");
    //this.value = this.input.elt.value;
  }

  setValue(string) {
    this.input.elt.value = string;
  }

  getValue(string) {
    return this.input.elt.value;
  }
}
