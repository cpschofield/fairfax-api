import {Article} from '../models';
import {ArticleRepository} from '../repositories';
import {get, post, param, requestBody} from '@loopback/rest';
import {repository} from '@loopback/repository';

/**
 * A controller for Article entity
 */
export class ArticleController {
  constructor(
    @repository(ArticleRepository) public article: ArticleRepository,
  ) {}

  // Map to `POST /articles`
  @post('/articles', {
    responses: {
      '200': {
        description: 'creates a new article record',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': Article,
            },
          },
        },
      },
    },
  })
  async createArticle(@requestBody() article: Article): Promise<Article> {
    return await this.article.create(article);
  }

  // Map to `GET /articles/{id}`
  @get('/articles/{id}', {
    responses: {
      '200': {
        description: 'returns a single article record by id',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': Article,
            },
          },
        },
      },
    },
  })
  async findArticleById(@param.path.string('id') id: string): Promise<Article> {
    return await this.article.findById(id);
  }
}
