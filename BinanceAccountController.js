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
        type: 'GET',
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
        type: 'GET',
        headers: {
            'X-MBX-APIKEY': apiKey
        }
    })

    return data = await response.json()
}