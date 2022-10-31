import { createMiddleware } from "rakkasjs/node-adapter";
import hattipHandler from "./entry-hattip";
import { Server as SocketServer } from "socket.io";
import viteDevServer from "@vavite/expose-vite-dev-server/vite-dev-server";

const listener = createMiddleware(hattipHandler);
const socketServer = new SocketServer();

socketServer.on("connection", (socket) => {
  console.log("Socket connected");
  socket.on("chat message", (msg) => {
    console.log("message: " + msg);
    socketServer.emit("chat message", msg);
  });
});

if (viteDevServer) {
  socketServer.attach(viteDevServer!.httpServer!);
} else {
  // HACK
  // Rakkas doesn't expose the HTTP server yet, so we will create
  // it ourselves in a custom entry and expose it in global.__PRODUCTION_SERVER__
  // so we can attach the socket server to it.
  socketServer.attach((global as any).__PRODUCTION_SERVER__);
}

export default listener;
