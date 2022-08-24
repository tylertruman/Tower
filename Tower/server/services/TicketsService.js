import { dbContext } from "../db/DbContext";
import { BadRequest, Forbidden } from "../utils/Errors";
import { eventsService } from "./EventsService";


class TicketsService{
  // I think I need to find a way to decrease event capacity here vvv
  async create(newTicket){
   const event = await dbContext.Events.findById(newTicket.eventId)
   if(!event){
    throw new BadRequest("Invalid Event ID")
   }
   if (event.capacity == 0) {
    throw new BadRequest("There are no more spots")
   }
   // @ts-ignore
   event.capacity -=1
   const ticket = await dbContext.Tickets.create(newTicket)
   await ticket.populate('event')
   await ticket.populate('profile', 'name picture')
   await event.save()
   // const event = await dbContext.Events.findById(newTicket.event.id == event.id)
   // event.capacity -1
    // const event = await dbContext.Events.findOne( newTicket.event.id == event.id)
    // ticket.event.capacity -1
    // newTicket.event.capacity --
    // ticket.event.capacity -1
    return ticket
  }

  async remove(ticketId, userId){
    const ticket = await dbContext.Tickets.findById(ticketId)
    if(!ticket){
      throw new BadRequest('No ticket found under that id')
    }
    if(ticket.accountId.toString() != userId){
      throw new Forbidden('You do not have permission to remove this ticket')
    }
    const event = await dbContext.Events.findById(ticket.eventId)
    if(!event){
      throw new BadRequest("Invalid Event ID")
     }
    await ticket.remove()
   // @ts-ignore
   event.capacity += 1
   await event.save()
    return `ticket removed`
  }

  async getMyTickets(accountId){
    let tickets = await dbContext.Tickets.find({accountId}).populate('event')
    return tickets
  }

  async getAll(eventId){
    const tickets = await dbContext.Tickets.find({eventId}).populate('profile', 'name picture')
    return tickets
  }
}

export const ticketsService = new TicketsService()