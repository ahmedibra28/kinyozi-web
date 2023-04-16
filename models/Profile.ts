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
  favoriteBarber?: string

  rating?: {
    average: number
    count: number
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
    favoriteBarber: String,

    rating: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: User,
    },
  },
  { timestamps: true }
)

const Profile = models.Profile || model('Profile', profileSchema)

export default Profile
