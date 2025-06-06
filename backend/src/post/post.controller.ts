import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { PostContentDto } from './dto/post-content.dto';
import { PostService } from './post.service';

@Controller('api/post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  createPost(@Body() postContentDto: PostContentDto) {}

  @Get(':id')
  findPostById(@Param('id') id: string) {
    return this.postService.findPostById(id);
  }

  @Put(':id')
  updatePostContent(@Param('id') id: string, @Body() postContentDto: PostContentDto) {
    const { content } = postContentDto;
    return this.postService.updatePost(id, content);
  }

  @Delete(':id')
  async removePost(@Param('id') id: string) {
    await this.postService.deletePostById(id);
  }

  @Post('/like/:id')
  async toggleLike(@Param('id') id: string) {}
}
