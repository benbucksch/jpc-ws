import JPCWebSocket from "../protocol.js";

/////////////////////////
// Some classes

export class Movable {
  constructor() {
    this.running = false;
  }
}

export class Car extends Movable {
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
    this.running = true;
  }
}

export class App {
  constructor() {
    this.cars = [
      new Car("Fred Flintstone"),
      new Car("Barney"),
    ];
  }
  testFunc() { }

  exit() {
    if (jpc) {
      jpc.stopListening();
    }
    process.exit();
  }
}


/////////////////////////////////
// Test

export const kPort = 8672;
let jpc;

export async function start() {
  jpc = new JPCWebSocket(new App());
  jpc.listen("test", kPort, false); // await would wait for the first client to connect
  //console.log("Server started");
}
