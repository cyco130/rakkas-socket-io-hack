import { startClient } from "rakkasjs";

import io from "socket.io-client";
export const socket = io();

console.log(socket);

startClient();
