const { VNPay, ignoreLogger } = require('vnpay');

function create_VNpay () {
        const vnpay = new VNPay({
        tmnCode: process.env.VNP_TMN_CODE,
        secureSecret: process.env.VNP_HASH_SECRET,
        vnpayHost: 'https://sandbox.vnpayment.vn',
        testMode: true, 
        hashAlgorithm: 'SHA512', 
        enableLog: true,
        loggerFn: ignoreLogger,
        endpoints: {
            paymentEndpoint: 'paymentv2/vpcpay.html',
            queryDrRefundEndpoint: 'merchant_webapi/api/transaction',
            getBankListEndpoint: 'qrpayauth/api/merchant/get_bank_list',
        },
    });
    return vnpay;
}

module.exports = create_VNpay;