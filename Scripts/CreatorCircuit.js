class CreatorCircuit {
  static savedCircuits = [
    ["AND", 2, 1, Function("this.output(this.and(this.input(0), this.input(1)), 0)")],
    ["NOT", 1, 1, Function("this.output(this.not(this.input(0)), 0)")],
    ["NAND", 2, 1, Function("this.output(this.not(this.and(this.input(0), this.input(1))), 0);")],
    ["OR", 2, 1, Function("this.output(this.not(this.and(this.not(this.input(0)), this.not(this.input(1)))), 0);")],
    [
      "XOR",
      2,
      1,
      Function(
        "this.output(this.and(this.not(this.and(this.not(this.input(0)), this.not(this.input(1)))), this.not(this.and(this.input(0), this.input(1)))), 0);"
      ),
    ],
  ];

  // prettier-ignore
  static creationButtons = [];

  constructor(numOfInputs, numOfOutputs) {
    if (CreatorCircuit.instance instanceof CreatorCircuit) {
      return CreatorCircuit.instance;
    }

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
    this.IONodeSwitches = [];

    this.createIONodes();

    CreatorCircuit.creationButtons.push(new Button("CREATE", CreatorCircuit.SaveCircuit, 5));

    for (let i = 0; i < CreatorCircuit.savedCircuits.length; i++) {
      CreatorCircuit.creationButtons.push(
        new Button(CreatorCircuit.savedCircuits[i][0], () => {
          CreatorCircuit.CreateCircuit(i);
        })
      );
    }

    CreatorCircuit.instance = this;
  }

  update() {
    this.x = windowWidth * 0.05;
    this.y = windowHeight * 0.1;
    this.width = windowWidth - windowWidth * 0.1;
    this.height = windowHeight - windowHeight * 0.2;

    this.inputSpacing = this.height / this.numOfInputs;
    this.outputSpacing = this.height / this.numOfOutputs;

    this.draw();

    for (let i = 0; i < this.IONodeSwitches.length; i++) {
      this.IONodeSwitches[i].update();
    }

    for (let i = 0; i < this.inputs.length; i++) {
      this.inputs[i].relX = this.x;
      this.inputs[i].relY = this.y + this.inputSpacing * i + this.height / (2 * this.numOfInputs);
      this.inputs[i].update();
    }

    for (let i = 0; i < this.outputs.length; i++) {
      this.outputs[i].relX = this.x + this.width;
      this.outputs[i].relY = this.y + this.outputSpacing * i + this.height / (2 * this.numOfOutputs);
      this.outputs[i].update();
    }
  }

  draw() {
    // draws darker piece at the bottom
    push();
    fill(30, 30, 30);
    noStroke();
    rect(0, windowHeight - (this.y / 3) * 2, windowWidth, windowHeight - (windowHeight - (this.y / 3) * 2));
    pop();

    // draws inner part and the line between the outer and inner parts
    push();
    fill(45, 45, 45);
    strokeWeight(5);
    stroke(60, 60, 60);
    rect(this.x, this.y, this.width, this.height, 5);
    pop();
  }

  drawIONodes() {
    for (let i = 0; i < this.inputs.length; i++) this.inputs[i].draw();
    for (let i = 0; i < this.outputs.length; i++) this.outputs[i].draw();
  }

  createIONodes() {
    for (let i = 0; i < this.numOfInputs; i++) {
      let node = new IONode(0, this.inputSpacing * i + this.height / (2 * this.numOfInputs), true, false);
      this.IONodeSwitches.push(new NodeSwitch(node));
      this.inputs.push(node);
    }
    for (let i = 0; i < this.numOfOutputs; i++) {
      let node = new IONode(this.width, this.outputSpacing * i + this.height / (2 * this.numOfOutputs), true, true);
      this.IONodeSwitches.push(new NodeSwitch(node));
      this.outputs.push(node);
    }
  }

  static handleAddingRemovingNodes() {
    let changed = 0;
    if (mouseX < windowWidth / 2) {
      if (keyCode == 107 || keyCode == 81) {
        CreatorCircuit.instance.numOfInputs++;
        let node = new IONode(
          0,
          CreatorCircuit.instance.inputSpacing * (CreatorCircuit.instance.inputs.length - 1) +
            CreatorCircuit.instance.height / (2 * CreatorCircuit.instance.numOfInputs),
          true,
          false
        );
        CreatorCircuit.instance.IONodeSwitches.push(new NodeSwitch(node));
        CreatorCircuit.instance.inputs.push(node);
        changed = 1;
      } else if (keyCode == 109 || keyCode == 69) {
        CreatorCircuit.instance.numOfInputs--;
        changed = 2;
      }
    } else {
      if (keyCode == 107 || keyCode == 81) {
        CreatorCircuit.instance.numOfOutputs++;
        let node = new IONode(
          CreatorCircuit.instance.width,
          CreatorCircuit.instance.outputSpacing * (CreatorCircuit.instance.inputs.length - 1) +
            CreatorCircuit.instance.height / (2 * CreatorCircuit.instance.numOfOutputs),
          true,
          true
        );
        CreatorCircuit.instance.IONodeSwitches.push(new NodeSwitch(node));
        CreatorCircuit.instance.outputs.push(node);
        changed = 3;
      } else if (keyCode == 109 || keyCode == 69) {
        CreatorCircuit.instance.numOfOutputs--;

        changed = 4;
      }
    }

    if (changed != 0) {
      if (CreatorCircuit.instance.numOfInputs == 0) CreatorCircuit.instance.numOfInputs = 1;
      else if (changed == 2) {
        CreatorCircuit.instance.IONodeSwitches.forEach((nodeSwitch, index) => {
          if (nodeSwitch.node == CreatorCircuit.instance.inputs.at(-1)) {
            // if you are the most recent node

            // delete all connections to itself
            NodeConnector.connections.forEach((connection, index) => {
              if (connection.connectee == nodeSwitch.node) {
                connection.connectee = undefined;
                NodeConnector.connections.splice(index, 1);
              }
            });

            CreatorCircuit.instance.IONodeSwitches.splice(index, 1);
          }
        });

        CreatorCircuit.instance.inputs.pop();
      }

      if (CreatorCircuit.instance.numOfOutputs == 0) CreatorCircuit.instance.numOfOutputs = 1;
      else if (changed == 4) {
        CreatorCircuit.instance.IONodeSwitches.forEach((nodeSwitch, index) => {
          if (nodeSwitch.node == CreatorCircuit.instance.outputs.at(-1)) {
            // if you are the most recent node

            // delete all connections to itself
            NodeConnector.connections.forEach((connection, index) => {
              if (connection.connectee == nodeSwitch.node) {
                connection.connectee = undefined;
                NodeConnector.connections.splice(index, 1);
              }
            });

            CreatorCircuit.instance.IONodeSwitches.splice(index, 1);
          }
        });

        CreatorCircuit.instance.outputs.pop();
      }

      CreatorCircuit.instance.inputSpacing = CreatorCircuit.instance.height / CreatorCircuit.instance.numOfInputs;
      CreatorCircuit.instance.outputSpacing = CreatorCircuit.instance.height / CreatorCircuit.instance.numOfOutputs;
    }
  }

  static CreateCircuit(savedCircuitIndex) {
    let circuit = new Circuit(
      CreatorCircuit.savedCircuits[savedCircuitIndex][0],
      0,
      0,
      CreatorCircuit.savedCircuits[savedCircuitIndex][1],
      CreatorCircuit.savedCircuits[savedCircuitIndex][2]
    );
    circuit.logic = CreatorCircuit.savedCircuits[savedCircuitIndex][3];
    Circuits.push(circuit);
  }

  static SaveCircuit() {
    if (createCircuitInput.getValue() == "") {
      console.log("Invalid Circuit Name");
      return;
    }

    console.time("Time to compile circuit");
    let compiledCircuit = [String(createCircuitInput.getValue()).toUpperCase(), CreatorCircuit.instance.inputs.length, CreatorCircuit.instance.outputs.length];

    let compiledOutputLogicStrings = compileLogicFromNodes(CreatorCircuit.instance.outputs);

    let compiledLogicString = "";
    for (let i = 0; i < compiledOutputLogicStrings.length; i++) {
      compiledLogicString += `this.output(${compiledOutputLogicStrings[i]}, ${i});`;
    }

    compiledLogicString = compiledLogicString.replaceAll("input", "this.input");

    // saves compiled circuit
    compiledCircuit.push(Function(compiledLogicString));
    CreatorCircuit.savedCircuits.push(compiledCircuit);

    // create new button that will make a new one of the saved circuit
    // adds a new button to create the circuit just saved

    // clears/wipes the board clean
    NodeConnector.connections = [];
    Circuits = [];
    CreatorCircuit.instance.inputs = [];
    CreatorCircuit.instance.outputs = [];
    CreatorCircuit.instance.IONodeSwitches = [];
    CreatorCircuit.instance.createIONodes();

    // Clearing circuit name box
    createCircuitInput.setValue("");

    let circuitIndex = CreatorCircuit.savedCircuits.length - 1;
    CreatorCircuit.creationButtons.push(
      new Button(CreatorCircuit.savedCircuits[circuitIndex][0], () => {
        CreatorCircuit.CreateCircuit(circuitIndex);
      })
    );

    console.timeEnd("Time to compile circuit");
  }
}

