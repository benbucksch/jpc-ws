import JPCWebSocket from "./protocol.js";

/////////////////////////
// Server test classes

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
}


/////////////////////////////////
// Test

const kPort = 8672;

var wsServer = null, wsClient = null;

async function startServer() {
  wsServer = new JPCWebSocket(new App());
  await wsServer.listen("test", kPort, false);
}

async function startClient() {
  wsClient = new JPCWebSocket();
  await wsClient.connect("test", null, kPort);
}

test('Protocol', async () => {
  await startServer();
  await startClient();
  let app = await wsClient.getRemoteStartObject();
  expect(app).toHaveProperty("cars");
  let cars = app.cars;
  expect(cars).toBeInstanceOf(Array);
  for (let car of cars) {
    expect(car).toHaveProperty("owner");
    await expect(car.owner).resolves.toEqual(expect.any(String));
    await car.startEngine();
    console.log("Car of", await car.owner, " Vroom!");
  }
  wsClient.close();
  wsServer.close();
});
