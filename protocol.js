import WSCall from "./WSCall.js";
import JPCProtocol from "jpc-core/protocol.js";
import WebSocketNode from "ws";
import { assert } from "jpc-core/util.js";

/**
 * Wire protocol API
 */
export default class JPCWebSocket extends JPCProtocol {
  /**
   * @param startObject {Object} Will be returned to client in "start" function
   */
  constructor(startObject) {
    super(startObject);
    this._wsCall = null;
  }

  /**
   * Call one of init() or listen() or connect() before calling any of the other functions.
   */
  async init(webSocket) {
    this._wsCall = new WSCall(webSocket);
    super.init();
  }

  /**
   * Creates a WebSocket server.
   *
   * Attention: This class currently cannot deal with
   * multiple clients connecting.
   *
   * @param secret {string} passcode that the client must send to be able to connect
   *    TODO implement this
   * @param port {Integer} Between 1024 and 65535
   * @param openPublic {boolean} (optional, default false)
   *   If true, allow other computers from the network to connect.
   *   If false, allow only applications on the local host to connect.
   */
  async listen(secret, port, openPublic) {
    assert(typeof (secret) == "string", "Need secret key");
    assert(typeof (port) == "number", "Need port");
    let host = openPublic ? '0.0.0.0' : '127.0.0.1'; // XXX what about IPv6?
    let server = new WebSocketNode.Server({ host: host, port: port });
    return new Promise((resolve, reject) => {
      server.on("listening", resolve);
      server.on("connection", async webSocket => {
        try {
          await this.init(webSocket);
        } catch (ex) {
          console.log(ex);
        }
      });
    });
  }

  /**
   * Connects to a WebSocket server.
   *
   * @param secret {string} passcode that the server expects to allow connections
   * @param hostname {string} Optional, default localhost
   * @param port {Integer} Between 1024 and 65535
   */
  async connect(secret, hostname, port) {
    assert(typeof (secret) == "string", "Need secret key");
    assert(typeof (port) == "number", "Need port");
    assert(!hostname || typeof (hostname) == "string", "Invalid hostname");
    hostname = hostname || "localhost";
    let url = `ws://${hostname}:${port}`;
    let webSocket;
    if (typeof WebSocket == "function") { // browser
      webSocket = new WebSocket(url);
      webSocket.on = (eventName, func) => {
        webSocket.addEventListener(eventName, func, false);
      };
    } else { // node.js
      webSocket = new WebSocketNode(url);
    }
    return new Promise((resolve, reject) => {
      // Open a network connection to the WebSocket server
      webSocket.on("open", async () => {
        try {
          await this.init(webSocket);
          resolve();
        } catch (ex) {
          reject(ex);
        }
      });
    });
  }

  /**
   * Incoming calls.
   * Implements the wire protocol.
   *
   * @param method {string} the message name, e.g. "func", "get", etc.
   * @param listener {async function(payload {JSON}}
   * What the listener function returns is sent back as result to the caller.
   * If listener throws, sends the error message to the caller at the remote end.
   */
  registerIncomingCall(method, listener) {
    this._wsCall.register(method, listener);
  }

  /**
   * Outgoing calls.
   * Implements the wire protocol.
   *
   * @param method {string} the message name, e.g. "func", "get" etc.
   * @param payload {JSON} see value in PROTOCOL.md
   * @returns {any} see value in PROTOCOL.md
   *   The payload of the corresponding answer.
   * @throws {Error} if:
   *   - the remote end threw an exception
   *   - the connection disappeared
   */
  async callRemote(method, payload) {
    return this._wsCall.makeCall(method, payload);
  }
}
