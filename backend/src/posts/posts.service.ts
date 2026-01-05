import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostEntity } from './post.entity';
import { pubSub } from '../pubsub';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private repo: Repository<PostEntity>,
  ) {}

  async create(content: string, authorId: number) {
    const post = this.repo.create({ content, authorId });
    const saved = await this.repo.save(post);

    const full = await this.repo.findOne({
      where: { id: saved.id },
      relations: ['author'],
    });

    // debug log and publish

    console.log('Publishing postAdded for id:', full?.id);
    await pubSub.publish('postAdded', { postAdded: full });

    return full;
  }

  async findAll() {
    return this.repo.find({
      relations: ['author'],
      order: { createdAt: 'DESC' },
    });
  }
}
