const io = require('socket.io-client');
const http = require('http');
const { Server } = require('socket.io');
const express = require('express');
const cors = require('cors');

describe('Socket.io Integration Test', () => {
    let ioServer, server, clientSocket;
    const PORT = 3001;

    beforeAll((done) => {
        const app = express();
        app.use(cors());
        server = http.createServer(app);
        ioServer = new Server(server, {
            cors: { origin: "*" }
        });
        server.listen(PORT, () => {
            done();
        });
    });

    afterAll((done) => {
        ioServer.close();
        server.close();
        done();
    });

    test('should connect to the server', (done) => {
        clientSocket = io(`http://localhost:${PORT}`);
        clientSocket.on('connect', () => {
            expect(clientSocket.connected).toBe(true);
            clientSocket.disconnect();
            done();
        });
    });
});
