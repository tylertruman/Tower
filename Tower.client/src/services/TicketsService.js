import { AppState } from "../AppState"
import { logger } from "../utils/Logger"
import { server } from "./AxiosService"


class TicketsService{
  async create(newTicket){
    const res = await server.post('api/tickets', newTicket)
    AppState.ticketProfiles.push(res.data)
  }
  async getTicketProfiles(eventId){
    const res = await server.get(`api/events/${eventId}/tickets`)
    AppState.ticketProfiles = res.data
  }
  async sellTicket(ticketId){
    const res = await server.delete('api/tickets/'+ticketId)
    AppState.ticketProfiles = AppState.ticketProfiles.filter(t => t.id != ticketId)
  }
  async getTicketsByAccount(){
    const res = await server.get('account/tickets')
    AppState.accountTickets = res.data
  }
}

export const ticketsService = new TicketsService()