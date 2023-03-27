import JPCWebSocket from "./protocol.js";

/////////////////////////
// Some classes

class Movable {
}

class Car extends Movable {
  constructor(owner) {
    super();
    this._owner = owner;
  }
  get owner() {
    return this._owner;
  }
  set owner(val) {
    this._owner = val;
  }
  startEngine() {
    console.log("Engine started.");
  }
}

class App {
  constructor() {
    this.cars = [
      new Car("Fred Flintstone"),
      new Car("Barney"),
    ];
  }
  testFunc() { }

  exit() {
    console.log("Server stopped");
    process.exit();
  }
}


/////////////////////////////////
// Test

const kPort = 8672;

async function start() {
  let jpc = new JPCWebSocket(new App());
  await jpc.listen("test", kPort, false);
  console.log("Server started");
}

(async () => {
  try {
    await start();
  } catch (ex) {
    console.error(ex);
  }
})();
