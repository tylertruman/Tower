import { BadRequest, Forbidden } from "../utils/Errors"
import { dbContext } from "../db/DbContext"
import { accountService } from "./AccountService"

class EventsService{
  async getAll(){
    const events = await dbContext.Events.find().sort({createdAt: -1}).populate('creator', 'name picture')
    return events
  }

  async getById(id){
    const event = await dbContext.Events.findById(id).populate('creator', 'name picture')
    if(!event){
      throw new BadRequest('No event found with that id')
    }
    return event
  }

  async create(newEvent){
    const event = await dbContext.Events.create(newEvent)
    await event.populate('creator', 'name picture')
    return event
  }
// NOTE THIS MIGHT NOT WORK, MIGHT NEED HELP...
  async edit(id, eventData, userId){
    const event = await this.getById(id)
    if(event.isCanceled == true){
      throw new BadRequest("You can't edit events that have been canceled!")
    }
    if(event.creatorId.toString() != userId){
      throw new Forbidden("You don't have permission to edit this event!")
    }
    // NOTE this doesn't work, ask if I need to have a bodyguard here.
    // if(event.creatorId.toString() != userId){
    //   throw new Forbidden("You don't have permission to edit this event!")
    // }
    event.name = eventData.name || event.name
    event.description = eventData.description || event.description
    event.coverImg = eventData.coverImg || event.coverImg
    event.location = eventData.location || event.location
    event.capacity = eventData.capacity || event.capacity
    event.startDate = eventData.startDate || event.startDate
    event.type = eventData.type || event.type
    // event.isCanceled = eventData.isCanceled || event.isCanceled
    await event.save()
    return event
  }

  async cancel(eventId, userId){
    const event = await this.getById(eventId)
    if(event.creatorId.toString() != userId){
      throw new Forbidden("You don't have permission to cancel this event!")
    }
    event.isCanceled = !event.isCanceled
    await event.save()
    return `${event.name} was canceled.`
  }
}

export const eventsService = new EventsService()