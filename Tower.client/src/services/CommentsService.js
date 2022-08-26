import { AppState } from "../AppState"
import { logger } from "../utils/Logger"
import { server } from "./AxiosService"


class CommentsService{
  async create(newComment){
    const res = await server.post('api/comments', newComment)
    AppState.comments.push(res.data)
  }
  async getCommentsByEventId(eventId){
    const res = await server.get(`api/events/${eventId}/comments`)
    AppState.comments = res.data
  }
  async deleteComment(commentId){
    const res = await server.delete('api/comments/'+commentId)
    AppState.comments = AppState.comments.filter(c => c.id != commentId)
  }
}

export const commentsService = new CommentsService()