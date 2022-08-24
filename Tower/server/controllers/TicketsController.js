import { Auth0Provider } from "@bcwdev/auth0provider";
import { ticketsService } from "../services/TicketsService";
import BaseController from "../utils/BaseController";


export class TicketsController extends BaseController{
  constructor(){
    super('api/tickets')
    this.router
    .use(Auth0Provider.getAuthorizedUserInfo)
    .post('', this.create)
    .delete('/:id', this.remove)
  }

  async create(req, res, next){
    try {
      req.body.accountId = req.userInfo.id
      let ticket = await ticketsService.create(req.body)
      return res.send(ticket)
    } catch (error) {
      next(error)
    }
  }

  async remove(req, res, next){
    try {
      const ticket = await ticketsService.remove(req.params.id, req.userInfo.id)
      return res.send(ticket)
    } catch (error) {
      next(error)
    }
  }
}