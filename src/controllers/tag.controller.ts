import {Tag} from '../models';
import {ArticleRepository} from '../repositories';
import {get, param} from '@loopback/rest';
import {repository} from '@loopback/repository';

/**
 * A controller for Tag entity
 */
export class TagController {
  constructor(
    @repository(ArticleRepository) public article: ArticleRepository,
  ) {}

  // Map to `GET /tag/{tag}/{date}`
  @get('/tag/{tag}/{date}', {
    responses: {
      '200': {
        description: 'returns a tag selected by name and date',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': Tag,
            },
          },
        },
      },
    },
  })
  async findTagByNameAndDate(
    @param.path.string('tag') tag: string,
    @param.path.string('date') date: string,
  ): Promise<Tag> {
    const articles = await this.article.find();
  }
}
