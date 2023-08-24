import { Schema, model, models } from 'mongoose'
import User from './User'

export interface IProfile {
  _id: Schema.Types.ObjectId
  name?: string
  image?: string
  address?: string
  mobile?: number
  bio?: string
  user: Schema.Types.ObjectId
  numberOfTimes?: number
  favorite?: string

  city?: string
  street?: string
  country?: string
  numberOfBarbers?: number
  role: 'CLIENT' | 'BARBER' | 'BARBER_SHOP'

  rating?: {
    average: number
    count: number
  }

  businessHours?: [
    {
      day: string
      hours: string[]
    }
  ]
  settings?: {
    pushToken: string
  }

  createdAt?: Date
}

const profileSchema = new Schema<IProfile>(
  {
    name: String,
    image: String,
    address: String,
    mobile: Number,
    bio: String,
    numberOfTimes: Number,
    favorite: String,
    role: { type: String, required: true },

    city: String,
    street: String,
    country: { type: String, default: 'Kenya' },
    numberOfBarbers: Number,

    rating: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },

    businessHours: [
      {
        day: String,
        hours: [String],
      },
    ],

    user: {
      type: Schema.Types.ObjectId,
      ref: User,
    },

    settings: {
      pushToken: String,
    },
  },
  { timestamps: true }
)

const Profile = models.Profile || model('Profile', profileSchema)

export default Profile
