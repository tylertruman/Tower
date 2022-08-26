import { AppState } from "../AppState"
import { logger } from "../utils/Logger"
import { server } from "./AxiosService"


class EventsService{
  async getAll(){
    const res = await server.get('api/events')
    AppState.events = res.data
  }

  async getById(id){
    const res = await server.get('api/events/'+id)
    AppState.activeEvent = res.data
  }

  async createEvent(newEvent){
    const res = await server.post('api/events', newEvent)
    AppState.events.unshift(res.data)
    return res.data
  }
  async cancelEvent(eventId){
    const res = await server.delete('api/events/'+eventId)
    return res.data
  }
}

export const eventsService = new EventsService()