var BN = require('bignumber.js');

const main = () => {
    const currentPrice = 1493
    const priceDp = 1
    const sizeDp = 3
    const feeRate = 0.0002

    const invested = 100 // quote
    const upperBound = 1600
    const lowerBound = 1200
    const grids = 9
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
    console.log({
        side: 'buy',
        type: 'market',
        size: basePrepare,
        price: null,
    })

    // todo: quoteLeft should use the real balance from ftx api
    const quoteLeft = new BN(invested).minus(new BN(basePrepare).times(currentPrice))
    const numBid = priceGrid.filter(v => v < currentPrice).length
    console.log('size/grid:', sizeGrid, 'need base:', basePrepare, 'size/grid/bid:', quoteLeft.div(numBid).toNumber())


    // todo: place orders
    console.log(priceGrid.map(v => {
        if (v > currentPrice)
            return {
                side: 'sell',
                type:'limit',
                size: new BN(sizeGrid).div(v).div(1 - feeRate).dp(sizeDp, 0).toNumber(),
                price: v.toNumber(),
                "postOnly": true,
            }
        if (v < currentPrice)
            return {
                side: "buy",
                type:'limit',
                size: quoteLeft.div(numBid).div(v).dp(sizeDp, 1).toNumber(),
                price: v.toNumber(),
                "postOnly": true,
            }
        return 'do nothing'
    }))
}

main()