var BN = require('bignumber.js');
var axios = require('axios')
var crypto = require('crypto');

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

const main = async () => {
    const market = await axios.request({
        url: `https://ftx.com/api/markets/BTC/USDT`,
        method: 'get',
    })

    console.log(market.data.result.price)
    const currentPrice = market.data.result.price
    const priceDp = 1
    const sizeDp = 4
    const feeRate = 0.0002

    const invested = 100 // quote
    const upperBound = 22000
    const lowerBound = 18000
    const grids = 5
    const type = 'geometric' // geometric or arithmetric

    let priceGrid = []
    let profitGrid = ''

    if (type === 'arithmetric') {
        const diff = new BN(upperBound - lowerBound).div(grids)
        priceGrid = Array.apply(null, Array(grids + 1)).map((x, i) => {
            return new BN(lowerBound).plus(diff.times(i)).dp(priceDp);
        })
        const minProfit = new BN(upperBound).div(new BN(upperBound).minus(diff)).minus(1).times(100).toFormat(2)
        const maxProsit = diff.div(lowerBound).times(100).toFormat(2)
        profitGrid = `${minProfit}% ~ ${maxProsit}%`
    } else {
        // geometric
        const ratio = new BN(Math.pow(upperBound / lowerBound, 1 / grids))
        priceGrid = Array.apply(null, Array(grids + 1)).map((x, i) => {
            return new BN(lowerBound).times(ratio.pow(i)).dp(priceDp);
        })
        profitGrid = `${new BN(ratio).minus(1).times(100).toFormat(2)}%`
    }

    console.log('price/grid:', priceGrid.map(v => v.toNumber()), 'profit/grid:', profitGrid)

    const sizeGrid = invested / (grids + 1);

    const basePrepare = priceGrid.filter(v => v > currentPrice).map(v => {
        return new BN(sizeGrid).div(v).div(1 - feeRate).dp(sizeDp, 0)
    }).reduce(
        (prev, current) => new BN(prev).plus(current),
        0
    ).toNumber()

    // todo: buy base with market order
    // const marketOrderBody = {
    //     "market": "BTC/USDT",
    //     "side": "buy",
    //     "price": null,
    //     "type": "market",
    //     "size": basePrepare,
    // }

    // await axios.request({
    //     url: `https://ftx.com/api/orders`,
    //     method: 'post',
    //     headers: authRequestHeaders('POST', '/orders', marketOrderBody),
    //     data: marketOrderBody
    // })

    // todo: quoteLeft should use the real balance from ftx api
    const balance = await axios.request({
        url: `https://ftx.com/api/wallet/balances`,
        method: 'get',
        headers: authRequestHeaders('GET', '/wallet/balances'),
    })
    console.log(balance.data.result.find(v => v.coin === 'USDT'))
    const quoteLeft = new BN(balance.data.result.find(v => v.coin === 'USDT').free)
    const numBid = priceGrid.filter(v => v < currentPrice).length
    console.log('size/grid:', sizeGrid, 'need base:', basePrepare, 'size/grid/bid:', quoteLeft.div(numBid).toNumber())


    // todo: place orders
    await Promise.all(priceGrid.map(async v => {
        const endpoint = '/orders'

        if (v > currentPrice) {
            const body = {
                "market": "BTC/USDT",
                "side": "sell",
                "price": v.toNumber(),
                "type": "limit",
                "size": new BN(sizeGrid).div(v).div(1 - feeRate).dp(sizeDp, 0).toNumber(),
                "postOnly": true,
            }

            await axios.request({
                url: `https://ftx.com/api${endpoint}`,
                method: 'post',
                headers: authRequestHeaders('POST', endpoint, body),
                data: body
            })
        }

        if (v < currentPrice) {
            const body = {
                "market": "BTC/USDT",
                "side": "buy",
                "price": v.toNumber(),
                "type": "limit",
                "size": quoteLeft.div(numBid).div(v).dp(sizeDp, 1).toNumber(),
                "postOnly": true,
            }

            await axios.request({
                url: `https://ftx.com/api${endpoint}`,
                method: 'post',
                headers: authRequestHeaders('POST', endpoint, body),
                data: body
            })
        }
    }))

    console.log('done')
}

main()