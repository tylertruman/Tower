import { dbContext } from "../db/DbContext"
import { BadRequest, Forbidden } from "../utils/Errors"


class CommentsService{
  async create(newComment){
    const comment = await dbContext.Comments.create(newComment)
    await comment.populate('creator', 'name picture')
    return comment
  }

  async remove(commentId, userId){
    const comment = await dbContext.Comments.findById(commentId)
    if(!comment){
      throw new BadRequest('No comment with that id')
    }
    if(comment.creatorId.toString() != userId){
      throw new Forbidden('You do not have permission to remove that comment')
    }
    await comment.remove()
    return `comment deleted`
  }

  async getAll(query = {}){
    const comments = await dbContext.Comments.find(query).populate('creator', 'name picture')
    return comments
  }
}

export const commentsService = new CommentsService()