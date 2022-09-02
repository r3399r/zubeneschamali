const WebSocket = require('ws')
var axios = require('axios')
var crypto = require('crypto');

const link = 'wss://ftx.com/ws/'

const authRequestHeaders = (method, endpoint, body) => {
    const ts = Date.now().toString()
    const message = body === undefined ? `${ts}${method}/api${endpoint}` : `${ts}${method}/api${endpoint}${JSON.stringify(body)}`
    const sha256 = crypto.createHmac('sha256', '<secret>').update(message).digest("hex");
    return {
        'FTX-KEY': '<key>',
        'FTX-TS': ts.toString(),
        'FTX-SIGN': sha256,
        'FTX-SUBACCOUNT': 'sub-test'
    }
}

async function placeOrder(data) {
    if (data.status !== 'closed' || data.filledSize !== data.size) return 'unfilled order';

    let body = {}
    if (data.side === 'buy') {
        body = {
            "market": "BTC/USDT",
            "side": "sell",
            "price": 20200,
            "type": "limit",
            "size": 0.0025,
            "postOnly": true,
        }
    } else if (data.side === 'sell') {
        body = {
            "market": "BTC/USDT",
            "side": "buy",
            "price": 20000,
            "type": "limit",
            "size": 0.0025,
            "postOnly": true,
        }
    } else return 'unexpected'

    const endpoint = '/orders'
    await axios.request({
        url: `https://ftx.com/api${endpoint}`,
        method: 'post',
        headers: authRequestHeaders('POST', endpoint, body),
        data: body
    })
    return 'successfully place order'
}

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
            subaccount: "sub-test"
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
            if (res.channel === 'orders' && res.type !== 'subscribed') placeOrder(res.data).then((res) => console.log(res))
        })

}

const ws = new WebSocket(link)
start()