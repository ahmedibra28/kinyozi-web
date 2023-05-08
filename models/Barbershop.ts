import { Schema, model, models } from 'mongoose'
import User, { IUser } from './User'

export interface IBarbershop {
  _id: Schema.Types.ObjectId
  barbershop: IUser
  barbers: [
    {
      barber: IUser
      status: 'active' | 'from barbershop' | 'from barber'
    }
  ]
  createdAt?: Date
}

const barbershopSchema = new Schema<IBarbershop>(
  {
    barbershop: { type: Schema.Types.ObjectId, ref: User },
    barbers: [
      {
        barber: { type: Schema.Types.ObjectId, ref: User },
        status: { type: String, default: 'active' },
      },
    ],
  },
  { timestamps: true }
)

const Barbershop = models.Barbershop || model('Barbershop', barbershopSchema)

export default Barbershop
