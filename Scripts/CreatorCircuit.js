class CreatorCircuit {
  // prettier-ignore
  static savedCircuits = [['AND', 2, 1, Function("return this.output(this.and(this.input(0), this.input(1)), 0)")], ['NOT', 1, 1, Function("return this.output(this.not(this.input(0)), 0)"),],];

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

    push();
    fill(30, 30, 30);
    noStroke();
    rect(0, windowHeight - this.y / 3 * 2, windowWidth, windowHeight - (windowHeight - this.y / 3 * 2));
    pop();

    this.draw();
  }

  draw() {
    // buttons are all 75
    push();
    fill(45, 45, 45);
    strokeWeight(5);
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
      this.inputs.push(ioNode);
    }
    for (let i = 0; i < this.numOfOutputs; i++) {
      let ioNode = new IONode(this.width, this.outputSpacing * i + this.height / (2 * this.numOfOutputs), true, true);
      this.outputs.push(ioNode);
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

    // work backwards
    // start with the inputs(outputs) of the creation circuit
    // then traceback where it gets its values
    // when you get to a cricuit you want to
    // loop through all it's inputs (tracing back with those)
    // when it gets back to you then you just combine those inputs to make your function (gate)

    let compiledOutputLogicStrings = compileCircuit(CreatorCircuit.instance.outputs);

    let compiledLogicString = "";
    for (let i = 0; i < compiledOutputLogicStrings.length; i++) {
      compiledLogicString += `this.output(${compiledOutputLogicStrings[i]}, ${i});\n`;
    }

    compiledLogicString = compiledLogicString.replaceAll("input", "this.input");

    let logicFunction = `return ${compiledLogicString}`;

    // saves compiled circuit
    compiledCircuit.push(Function(logicFunction));
    CreatorCircuit.savedCircuits.push(compiledCircuit);

    // create new button that will make a new one of the saved circuit
    // adds a new button to create the circuit just saved

    // clears/wipes the board clean
    NodeConnector.connections = [];
    Circuits = [];
    CreatorCircuit.instance.inputs = [];
    CreatorCircuit.instance.outputs = [];
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

function compileCircuit(arrOfNodes) {
  //console.log(arrOfNodes);
  let inputs = [];
  let bottomOfRecursion = false;
  let circuit;

  arrOfNodes.forEach(node => {
    if (node.parent) circuit = node.parent;
    if (node.connectee) {
      // if the thing its connected to has a circuit as its parent
      if (node.connectee.parent) {
        // this is what this node will recieve
        //console.log(node.connectee.parent.inputs)
        inputs.push(compileCircuit(node.connectee.parent.inputs));
      } else {
        inputs.push(compileCircuit([node.connectee]));
      }
    } else {
      //console.log(node.mainNode, !node.inputNode);
      //console.log(node);
      //console.log("input(" + CreatorCircuit.instance.inputs.indexOf(node) + ")")
      if ((node.mainNode, !node.inputNode)) inputs.push("input(" + CreatorCircuit.instance.inputs.indexOf(node) + ")");
    }
  });
  // TODO need to compile our logic function to where input(n) uses this inputs function
  // ['AND', 2, 1, function () { return this.output(this.and(this.input(0), this.input(1)), 0); }]
  // replace all "this.input(n)" with inputs[n]
  if (circuit) {
    let logicString = getLogicFromFunc(circuit.logic);
    let replaced = replaceReferenceInputs(logicString, inputs);
    //console.log(replaced)
    return replaced;
  } else {
    return inputs;
  }
}

function replaceReferenceInputs(logicString, inputs = []) {
  while (logicString.includes("this.input")) {
    //print(logicString);
    let index = logicString.indexOf("this.input");
    let input = inputs[logicString[index + 11]];
    logicString = logicString.slice(0, index) + input + logicString.slice(index + 13, logicString.length);
  }
  return logicString;
}

function getAllLogicOutputs(logicString) {
  let indiciesOfAllOutputs = [...logicString.matchAll(new RegExp("this.output", "gi"))].map(a => a.index);
  let outputs = [];
  indiciesOfAllOutputs.forEach(index => {
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
