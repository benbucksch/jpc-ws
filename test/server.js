import JPCWebSocket from "../protocol.js";

/////////////////////////
// Some classes

export class Movable {
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
    console.log("Engine started.");
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
    console.log("Server stopped");
    //process.exit();
  }
}


/////////////////////////////////
// Test

export const kPort = 8672;
let jpc;

export async function start() {
  console.log("start server");
  jpc = new JPCWebSocket(new App());
  jpc.listen("test", kPort, false); // await would wait for the first client to connect
  console.log("Server started");
}
