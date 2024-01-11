import axios from 'axios'
import { getEnvVariable } from './helpers'

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

const SMS_URL = getEnvVariable('SMS_URL')
const SMS_API_KEY = getEnvVariable('SMS_API_KEY')
const SMS_SHORT_CODE = getEnvVariable('SMS_SHORT_CODE')
const SMS_PARTNER_ID = getEnvVariable('SMS_PARTNER_ID')

export const sendSMS = async (mobile: string, message: string) => {
  try {
    const { data } = await axios.get(
      `${SMS_URL}/sendsms/?apikey=${SMS_API_KEY}&partnerID=${SMS_PARTNER_ID}&message=${message}&shortcode=${SMS_SHORT_CODE}&mobile=${mobile}`
    )

    if (data.responses[0]['response-code'] !== 200)
      throw {
        message: data.responses[0]['response-code'],
        status: data.responses[0]['response-code'] || 500,
      }

    return data as sendSMSResponseProp
  } catch (error: any) {
    throw {
      message: `Failed to send SMS: ${error.message}`,
      status: 500,
    }
  }
}

export const checkSMSBalance = async () => {
  const { data } = await axios.get(
    `${SMS_URL}/getbalance/?apikey=${SMS_API_KEY}&partnerID=${SMS_PARTNER_ID}`
  )

  return data as checkSMSBalanceResponseProp
}
