<template>
  <div class="container-fluid">
    <section class="row d-flex justify-content-around">
      <div class="col-12">
        filter <i class="mdi mdi-filter"></i>
      </div>
      <div class="col-2 btn btn-info" @click="filterTerm = ''">All</div>
      <div class="col-2 btn btn-info" @click="filterTerm = 'concert'">Concerts</div>
      <div class="col-2 btn btn-info" @click="filterTerm = 'convention'">Conventions</div>
      <div class="col-2 btn btn-info" @click="filterTerm = 'sport'">Sports</div>
      <div class="col-2 btn btn-info" @click="filterTerm = 'digital'">Digital</div>
    </section>
    <section class="row">
    <div class="col-md-4" v-for="e in events" :key="e.id">
      <EventCard :event="e"/>
    </div>
    </section>
  </div>
</template>

<script>
import { logger } from '../utils/Logger';
import Pop from '../utils/Pop';
import { eventsService } from '../services/EventsService.js';
import { onMounted, ref} from 'vue';
import { computed } from '@vue/reactivity';
import { AppState } from '../AppState';
import EventCard from '../components/EventCard.vue';

export default {
    name: "Home",
    setup() {
        const filterTerm = ref("");
        async function getEvents() {
            try {
                await eventsService.getAll();
            }
            catch (error) {
                logger.error("[Getting Events]", error);
                Pop.error(error);
            }
        }
        onMounted(() => {
            getEvents();
        });
        return {
            filterTerm,
            events: computed(() => AppState.events.filter(e => filterTerm.value ? e.type == filterTerm.value : true)),
        };
    },
    components: { EventCard }
}
</script>

<style scoped lang="scss">
.home{
  display: grid;
  height: 80vh;
  place-content: center;
  text-align: center;
  user-select: none;
  .home-card{
    width: 50vw;
    > img{
      height: 200px;
      max-width: 200px;
      width: 100%;
      object-fit: contain;
      object-position: center;
    }
  }
}
</style>
