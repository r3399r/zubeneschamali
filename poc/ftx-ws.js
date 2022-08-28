const WebSocket = require('ws')
var crypto = require('crypto');

const link = 'wss://ftx.com/ws/'

function onOpen() {
    console.log('on open')
    ws.send(JSON.stringify({
        op: 'ping'
    }))
    setInterval(() => {
        ws.send(JSON.stringify({
            op: 'ping'
        }))
    }, 30000)
    const ts = Date.now()
    const message = `${ts}websocket_login`
    var sha256 = crypto.createHmac('sha256', '<secret>').update(message).digest("hex");
    ws.send(JSON.stringify({
        op: 'login',
        args: {
            key: "<key>",
            sign: sha256,
            time: ts,
        }
    }))
    ws.send(JSON.stringify({
        op: 'subscribe',
        channel: 'orders'
    }))
}

function onClose() {
    console.log('on close')
}

function onError() {
    console.log('on error')
}

function start() {
    ws.on('open', onOpen)
        .on('close', onClose)
        .on('error', onError)
        .on('message', (message) => {
            const res = JSON.parse(message)
            console.log(res)
        })

}

const ws = new WebSocket(link)
start()