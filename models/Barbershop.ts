import { Schema, model, models } from 'mongoose'

export interface IBarbershop {
  _id: Schema.Types.ObjectId
  name: string
  image?: string
  address: string
  mobile: number
  country: string
  city: string
  district: string
  street: string
  createdAt?: Date
}

const barbershopSchema = new Schema<IBarbershop>(
  {
    name: { type: String, required: true },
    image: String,
    address: { type: String, required: true },
    mobile: { type: Number, required: true, unique: true },
    country: { type: String, required: true },
    city: { type: String, required: true },
    district: { type: String, required: true },
    street: { type: String, required: true },
  },
  { timestamps: true }
)

const Barbershop = models.Barbershop || model('Barbershop', barbershopSchema)

export default Barbershop
