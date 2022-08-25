import { AppState } from '../AppState'
import { logger } from '../utils/Logger'
import { server } from './AxiosService'

class AccountService {
  async getAccount() {
    try {
      const res = await server.get('/account')
      AppState.account = res.data
    } catch (err) {
      logger.error('HAVE YOU STARTED YOUR SERVER YET???', err)
    }
  }
  async getAccountTickets(){
    const res = await server.get('/account/tickets')
    AppState.accountTickets = res.data
    logger.error('Account Tickets', res.data)
  }
}

export const accountService = new AccountService()
