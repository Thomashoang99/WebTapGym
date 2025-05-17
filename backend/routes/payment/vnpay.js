require('dotenv').config();
const express    = require('express');
const router     = express.Router();
const Purchase   = require('../../models/Purchase');
const auth       = require('../../middleware/auth');
const create_VNPay = require('../../middleware/vnpay');

const { 
  VNPay, ignoreLogger, ProductCode, 
  VnpLocale, dateFormat } = require('vnpay');
const {
    IpnFailChecksum, IpnOrderNotFound, IpnInvalidAmount,
    InpOrderAlreadyConfirmed, IpnUnknownError, IpnSuccess
} = require('vnpay');
const vnpay = create_VNPay();

router.post('/create-payment-url', auth, async (req, res, next) => {
  try {
    const { programs, amount } = req.body;
    if (!programs?.length || !amount) {
      return res.status(400).json({ error: 'Missing programs or amount' });
    }
    const now = Date.now();
    const orderId = `GYM${now}`;


    const pendingPurchases = programs.map(p => ({
      user:       req.user._id,
      program:    p.id,
      itemPrice:  p.price,
      orderId:    orderId,
      status:     'pending',
      amount:     amount
    }));
    await Purchase.insertMany(pendingPurchases);

    const paymentUrl = vnpay.buildPaymentUrl({
        vnp_Amount: amount,
        vnp_IpAddr:
            req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.ip,
        vnp_TxnRef: orderId,
        vnp_OrderInfo: `Thanh toan don hang ${orderId}`,
        vnp_OrderType: ProductCode.Other,
        vnp_ReturnUrl: process.env.VNP_RETURN_URL, 
        vnp_Locale: VnpLocale.VN,
    });
    return res.json({
      success: true,
      paymentUrl,
      order: `GymSite Purchase ${orderId}`});
    }
    catch (err) {
      return res.status(500).json({
            success: false,
            message: 'Lỗi khi tạo đơn hàng',
            error: err.message,
        });
    }
});

router.get('/ipn', async (req, res) => {
  try {
    const verify = vnpay.verifyIpnCall(req.query);
        if (!verify.isVerified) {
            return res.json(IpnFailChecksum);
        }

        if (!verify.isSuccess) {
            return res.json(IpnUnknownError);
        }

        const purchase = await Purchase.findOne({ orderId: verify.vnp_TxnRef }); 

        if (!purchase || verify.vnp_TxnRef !== purchase.orderId) {
            return res.json(IpnOrderNotFound);
        }

        if (verify.vnp_Amount !== purchase.amount) {
            return res.json(IpnInvalidAmount);
        }

        if (purchase.status === 'completed') {
            return res.json(InpOrderAlreadyConfirmed);
        }

        return res.json(IpnSuccess);
  } catch (err) {
    res.json(vn);
  }
})

router.get('/return', async (req, res) => {
    const verify = vnpay.verifyReturnUrl(req.query);
    const txnRef = verify.vnp_TxnRef;
  try {
    if (!verify.isVerified){
      await Purchase.updateMany(
        { orderId: txnRef },
        { status: 'failed' }
      )
      return res.send('Integrity check failed');

    }
    if (!verify.isSuccess){
      await Purchase.updateMany(
        { orderId: txnRef },
        { status: 'failed' }
     )
      res.redirect('http://localhost:5173/programs?payment=failed');
    }
  } catch (err) {
    return res.send('Invalid data');
  }
              
    await Purchase.updateMany(
      { orderId: txnRef },
      { status: 'completed' }
    )
  return res.redirect('http://localhost:5173/programs?payment=success');
})
module.exports = router;


