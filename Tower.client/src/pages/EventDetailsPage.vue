<template>
  <div class="container-fluid">
    <section class="row">
      <div class="col-12">
        <h1 class="text-center my-2">{{event.name}}</h1>
      </div>
      <div class="col-12 col-md-6">
        <div class="card elevation-1">
          <div v-if="!event.isCanceled && event.capacity >= 1" class="card-body">
            <img class="img-fluid" :src="event.coverImg" alt="">
            <p>{{event.location}}</p>
            <p>{{event.type}}</p>
            <p>{{event.startDate}}</p>
            <p>{{event.description}}</p>
          </div>
          <div v-if="event.isCanceled" class="card-body">
            <img class="img-fluid canceled-img" :src="event.coverImg" alt="">
            <p class="text-decoration-line-through">{{event.location}}</p>
            <p class="text-decoration-line-through">{{event.type}}</p>
            <p class="text-decoration-line-through">{{event.startDate}}</p>
            <p class="text-decoration-line-through">{{event.description}}</p>
            <p><strong class="text-danger">Canceled</strong></p>
          </div>
          <div v-if="event.capacity == 0" class="card-body">
            <img class="img-fluid canceled-img" :src="event.coverImg" alt="">
            <p class="text-center mt-2">{{event.location}}</p>
            <p class="">{{event.type}}</p>
            <p class="">{{event.startDate}}</p>
            <p class="">{{event.description}}</p>
            <p><strong class="text-danger">Sold Out</strong></p>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-6">
        <div class="card elevation-1">
          <h5>Comments:</h5>
          <div class="card-body">
            <!-- PUT COMMENTS HERE -->
          </div>
        </div>
      </div>
      <div class="col-8 offset-2">
        <div class="card elevation-1">
          <h5>Attendees:</h5>
          <div class="card-body">
            <!-- PUT IMAGES OF TICKET HOLDERS HERE -->
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { eventsService } from '../services/EventsService';
import { commentsService } from '../services/CommentsService';
import { ticketsService } from '../services/TicketsService';
import { logger } from '../utils/Logger';
import Pop from '../utils/Pop';
import { computed, onMounted } from 'vue';
import { AppState } from '../AppState';
import { useRoute } from 'vue-router';

export default {
setup() {
  const route = useRoute();
  async function getEventById(){
    try {
      await eventsService.getById(route.params.eventId)
    } catch (error) {
      logger.error('[Getting Event By Id]', error)
      Pop.error(error)
    }
  }
  async function getCommentsByEventId(){
    try {
      await commentsService.getCommentsByEventId(route.params.eventId)
    } catch (error) {
      logger.error('[Getting Comments By Event Id]', error)
      Pop.error(error)
    }
  }
  async function getTicketProfiles(){
    try {
      await ticketsService.getTicketProfiles(route.params.eventId)
    } catch (error) {
      logger.error('[Getting Ticket Profiles]', error)
      Pop.error(error)
    }
  }
  onMounted(() => {
    getEventById();
    getCommentsByEventId();
    getTicketProfiles();
  })
  return {
    event: computed(() => AppState.activeEvent),
    comments: computed(() => AppState.comments),
    ticketProfiles: computed(() => AppState.ticketProfiles),
    hasTicket: computed(() => {
      if(AppState.ticketProfiles.find(t => t.accountId == AppState.account.id)){
        return true
      }
      return false
    }),
    async buyTicket(){
      try {
        let newTicket = {
          eventId: AppState.activeEvent.id,
          accountId: AppState.account.id
        }
        logger.log('buying the ticket', res.data)
        await ticketsService.create(newTicket)
      } catch (error) {
        logger.error('[Buying Ticket]', error)
        Pop.error(error)
      }
    },
    async sellTicket(){
      try {
        let ticketToSell = AppState.ticketProfiles.find(t => t.accountId == AppState.account.id)
        await ticketsService.sellTicket(ticketToSell.id)
      } catch (error) {
        logger.error('[Selling Ticket]', error)
        Pop.error(error)
      }
    }
  };
},
// components: { CommentCard, CommentForm}
};
</script>

<style scoped>
.canceled-img{
  filter: blur(6px);
}
</style>