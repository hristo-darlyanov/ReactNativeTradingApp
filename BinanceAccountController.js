import CryptoJS from 'crypto-js';

const baseConfig = {
    API_KEY: '',
    API_SECRET: '',
    HOST_URL: 'https://testnet.binancefuture.com',
}

export async function AccountInformationFutures(apiKey = baseConfig.API_KEY, apiSecret = baseConfig.API_SECRET) {
    const endPoint = '/fapi/v2/account'
    const dataQuery = 'timestamp=' + Date.now()
    const signedHashKey = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA256(dataQuery, apiSecret))
    const response = await fetch(baseConfig.HOST_URL + endPoint + "?" + dataQuery + "&signature=" + signedHashKey, {
        method: 'GET',
        headers: {
            'X-MBX-APIKEY': apiKey
        }
    })

    return data = await response.json()
}

export async function PositionInformationFutures(apiKey = baseConfig.API_KEY, apiSecret = baseConfig.API_SECRET) {
    const endPoint = '/fapi/v2/positionRisk'
    const dataQuery = 'timestamp=' + Date.now()
    const signedHashKey = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA256(dataQuery, apiSecret))
    const response = await fetch(baseConfig.HOST_URL + endPoint + "?" + dataQuery + "&signature=" + signedHashKey, {
        method: 'GET',
        headers: {
            'X-MBX-APIKEY': apiKey
        }
    })

    return data = await response.json()
}

export async function GetKlines(symbol = "BTCUSDT", interval = "1d", limit = 30) {
    const endPoint = '/fapi/v1/markPriceKlines'
    const dataQuery = 'symbol=' + symbol + "&interval=" + interval + "&limit=" + limit
    const response = await fetch(baseConfig.HOST_URL + endPoint + "?" + dataQuery, {
        method: 'GET',
    })

    return data = await response.json()
}

export async function OrdersInformationFutures(apiKey = baseConfig.API_KEY, apiSecret = baseConfig.API_SECRET, orderId, symbol = "BTCUSDT") {
    const endPoint = '/fapi/v1/allOrders'
    const dataQuery = 'timestamp=' + Date.now() + "&symbol=" + symbol + "&orderId=" + orderId
    const signedHashKey = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA256(dataQuery, apiSecret))
    const response = await fetch(baseConfig.HOST_URL + endPoint + "?" + dataQuery + "&signature=" + signedHashKey, {
        method: 'GET',
        headers: {
            'X-MBX-APIKEY': apiKey
        }
    })

    return data = await response.json()
}

export async function NewOrderFutures(quantity, side, apiKey = baseConfig.API_KEY, apiSecret = baseConfig.API_SECRET) {
    const endPoint = '/fapi/v1/order'
    const dataQuery = `timestamp=${Date.now()}&symbol=BTCUSDT&side=${side}&type=MARKET&quantity=${quantity}`
    const signedHashKey = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA256(dataQuery, apiSecret))
    const response = await fetch(baseConfig.HOST_URL + endPoint + "?" + dataQuery + "&signature=" + signedHashKey, {
        method: 'POST',
        headers: {
            'X-MBX-APIKEY': apiKey
        },
    })

    return data = await response.json()
}

export async function TradesInformationFutures(startTime, apiKey = baseConfig.API_KEY, apiSecret = baseConfig.API_SECRET, symbol="BTCUSDT") {
    const endPoint = '/fapi/v1/income'
    const dataQuery = 'timestamp=' + Date.now() + "&symbol=" + symbol + "&startTime=" + startTime + "&incomeType=REALIZED_PNL"
    const signedHashKey = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA256(dataQuery, apiSecret))
    const response = await fetch(baseConfig.HOST_URL + endPoint + "?" + dataQuery + "&signature=" + signedHashKey, {
        method: 'GET',
        headers: {
            'X-MBX-APIKEY': apiKey
        }
    })

    return data = await response.json()
}