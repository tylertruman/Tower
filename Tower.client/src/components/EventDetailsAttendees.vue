<template>
<div class="card elevation-1">
          <h5 class="text-center mt-2">Attendees:</h5>
          <div class="card-body">
            <!-- PUT IMAGES OF TICKET HOLDERS HERE -->
            <div class="row" >
              <div class="col-1 m-0 px-0 text-center" v-for="t in ticketProfiles" :key="t.id">
                <img :src="t.profile.picture" :title="t.profile.name" height="30" class="rounded-circle">
              </div>
            </div>
          </div>
        </div>
</template>

<script>
import { computed } from 'vue';
import { AppState } from '../AppState';

export default {
setup() {
  return {
    ticketProfiles: computed(() => AppState.ticketProfiles),
  };
},
};
</script>

<style>

</style>