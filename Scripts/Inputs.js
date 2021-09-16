class Button {
  static numOfButtons = 0;

  constructor(name, func) {
    if (Button.numOfButtons < 16) {
      this.button = createButton(name);
      this.button.size(70, 35);
      this.button.position(20 + 72 * Button.numOfButtons, 845);
      this.button.style("background: (75)");
      this.button.style("border: none");
      this.button.style("cursor: pointer");
      this.button.style("user-select: none");
      if (func instanceof Function) this.button.mousePressed(func);
      Button.numOfButtons += 1;
    } else {
      throw Error("You messed up big time");
    }
  }
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
    this.value = undefined;
  }

  update() {
    this.input.size(windowWidth - windowWidth * 0.1 + 2.5, windowHeight * 0.1 - 20);
    this.input.position(windowWidth * 0.05 - 2.5, 10);
    this.input.style("font-size: calc((75vw - 4.5rem) / 14)");
    this.value = this.input.value();
  }
}
