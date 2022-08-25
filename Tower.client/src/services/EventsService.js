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
  }
}

export const eventsService = new EventsService()