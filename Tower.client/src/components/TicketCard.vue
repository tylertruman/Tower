<template>
  <div class="mt-3 elevation-1 rounded selectable card" @click="goTo" :title="accountTicket.event.name">
    <div class="card-body">
      <img class="img-fluid" :src="accountTicket.event.coverImg" alt="Event Image">
      <h5 class="text-center mb-0 mt-3">{{accountTicket.event.name}}</h5>
    </div>
  </div>
</template>

<script>
import { router } from '../router';


export default {
  props: {accountTicket: {type: Object, required: true}},
setup(props) {
  return {
    goTo(){
      router.push({name: 'EventDetails', params: {eventId: props.accountTicket.event.id}})
    }
  };
},
};
</script>

<style>

</style>