<template>
  <div class="about text-center">
    <h1>Welcome {{ account.name }}</h1>
    <img class="rounded" :src="account.picture" alt="account picture" />
    <p>{{ account.email }}</p>
  </div>
  <div class="container-fluid">
    <section class="row">
      <div class="col-12">
        <h2>My Tickets</h2>
      </div>
    </section>
    <section class="row">
      <div class="col-md-4" v-for="t in accountTickets" :key="t.id">
        <!-- Account Tickets -->
        <TicketCard :accountTicket="t"/>
      </div>
    </section>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue'
import { AppState } from '../AppState'
import { accountService } from '../services/AccountService'
import { logger } from '../utils/Logger'
import Pop from '../utils/Pop'
export default {
  name: 'Account',
  setup() {
    async function getAccountTickets(){
      try {
        await accountService.getAccountTickets()
      } catch (error) {
        logger.error('[Getting Account Tickets]', error)
        Pop.error(error)
      }
    }
    onMounted(() => {
      getAccountTickets()
    })
    return {
      account: computed(() => AppState.account),
      accountTickets: computed(() => AppState.accountTickets)
    }
  },
  // components: { EventCard }
}
</script>

<style scoped>
img {
  max-width: 100px;
}
</style>
