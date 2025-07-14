const net = require("net");

const host = "db.woaodjjaydphkyurlzkx.supabase.co";
const ports = [5432, 6543];

ports.forEach((port) => {
  const socket = new net.Socket();
  socket.setTimeout(3000);
  socket.on("connect", () => {
    console.log(`Port ${port} is OPEN`);
    socket.destroy();
  });
  socket.on("timeout", () => {
    console.log(`Port ${port} TIMED OUT`);
    socket.destroy();
  });
  socket.on("error", () => {
    console.log(`Port ${port} is CLOSED or unreachable`);
  });
  socket.connect(port, host);
});
