<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark px-3">
    <router-link class="navbar-brand d-flex" :to="{ name: 'Home' }">
      <div class="d-flex flex-column align-items-center" title="Home Page">
        <!-- <img alt="logo" src="../assets/img/cw-logo.png" height="45" /> -->
        Tower
      </div>
    </router-link>
    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" title="Create Event">
  Create Event
</button>
    <button
      class="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarText"
      aria-controls="navbarText"
      aria-expanded="false"
      aria-label="Toggle navigation"
      title="Navbar Collapsable"
    >
      <span class="navbar-toggler-icon" />
    </button>
    <div class="collapse navbar-collapse" id="navbarText">
      <ul class="navbar-nav me-auto">
        <li>
          <!-- <router-link
            :to="{ name: 'About' }"
            class="btn text-success lighten-30 selectable text-uppercase"
          >
            About
          </router-link> -->
        </li>
      </ul>
      <!-- LOGIN COMPONENT HERE -->
      <Login />
    </div>
  </nav>
  <!-- Create Event Modal -->
  <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Create Event</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <form @submit.prevent="handleSubmit">
          <div class="mb-3">
            <label for="name" class="form-label">Event Name</label>
            <input v-model="editable.name" type="text" class="form-control" id="name" minlength="1" maxlength="50" required>
          </div>
          <div class="mb-3">
            <label for="coverImg" class="form-label">Event Image</label>
            <input v-model="editable.coverImg" type="url" class="form-control" id="coverImg" minlength="3" maxlength="250" required>
          </div>
          <div class="mb-3">
            <label for="location" class="form-label">Event Location</label>
            <input v-model="editable.location" type="text" class="form-control" id="location" minlength="3" maxlength="35" required>
          </div>
          <div class="mb-3">
            <label for="capacity" class="form-label">Event Capacity</label>
            <input v-model="editable.capacity" type="number" class="form-control" id="capacity" min="0" max="1000" required>
          </div>
          <div class="mb-3">
            <label for="startDate" class="form-label">Event Starting Date</label>
            <input v-model="editable.startDate" type="date" class="form-control" id="startDate" required>
          </div>
            <label for="type" class="form-label">Event Type</label>
          <select v-model="editable.type" class="form-select mb-3" aria-label="select category" required>
            <option value="concert" selected>Concert</option>
            <option value="convention">Convention</option>
            <option value="sport">Sport</option>
            <option value="digital">Digital</option>
          </select>
          <div class="mb-3">
            <label for="description" class="form-label">Event Description</label>
            <textarea v-model="editable.description" class="form-control" aria-label="eventDescription" required></textarea>
          </div>
          <button type="submit" class="btn btn-primary" title="Submit">Submit</button>
        </form>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { Modal } from 'bootstrap';
import { ref } from 'vue';
import { AppState } from '../AppState';
import { router } from '../router';
import { eventsService } from '../services/EventsService';
import { logger } from '../utils/Logger';
import Pop from '../utils/Pop';

export default {
  setup() {
    const editable = ref({})
    return {
      editable,
      async handleSubmit(){
        try {
          if(!AppState.account.id){
          throw new Error('You must be signed in to create an event')
          }
          const event = await eventsService.createEvent(editable.value)
          router.push({name: 'EventDetails', params: {eventId: event.id}})
          editable.value = {}
          Modal.getOrCreateInstance(document.getElementById('exampleModal')).hide()
          Pop.success('Event Created')
        } catch (error) {
          logger.error('[Handling Submit]', error)
          Pop.error(error)
        }
      }
    };
  },
};
</script>

<style scoped>
a:hover {
  text-decoration: none;
}
.nav-link {
  text-transform: uppercase;
}
.navbar-nav .router-link-exact-active {
  border-bottom: 2px solid var(--bs-success);
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}
</style>
