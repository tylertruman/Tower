import { AppState } from "../AppState"
import { logger } from "../utils/Logger"
import { server } from "./AxiosService"


class TicketsService{
  async create(newTicket){
    const res = await server.post('api/tickets', newTicket)
    logger.log('Create Ticket', res.data)
    AppState.ticketProfiles.push(res.data)
  }
  async getTicketProfiles(eventId){
    const res = await server.get(`api/events/${eventId}/tickets`)
    logger.log('Get Ticket Profiles', res.data)
    AppState.ticketProfiles = res.data
  }
  async sellTicket(ticketId){
    const res = await server.delete('api/tickets/'+ticketId)
    logger.log('Sell Ticket', res.data)
    AppState.ticketProfiles = AppState.ticketProfiles.filter(t => t.id != ticketId)
  }
  async getTicketsByAccount(){
    const res = await server.get('account/tickets')
    logger.log('Get Tickets By Account', res.data)
    AppState.accountTickets = res.data
  }
}

export const ticketsService = new TicketsService()