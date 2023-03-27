import JPCWebSocket from "./protocol.js";

/////////////////////////////////
// Test

const kPort = 8672;
let jpc;
let app;

async function start() {
  await connect();
  await test1();
  await end();
}

async function connect() {
  try {
    jpc = new JPCWebSocket();
    await jpc.connect("test", null, kPort);
    app = await jpc.getRemoteStartObject();
  } catch (ex) {
    console.error(ex);
  }
}

async function end() {
  app.exit();
}

async function test1() {
  console.log("app", app);
  let cars = app.cars;
  for (let car of cars) {
    console.log("car", car);
    let owner = await car.owner;
    console.log("Car of " + owner);
    await car.startEngine();
    console.log("  Vroom!");
  }
}

start();
