import { Auth0Provider } from "@bcwdev/auth0provider";
import { commentsService } from "../services/CommentsService";
import { eventsService } from "../services/EventsService";
import { ticketsService } from "../services/TicketsService";
import BaseController from "../utils/BaseController";


export class EventsController extends BaseController{
  constructor(){
    super('api/events')
    this.router
    .get('', this.getAll)
    .get('/:id', this.getById)
    .get('/:id/comments', this.getCommentsByEventId)
    .get('/:id/tickets', this.getTicketsByEventId)
    .use(Auth0Provider.getAuthorizedUserInfo)
    .post('', this.create)
    .put('/:id', this.edit)
    .delete('/:id', this.cancel)
  }

  async getAll(req, res, next){
    try {
      const events = await eventsService.getAll()
      return res.send(events)
    } catch (error) {
      next(error)
    }
  }
  
  async getById(req, res, next){
    try {
      const event = await eventsService.getById(req.params.id)
      return res.send(event)
    } catch (error) {
      next(error)
    }
  }
  async getCommentsByEventId(req, res, next){
    try {
      const comments = await commentsService.getAll({eventId: req.params.id})
      return res.send(comments)
    } catch (error) {
      next(error)
    }
  }

  async getTicketsByEventId(req, res, next){
    try {
      const tickets = await ticketsService.getAll(req.params.id)
      return res.send(tickets)
    } catch (error) {
      next(error)
    }
  }


  async create(req, res, next){
    try {
      req.body.creatorId = req.userInfo.id
      const event = await eventsService.create(req.body)
      return res.send(event)
    } catch (error) {
      next(error)
    }
  }
// NOTE NO CLUE IF THIS WILL WORK, might have to ask for help
  async edit(req, res, next){
    try {
      const event = await eventsService.edit(req.params.id, req.body, req.userInfo.id)
      return res.send(event)
    } catch (error) {
      next(error)
    }
  }

  async cancel(req, res, next){
    try {
      const event = await eventsService.cancel(req.params.id, req.userInfo.id)
      return res.send(event)
    } catch (error) {
      next(error)
    }
  }
}