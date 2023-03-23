import { expect, expectTypeOf, test, beforeAll, afterAll } from 'vitest';
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
  let cars = await app.cars;
  for (let car of cars) {
    let owner = await car.owner;
    expect(owner).string();
    expect(await car.running).toBeFalsy();
    await car.startEngine();
    expect(await car.running).toBeTruthy();
  }
});
