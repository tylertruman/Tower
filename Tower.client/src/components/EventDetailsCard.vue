<template>
<div class="card elevation-1">
          <div v-if="!event.isCanceled && event.capacity >= 1" class="card-body">
            <div v-if="event.creatorId == account.id" class="text-center p-0 m-0">
              <button @click="cancelEvent" class="btn btn-warning mb-3" title="Cancel Event">Cancel Event</button>
            </div>
            <img class="img-fluid elevation-1 rounded" :src="event.coverImg" alt="event image">
            <p class="text-center mt-2">{{event.location}} - Tickets Available: {{event.capacity}}</p>
            <p class="text-center">{{event.type}} | {{new Date(event.startDate).toLocaleDateString('en-US', {
              month: 'short', day: 'numeric'
            })}}</p>
            <p>{{event.description}}</p>
            <div v-if="!hasTicket" class="text-center">
            <button class="btn btn-primary" @click="buyTicket" title="Buy Ticket">Buy Ticket</button>
            </div>
            <div v-else class="text-center">
            <button class="btn btn-danger" @click="sellTicket" title="Sell Ticket">Sell Ticket</button>
            </div>
          </div>
          <div v-if="event.isCanceled" class="card-body">
            <img class="img-fluid canceled-img elevation-1 rounded" :src="event.coverImg" alt="event image">
            <p class="text-center mt-2 text-decoration-line-through">{{event.location}} - Tickets Available: {{event.capacity}}</p>
            <p class="text-center text-decoration-line-through">{{event.type}} | {{new Date(event.startDate).toLocaleDateString('en-US', {
              month: 'short', day: 'numeric'
            })}}</p>
            <p class="text-decoration-line-through">{{event.description}}</p>
            <p class="text-center"><strong class="text-danger">Canceled</strong></p>
          </div>
          <div v-if="event.capacity == 0" class="card-body">
            <img class="img-fluid canceled-img elevation-1 rounded" :src="event.coverImg" alt="event image">
            <p class="text-center mt-2">{{event.location}} - Tickets Available: {{event.capacity}}</p>
            <p class="text-center">{{event.type}} | {{new Date(event.startDate).toLocaleDateString('en-US', {
              month: 'short', day: 'numeric'
            })}}</p>
            <p class="">{{event.description}}</p>
            <p class="text-center"><strong class="text-danger">Sold Out</strong></p>
          </div>
        </div>
</template>

<script>
import { computed } from 'vue';
import { AppState } from '../AppState';
import { eventsService } from '../services/EventsService';
import { ticketsService } from '../services/TicketsService';
import { logger } from '../utils/Logger';
import Pop from '../utils/Pop';

export default {
setup() {
  return {
    account: computed(() => AppState.account),
    event: computed(() => AppState.activeEvent),
    hasTicket: computed(() => {
      if (AppState.ticketProfiles.find(t => t.accountId == AppState.account.id)) {
        return true;
      }
        return false;
    }),
    async buyTicket() {
      try {
        if(!AppState.account.id){
          throw new Error('You must be signed in to buy a ticket')
        }
        let newTicket = {
          eventId: AppState.activeEvent.id,
          accountId: AppState.account.id
        };
        await ticketsService.create(newTicket);
        AppState.activeEvent.capacity--;
        Pop.success('Ticket Purchase Successful')
        }
      catch (error) {
        logger.error("[Buying Ticket]", error);
        Pop.error(error);
        }
    },
    async sellTicket() {
      try {
        let ticketToSell = AppState.ticketProfiles.find(t => t.accountId == AppState.account.id);
        await ticketsService.sellTicket(ticketToSell.id);
        AppState.activeEvent.capacity++;
        Pop.success('Ticket Sale Successful')
        }
      catch (error) {
        logger.error("[Selling Ticket]", error);
        Pop.error(error);
      }
    },
    async cancelEvent(){
      try {
        let event = AppState.activeEvent
        await eventsService.cancelEvent(event.id)
        AppState.activeEvent.isCanceled = true
        Pop.success('Event Cancellation Successful')
      } catch (error) {
        logger.error('[Cancelling Event]', error)
        Pop.error(error)
      }
    }
  };
},
};
</script>

<style>
.canceled-img{
  filter: blur(6px);
}
</style>