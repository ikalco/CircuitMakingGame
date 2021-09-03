class Button {
  static numOfButtons = 0;

  constructor(func) {
    if (Button.numOfButtons < 16) {
      this.button = createButton('CREATE');
      this.button.size(70, 35);
      this.button.position(20 + 72 * Button.numOfButtons, 845);
      this.button.style('background: (10)');
      this.button.style('border: none');
      this.button.style('cursor: pointer');
      if (func instanceof Function) this.button.mousePressed(func);
      else {
        try {
          throw Error('Pass in a function');
        } catch (error) {
          console.error(error.message);
        }
      }
      Button.numOfButtons += 1;
    } else {
      throw Error('You messed up big time');
    }
  }
}
