import {
  ApiCreateComment,
  ApiCreateCommentReply,
  ApiDeleteComment,
  ApiGetCommentById,
  ApiGetCommentReplies,
  ApiGetCommentsByPostId,
  ApiGetCommentsByUserId,
  ApiToggleCommentLike,
  ApiUpdateComment,
} from '@/comment/comment.swagger';
import { CreateCommentDto, UpdateCommentDto } from '@/comment/dto/comment.dto';
import { ReplyContentDto } from '@/comment/dto/reply.dto';
import { CommentOwner } from '@/comment/guard/comment-owner.guard';
import { IdParam } from '@/common/decorator/id.decorator';
import { PageQuery } from '@/common/decorator/page-query.decorator';
import { Public } from '@/common/decorator/public.decorator';
import { User } from '@/common/decorator/user.decorator';
import { LikeStatus } from '@/common/status';
import { UserData } from '@/common/user';
import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { CommentService } from './comment.service';

@Controller()
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('comment')
  @ApiCreateComment()
  async createComment(
    @Body() { postId, content }: CreateCommentDto,
    @User() user: UserData,
  ) {
    const commentId = await this.commentService.createComment({
      postId,
      authorId: user.id,
      content,
    });
    return {
      success: true,
      data: { commentId, postId, authorId: user.id },
    };
  }

  @Post('reply')
  @ApiCreateCommentReply()
  async createCommentReply(
    @Body() { postId, content, commentId }: ReplyContentDto,
    @User() user: UserData,
  ) {
    const replyId = await this.commentService.createCommentReply({
      postId,
      authorId: user.id,
      commentId,
      content,
    });

    return {
      success: true,
      data: { replyId, postId, authorId: user.id },
    };
  }

  @CommentOwner()
  @Put('comment')
  @ApiUpdateComment()
  async updateComment(@Body() { commentId, content }: UpdateCommentDto) {
    await this.commentService.updateComment({ commentId, content });
    return {
      success: true,
      data: { commentId },
    };
  }

  @Public()
  @Get('comment/:id')
  @ApiGetCommentById()
  async getCommentById(@IdParam() id: string) {
    const comment = await this.commentService.findCommentById(id);
    return {
      success: true,
      data: comment,
    };
  }

  @Public()
  @Get('post/:id/comments')
  @ApiGetCommentsByPostId()
  async getCommentsByPostId(@IdParam() id: string, @PageQuery() pageQuery: PageQuery) {
    const { data: comments, meta } = await this.commentService.findCommentsByPostId(
      id,
      pageQuery,
    );
    return {
      success: true,
      data: {
        postId: id,
        comments,
        meta,
      },
    };
  }

  @Public()
  @Get('user/:id/comments')
  @ApiGetCommentsByUserId()
  async getCommentsByUserId(@IdParam() id: string, @PageQuery() pageQuery: PageQuery) {
    const { data: comments, meta } = await this.commentService.findCommentsByUserId(
      id,
      pageQuery,
    );
    return {
      success: true,
      data: {
        comments,
        meta,
      },
    };
  }

  @Public()
  @Get('comment/:id/replies')
  @ApiGetCommentReplies()
  async getCommentReplies(@IdParam() id: string, @PageQuery() pageQuery: PageQuery) {
    const replies = await this.commentService.findRepliesByCommentId(id, pageQuery);
    return {
      success: true,
      data: replies,
    };
  }

  @CommentOwner()
  @Delete('comment/:id')
  @ApiDeleteComment()
  async deleteComment(@IdParam() id: string) {
    const deletedComment = await this.commentService.deleteCommentById(id);
    return {
      success: true,
      data: deletedComment,
    };
  }

  @Post('comment/:id/like')
  @ApiToggleCommentLike()
  async toggleCommentLike(@IdParam() commentId: string, @User() user: UserData) {
    const likeStatus: LikeStatus = await this.commentService.addCommentLikes({
      commentId,
      userId: user.id,
    });

    switch (likeStatus) {
      case LikeStatus.PLUS:
        return {
          success: true,
          data: {
            status: LikeStatus.PLUS,
            commentId,
          },
        };
      case LikeStatus.MINUS:
        return {
          success: true,
          data: {
            status: LikeStatus.MINUS,
            commentId,
          },
        };
    }
  }
}
