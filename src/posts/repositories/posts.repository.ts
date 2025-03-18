import { PrismaService } from 'src/prisma/prisma.service';
import { PostEntity } from '../entities/post.entity';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { Prisma } from '@prisma/client';
import { NotFoundError } from 'src/common/errors/types/NotFoundError';

export class PostsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPostDto: CreatePostDto): Promise<PostEntity> {
    const { authorEmail } = createPostDto;

    delete createPostDto.authorEmail;

    const user = await this.prisma.user.findUnique({
      where: {
        email: authorEmail,
      },
    });

    if (!user) {
      throw new NotFoundError('Author not found.');
    }
    const data: Prisma.PostCreateInput = {
      ...createPostDto,
      author: {
        connect: {
          email: authorEmail,
        },
      },
    };
    return this.prisma.post.create({
      data,
    });
  }

  findAll(): Promise<PostEntity[]> {
    return this.prisma.post.findMany({
      include: {
        author: true,
      },
    });
  }

  findOne(id: number): Promise<PostEntity> {
    return this.prisma.post.findUnique({
      where: {
        id,
      },
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async update(id: number, updateUserDto: UpdatePostDto): Promise<PostEntity> {
    const { authorEmail } = updateUserDto;

    if (!authorEmail) {
      return this.prisma.post.update({
        data: updateUserDto,
        where: {
          id,
        },
      });
    }
    delete updateUserDto.authorEmail;

    const user = await this.prisma.user.findUnique({
      where: {
        email: authorEmail,
      },
    });

    if (!user) {
      throw new NotFoundError('Author not found.');
    }

    const data: Prisma.PostUpdateInput = {
      ...updateUserDto,
      author: {
        connect: {
          email: authorEmail,
        },
      },
    };
    return this.prisma.post.update({
      where: {
        id,
      },
      data,
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async remove(id: number): Promise<PostEntity> {
    return this.prisma.post.delete({
      where: {
        id,
      },
    });
  }
}
