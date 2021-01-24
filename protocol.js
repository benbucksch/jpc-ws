import { WSCall } from "./WSCall";
import { JPCProtocol } from "jpc/protocol";
import { start as jpcStart } from "jpc/obj";
import { assert } from "jpc/util";

/***************************************
 * Wire protocol API
 */
class JPCWS extends JPCProtocol {
  /**
   * @param webSocket {WebSocket}
   */
  constructor(webSocket) {
    super();
    this.socket = new WSCall(webSocket);
  }

  /**
   * Call this before calling any of the other functions.
   */
  async init() {
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
    this.socket.register(method, listener);
  }

  /**
   * Outgoing calls.
   * Implements the wire protocol.
   *
   * @param method {string} the message name, e.g. "func", "get" etc.
   * @param responseMethod {string} (optional)
   *    if given, wait for the remote side to respond with this method,
   *    and return the payload of `responseMethod`.
   * @param payload {JSON} see value in PROTOCOL.md
   * @returns {any} see value in PROTOCOL.md
   *   The payload of the corresponding `responseMethod` answer.
   *   If `responseMethod` is not given, returns null/undefined.
   * @throws {Error} if:
   *   - the remote end threw an exception
   *   - the connection disappeared
   */
  async callRemote(method, responseMethod, payload) {
    if (responseMethod) {
      return await this.socket.makeCall(method, payload);
    } else {
      this.socket.makeCall(method, payload).catch(console.error);
    }
  }
}
