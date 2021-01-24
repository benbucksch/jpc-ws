import JPCWebSocket from "./protocol.js";
import WebSocket from "ws";

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
    console.log("Engine started");
  }
}

class App {
  constructor() {
    this.cars = [
      new Car("Fred Flintstone"),
    ];
  }
}


/////////////////////////////////
// Test

const kPort = 8672;

async function start() {
  let jpc = new JPCWebSocket(new App());
  await jpc.listen("test", kPort, false);
}

(async () => {
  try {
    await start();
  } catch (ex) {
    console.error(ex);
  }
})();
