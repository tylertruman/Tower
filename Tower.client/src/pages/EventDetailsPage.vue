<template>
  <div class="container-fluid">
    <section class="row">
      <div class="col-12">
        <h1 class="text-center mt-3">{{event.name}}</h1>
      </div>
      <div class="col-12 col-md-6 mt-3">
        <div class="card elevation-1">
          <div v-if="!event.isCanceled && event.capacity >= 1" class="card-body">
            <img class="img-fluid elevation-1 rounded" :src="event.coverImg" alt="">
            <p class="text-center mt-2">{{event.location}} - Tickets Available: {{event.capacity}}</p>
            <p class="text-center">{{event.type}} - {{new Date(event.startDate).toLocaleDateString('en-US', {
              month: 'short', day: 'numeric'
            })}}</p>
            <p>{{event.description}}</p>
            <div v-if="!hasTicket" class="text-center">
            <button class="btn btn-info" @click="buyTicket">Buy Ticket</button>
            </div>
            <div v-else class="text-center">
            <button class="btn btn-danger" @click="sellTicket">Sell Ticket</button>
            </div>
          </div>
          <div v-if="event.isCanceled" class="card-body">
            <img class="img-fluid canceled-img elevation-1 rounded" :src="event.coverImg" alt="">
            <p class="text-center mt-2 text-decoration-line-through">{{event.location}} - Tickets Available: {{event.capacity}}</p>
            <p class="text-center text-decoration-line-through">{{event.type}} - {{new Date(event.startDate).toLocaleDateString('en-US', {
              month: 'short', day: 'numeric'
            })}}</p>
            <p class="text-decoration-line-through">{{event.description}}</p>
            <p class="text-center"><strong class="text-danger">Canceled</strong></p>
          </div>
          <div v-if="event.capacity == 0" class="card-body">
            <img class="img-fluid canceled-img elevation-1 rounded" :src="event.coverImg" alt="">
            <p class="text-center mt-2">{{event.location}} - Tickets Available: {{event.capacity}}</p>
            <p class="text-center">{{event.type}} - {{new Date(event.startDate).toLocaleDateString('en-US', {
              month: 'short', day: 'numeric'
            })}}</p>
            <p class="">{{event.description}}</p>
            <p class="text-center"><strong class="text-danger">Sold Out</strong></p>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-6 mt-3">
        <div class="card elevation-1">
          <h5 class="text-center mt-2">Comments:</h5>
          <div class="card-body">
            <!-- PUT COMMENTS HERE -->
            <div class="row" v-for="c in comments" :key="c.id">
              <div class="mt-2">
                <img :src="c.creator.picture" :title="c.creator.name" height="30" class="rounded-circle">
                {{c.body}} - {{c.creator.name}} <i class="mdi mdi-delete selectable text-danger" @click="deleteComment(c)"></i>
              </div>
            </div>
          </div>
          <div class="card-footer">
            <form @submit.prevent="createComment">
              <div class="mb-3">
                <label for="comment" class="form-label">Comment:</label>
                <textarea v-model="editable.body" class="form-control" id="comment" rows="3" placeholder="enter comment here..."></textarea>
              </div>
              <div class="text-end">
              <button class="btn btn-info">Add Comment</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div class="col-8 offset-2 my-3">
        <div class="card elevation-1">
          <h5 class="text-center mt-2">Attendees:</h5>
          <div class="card-body">
            <!-- PUT IMAGES OF TICKET HOLDERS HERE -->
            <div class="row" v-for="t in ticketProfiles" :key="t.id">
              <div>
                <img :src="t.profile.picture" :title="t.profile.name" height="30" class="rounded-circle">
              </div>
            </div>
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
import { computed, onMounted, ref } from 'vue';
import { AppState } from '../AppState';
import { useRoute } from 'vue-router';

export default {
setup() {
  const editable = ref({})
  const route = useRoute()
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
    editable,
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
        logger.log('buying the ticket', newTicket)
        await ticketsService.create(newTicket)
        AppState.activeEvent.capacity--
      } catch (error) {
        logger.error('[Buying Ticket]', error)
        Pop.error(error)
      }
    },
    async sellTicket(){
      try {
        let ticketToSell = AppState.ticketProfiles.find(t => t.accountId == AppState.account.id)
        await ticketsService.sellTicket(ticketToSell.id)
        AppState.activeEvent.capacity++
      } catch (error) {
        logger.error('[Selling Ticket]', error)
        Pop.error(error)
      }
    },
    async createComment(){
      try {
        editable.value.eventId = route.params.eventId
        await commentsService.create(editable.value)
        editable.value = {}
        Pop.success('Comment Added!')
      } catch (error) {
        logger.error('[Creating Comment]', error)
        Pop.error(error)
      }
    },
    async deleteComment(c){
      try {
        if(c.creator.id !== AppState.account.id){
          throw new Error('You must be the creator of this comment to delete it.')
        }
        const yes = await Pop.confirm('Delete The Comment?')
        if(!yes) {return}
        await commentsService.deleteComment(c.id)
      } catch (error) {
        logger.error('[Deleting Comment]', error)
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