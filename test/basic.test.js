import { expect, test, beforeAll, afterAll } from 'vitest';
import JPCWebSocket from "../protocol.js";
import { start as startServer, kPort } from './server';

let jpc;
let app;

beforeAll(async () => {
  await startServer();
  jpc = new JPCWebSocket();
  await jpc.connect("test", null, kPort);
  app = await jpc.getRemoteStartObject();
});

afterAll(async () => {
  app.exit();
});

test('Car class', async () => {
  console.log("app", app);
  let cars = app.cars;
  for (let car of cars) {
    console.log("car", car);
    let owner = await car.owner;
    console.log("Car of " + owner);
    await car.startEngine();
    console.log("  Vroom!");
  }
});
