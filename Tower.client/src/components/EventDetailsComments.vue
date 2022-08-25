<template>
<div class="card elevation-1">
          <h5 class="text-center mt-2">Comments:</h5>
          <div class="card-body">
            <!-- PUT COMMENTS HERE -->
            <div class="row" v-for="c in comments" :key="c.id">
              <div class="mt-2">
                <img :src="c.creator.picture" :title="c.creator.name" height="30" class="rounded-circle" alt="creator image">
                {{c.body}} - {{c.creator.name}} <i class="mdi mdi-delete selectable text-danger" @click="deleteComment(c)" title="Delete Comment"></i>
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
              <button class="btn btn-info" title="Add Comment">Add Comment</button>
              </div>
            </form>
          </div>
        </div>
</template>

<script>
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { AppState } from '../AppState';
import { commentsService } from '../services/CommentsService';
import { logger } from '../utils/Logger';
import Pop from '../utils/Pop';

export default {
setup() {
  const editable = ref({});
  const route = useRoute();
  return {
    editable,
    comments: computed(() => AppState.comments),
    async createComment() {
                try {
                    editable.value.eventId = route.params.eventId;
                    await commentsService.create(editable.value);
                    editable.value = {};
                    Pop.success("Comment Added!");
                }
                catch (error) {
                    logger.error("[Creating Comment]", error);
                    Pop.error(error);
                }
            },
            async deleteComment(c) {
                try {
                    if (c.creator.id !== AppState.account.id) {
                        throw new Error("You must be the creator of this comment to delete it.");
                    }
                    const yes = await Pop.confirm("Delete The Comment?");
                    if (!yes) {
                        return;
                    }
                    await commentsService.deleteComment(c.id);
                }
                catch (error) {
                    logger.error("[Deleting Comment]", error);
                    Pop.error(error);
                }
            }
  };
},
};
</script>

<style>

</style>