<template>
  <div class="mt-3 elevation-1 rounded selectable card" @click="goTo" :title="event.name">
    <div class="card-body">
      <img class="img-fluid" :src="event.coverImg">
      <h5 class="text-center mb-0 mt-3">{{event.name}}</h5>
    </div>
  </div>
</template>

<script>
import { router } from '../router';

export default {
  props: {event: {type: Object, required: true}},
setup(props) {
  return {
    goTo(){
      router.push({name: 'EventDetails', params: {eventId: props.event.id}})
    }
  };
},
};
</script>

<style>

</style>