<template>
  <div class="container-fluid">
    <section class="row d-flex justify-content-around">
      <div class="col-12">
        Filter <i class="mdi mdi-filter" title="Filter Icon"></i>
      </div>
      <div class="col-7 col-md-2 btn btn-primary mt-2" @click="filterTerm = ''" title="Filter All">All</div>
      <div class="col-7 col-md-2 btn btn-primary mt-2" @click="filterTerm = 'concert'" title="Filter Concerts">Concerts</div>
      <div class="col-7 col-md-2 btn btn-primary mt-2" @click="filterTerm = 'convention'" title="Filter Conventions">Conventions</div>
      <div class="col-7 col-md-2 btn btn-primary mt-2" @click="filterTerm = 'sport'" title="Filter Sports">Sports</div>
      <div class="col-7 col-md-2 btn btn-primary mt-2" @click="filterTerm = 'digital'" title="Filter Digital">Digital</div>
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
