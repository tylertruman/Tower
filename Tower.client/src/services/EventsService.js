import { AppState } from "../AppState"
import { logger } from "../utils/Logger"
import { server } from "./AxiosService"


class EventsService{
  async getAll(){
    const res = await server.get('api/events')
    logger.log('Getting all events', res.data)
    AppState.events = res.data
  }

  async getById(id){
    const res = await server.get('api/events/'+id)
    logger.log('Get Event By Id', res.data)
    AppState.activeEvent = res.data
  }

  async createEvent(newEvent){
    const res = await server.post('api/events', newEvent)
    logger.log('Create Event', res.data)
    AppState.events.unshift(res.data)
    return res.data
  }
  async cancelEvent(eventId){
    const res = await server.delete('api/events/'+eventId)
    logger.log('Cancel Event', res.data)
    return res.data
  }
}

export const eventsService = new EventsService()