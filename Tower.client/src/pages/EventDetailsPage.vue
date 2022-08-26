<template>
  <div class="container-fluid">
    <section class="row">
      <div class="col-12">
        <h1 class="text-center mt-3">{{event.name}}</h1>
      </div>
      <div class="col-12 col-md-6 mt-3">
        <!-- Event Card -->
        <EventDetailsCard/>
      </div>
      <div class="col-12 col-md-6 mt-3">
        <!-- Comments -->
        <EventDetailsComments :comment="c"/>
      </div>
      <div class="col-8 offset-2 my-3">
        <!-- Attendees -->
        <EventDetailsAttendees :ticketProfiles="t"/>
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
import EventDetailsCard from '../components/EventDetailsCard.vue';
import EventDetailsComments from '../components/EventDetailsComments.vue';
import EventDetailsAttendees from '../components/EventDetailsAttendees.vue';

export default {
    setup() {
        const editable = ref({});
        const route = useRoute();
        async function getEventById() {
            try {
                await eventsService.getById(route.params.eventId);
            }
            catch (error) {
                logger.error("[Getting Event By Id]", error);
                Pop.error(error);
            }
        }
        async function getCommentsByEventId() {
            try {
                await commentsService.getCommentsByEventId(route.params.eventId);
            }
            catch (error) {
                logger.error("[Getting Comments By Event Id]", error);
                Pop.error(error);
            }
        }
        async function getTicketProfiles() {
            try {
                await ticketsService.getTicketProfiles(route.params.eventId);
            }
            catch (error) {
                logger.error("[Getting Ticket Profiles]", error);
                Pop.error(error);
            }
        }
        onMounted(() => {
            getEventById();
            getCommentsByEventId();
            getTicketProfiles();
        });
        return {
            editable,
            event: computed(() => AppState.activeEvent),
            comments: computed(() => AppState.comments),
        };
    },
    components: { EventDetailsCard, EventDetailsComments, EventDetailsAttendees }
};
</script>

<style scoped>
.canceled-img{
  filter: blur(6px);
}
</style>