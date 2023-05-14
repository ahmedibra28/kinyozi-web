import { Schema, model, models } from 'mongoose'
import User from './User'
import { IProfile } from './Profile'

export interface IAppointment {
  _id: Schema.Types.ObjectId
  barber: IProfile
  barbershop: IProfile
  client: IProfile
  appointmentDate: Date
  appointmentTime: string
  specialty: string
  rating: number
  status: 'pending' | 'accepted' | 'rejected'
  start?: Date
  end?: Date
  completedService?: string
  amount?: number
  createdAt?: Date
}

const appointmentSchema = new Schema<IAppointment>(
  {
    barber: { type: Schema.Types.ObjectId, ref: User, required: true },
    barbershop: { type: Schema.Types.ObjectId, ref: User, required: true },
    client: { type: Schema.Types.ObjectId, ref: User, required: true },
    appointmentDate: { type: Date, required: true, index: true },
    appointmentTime: { type: String, required: true, index: true },
    specialty: { type: String, required: true },
    rating: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
    start: Date,
    end: Date,
    completedService: String,
    amount: Number,
  },
  { timestamps: true }
)

const Appointment =
  models.Appointment || model('Appointment', appointmentSchema)

export default Appointment
