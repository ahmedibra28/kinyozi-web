import axios from 'axios'

interface sendSMSResponseProp {
  responses: {
    'response-code': number
    'response-description': string
    mobile: number
    messageid: string
    networkid: number
  }[]
}

interface checkSMSBalanceResponseProp {
  'response-code': number
  credit: string
  'partner-id': number
}

const { SMS_URL, SMS_API_KEY, SMS_SHORT_CODE, SMS_PARTNER_ID } =
  process.env as any

export const sendSMS = async (mobile: string, message: string) => {
  const { data } = await axios.get(
    `${SMS_URL}/sendsms/?apikey=${SMS_API_KEY}&partnerID=${SMS_PARTNER_ID}&message=${message}&shortcode=${SMS_SHORT_CODE}&mobile=${mobile}`
  )

  return data as sendSMSResponseProp
}

export const checkSMSBalance = async () => {
  const { data } = await axios.get(
    `${SMS_URL}/getbalance/?apikey=${SMS_API_KEY}&partnerID=${SMS_PARTNER_ID}`
  )

  return data as checkSMSBalanceResponseProp
}
