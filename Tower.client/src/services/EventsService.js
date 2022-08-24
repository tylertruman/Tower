import { AppState } from "../AppState"
import { logger } from "../utils/Logger"
import { server } from "./AxiosService"


class EventsService{
  async getAll(){
    const res = await server.get('api/events')
    logger.log('Getting all events', res.data)
    AppState.events = res.data
  }
}

export const eventsService = new EventsService()