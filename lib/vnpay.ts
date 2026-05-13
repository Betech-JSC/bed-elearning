import crypto from "crypto"
import { format } from "date-fns"

export function createVNPayUrl({
  amount,
  orderId,
  ipAddr,
  returnUrl
}: {
  amount: number
  orderId: string
  ipAddr: string
  returnUrl: string
}) {
  const tmnCode = process.env.VNPAY_TMN_CODE!
  const secretKey = process.env.VNPAY_HASH_SECRET!
  let vnpUrl = process.env.VNPAY_URL!
  
  const date = new Date()
  const createDate = format(date, "yyyyMMddHHmmss")
  
  let vnp_Params: any = {}
  vnp_Params['vnp_Version'] = '2.1.0'
  vnp_Params['vnp_Command'] = 'pay'
  vnp_Params['vnp_TmnCode'] = tmnCode
  vnp_Params['vnp_Locale'] = 'vn'
  vnp_Params['vnp_CurrCode'] = 'VND'
  vnp_Params['vnp_TxnRef'] = orderId
  vnp_Params['vnp_OrderInfo'] = 'Thanh toan don hang ' + orderId
  vnp_Params['vnp_OrderType'] = 'other'
  vnp_Params['vnp_Amount'] = amount * 100
  vnp_Params['vnp_ReturnUrl'] = returnUrl
  vnp_Params['vnp_IpAddr'] = ipAddr
  vnp_Params['vnp_CreateDate'] = createDate

  vnp_Params = sortObject(vnp_Params)

  const signData = new URLSearchParams(vnp_Params).toString()
  const hmac = crypto.createHmac("sha512", secretKey)
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex")
  vnp_Params['vnp_SecureHash'] = signed
  
  vnpUrl += '?' + new URLSearchParams(vnp_Params).toString()
  return vnpUrl
}

export function verifyVNPayHash(params: any) {
  const secretKey = process.env.VNPAY_HASH_SECRET!
  const secureHash = params['vnp_SecureHash']

  delete params['vnp_SecureHash']
  delete params['vnp_SecureHashType']

  const sortedParams = sortObject(params)
  const signData = new URLSearchParams(sortedParams).toString()
  const hmac = crypto.createHmac("sha512", secretKey)
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex")

  return secureHash === signed
}

function sortObject(obj: any) {
  const sorted: any = {}
  const keys = Object.keys(obj).sort()
  keys.forEach(key => {
    sorted[key] = obj[key]
  })
  return sorted
}
