import { Schema } from "mongoose";

const ObjectId = Schema.Types.ObjectId

export const EventSchema = new Schema({
  name: {type: String, required: true, minlength: 1, maxlength: 50},
  description: {type: String, required: true, minlength: 2, maxlength: 1000},
  coverImg: {type: String, required: true, minlength: 3, maxlength: 250},
  location: {type: String, required: true, minlength: 3, maxlength: 35},
  capacity: {type: Number, required: true, min: 0, max: 1000},
  // NOTE hopefully vvvv this works, if not figure it out... ASK IF I NEED MIN AND MAX ON HERE AND HOW TO DO IT
  startDate: {type: Date, required: true},
  type: {type: String, enum: ['concert', 'convention', 'sport', 'digital'], required: true, default: 'concert', lowercase: true},
  isCanceled: {type: Boolean, required: true, default: false},
  creatorId: {type: ObjectId, required: true, ref: 'Account'}
  },
  {timestamps: true, toJSON: {virtuals: true}}
)

EventSchema.virtual('creator', {
  localField: 'creatorId',
  foreignField: '_id',
  ref: 'Account',
  justOne: true
})