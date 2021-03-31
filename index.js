const WebSocketServer = require("ws").Server;
const watch = require("node-watch");
const http = require('http');
const fs = require("fs");

const clientScript = fs.readFileSync("client-script.js", "utf8");

module.exports.cli = function (args) {
    const directories = args.slice(2);

    if (directories.length == 0) {
        console.log("No directories to watch where specified. They are supposed to be specified as arguments");
        return;
    }

    const server = http.createServer(function (req, res) {
        if (req.url == "/client-script.js") {
            res.writeHead(200, { 'Content-Type': 'application/javascript' });
            res.write(clientScript);
            res.end();
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.write("404 Not Found");
            res.end();
        }
    });

    server.listen(9731);

    const ws = new WebSocketServer({ server });

    console.log("Started live reload server. Watching directories:", directories.join(", "));

    const connections = new Set;
    ws.on("connection", conn => {
        connections.add(conn);

        conn.on("close", () => connections.delete(conn));
    });

    directories.forEach(directory => {
        watch(directory, { recursive: true }, (event, name) => {
            // Check if the dir starts with a dot
            if (name.split("\\").some(dir => dir[0] == "."))
                return;

            const changedFile = name.split("\\")[name.split("\\").length - 1];
            const cssChanged = changedFile.endsWith(".css");

            console.log("Change detected in '%s', Reloading", name);

            connections.forEach(conn => {
                conn.send(cssChanged ? "refreshcss" : "refresh");
            });
        });
    });
}