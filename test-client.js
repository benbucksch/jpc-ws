import JPCWebSocket from "./protocol.js";
import WebSocket from "ws";


/////////////////////////////////
// Test

const kPort = 8672;

async function start() {
  await new JPCWebSocket().connect("test", null, kPort);
}

(async () => {
  try {
    await start();
  } catch (ex) {
    console.error(ex);
  }
})();