function compileLogicFromNodes(arrOfNodes) {
  //console.log(arrOfNodes);
  let inputs = [];
  let circuit;

  arrOfNodes.forEach((node) => {
    if (node.parent) circuit = node.parent;
    if (node.connectee) {
      if (node.connectee.parent) {
        inputs.push(compileLogicFromNodes(node.connectee.parent.inputs));
      } else {
        inputs.push(compileLogicFromNodes([node.connectee]));
      }
    } else {
      if ((node.mainNode, !node.inputNode)) inputs.push("input(" + CreatorCircuit.instance.inputs.indexOf(node) + ")");
    }
  });

  if (circuit) {
    let logicString = getLogicFromFunc(circuit.logic);
    let replaced = replaceReferenceInputs(logicString, inputs);
    return replaced;
  } else {
    return inputs;
  }
}

function replaceReferenceInputs(logicString, inputs = []) {
  while (logicString.includes("this.input")) {
    let index = logicString.indexOf("this.input");
    let input = inputs[logicString[index + 11]];
    logicString = logicString.slice(0, index) + input + logicString.slice(index + 13, logicString.length);
  }
  return logicString;
}

function getAllLogicOutputs(logicString) {
  let indiciesOfAllOutputs = [...logicString.matchAll(new RegExp("this.output", "gi"))].map((a) => a.index);
  let outputs = [];
  indiciesOfAllOutputs.forEach((index) => {
    let startCurly = -1;
    let endCurly = -1;
    let numOfCurlys = 0;
    let outputLogicString = logicString.slice(index);
    [...outputLogicString].forEach((letter, index) => {
      if (startCurly != -1 && endCurly != -1) return;
      if (letter == "(") {
        if (numOfCurlys == 0) startCurly = index;
        numOfCurlys++;
      }
      if (letter == ")") {
        numOfCurlys--;
        if (numOfCurlys == 0 && startCurly != -1) endCurly = index;
      }
    });
    let outputLogic = outputLogicString.substring(startCurly + 1, endCurly);
    outputs[outputLogic.slice(-1)] = outputLogic.slice(0, outputLogic.lastIndexOf(")"));
  });
  return outputs;
}

function getLogicFromFunc(logic, withOutput = false) {
  let stringLogic = logic.toString();
  stringLogic = stringLogic.split("return").pop();
  for (let i = stringLogic.length - 1; i >= 0; i--) {
    if (stringLogic[i] == "}") {
      stringLogic = stringLogic.substring(0, i);
    }
    if (stringLogic[i] == ";") {
      stringLogic = stringLogic.substring(0, i);
    }
  }
  if (!withOutput) {
    stringLogic = stringLogic.split("this.output").pop();
    let j = 0;
    for (let i = stringLogic.length - 1; i >= 0 && j < 2; i--) {
      if (stringLogic[i] == ")") {
        stringLogic = stringLogic.substring(0, i + 1);
        j++;
      }
    }
  }
  return stringLogic.slice(1);
}
