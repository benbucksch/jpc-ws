import JPCWebSocket from "./protocol.js";
import WebSocket from "ws";


/////////////////////////////////
// Test

const kPort = 8672;

async function start() {
  let jpc = new JPCWebSocket();
  await jpc.connect("test", null, kPort);

  let app = await jpc.getRemoteStartObject();
  console.log("app", app);
  let cars = app.cars;
  console.log("cars", cars);
  for (let car of cars) {
    console.log("car", car);
    console.log("Car of " + (await car.owner));
    await car.startEngine();
    console.log("  Vroom!");
  }
}

(async () => {
  try {
    await start();
  } catch (ex) {
    console.error(ex);
  }
})();
