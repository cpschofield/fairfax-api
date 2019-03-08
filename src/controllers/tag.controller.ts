import {Tag, Article} from '../models';
import {ArticleRepository} from '../repositories';
import {get, param, HttpErrors} from '@loopback/rest';
import {repository} from '@loopback/repository';

/**
 * A controller for Tag entity
 */
export class TagController {
  constructor(
    @repository(ArticleRepository) public article: ArticleRepository,
  ) {}

  // Map to `GET /tag/{tagName}/{date}`
  @get('/tag/{tagName}/{date}', {
    responses: {
      '200': {
        description: 'gets a tag selected by tagName and date',
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
    @param.path.string('tagName') name: string,
    @param.path.number('date') date: number,
  ): Promise<Tag> {
    // handle invalid date parameter format
    if (date.toString().length !== 8)
      throw new HttpErrors.BadRequest(
        `Date parameter must be a valid date in the format YYYYMMDD`,
      );

    const response: Tag = new Tag({tag: name});
    const articles: Article[] = await this.article.find();

    // filter all articles for instance of tag name
    const articlesByTagName: Article[] = articles.filter(
      (article: Article) => article.tags.indexOf(name) !== -1,
    );

    /*
     * The assumption I made regarding the requirement
     * "The count field shows the number of tags for the tag for that day."
     * was that this referred to the supplied date
     */
    const articlesByDate: Article[] = articlesByTagName.filter(
      (article: Article) => +article.date.split('-').join('') === date,
    );
    response.count = articlesByDate.length;

    // return early because there are no articles with this tag on the date provided
    if (response.count === 0) {
      response.articles = [];
      response.related_tags = [];
      return response;
    }

    /*
     * The assumption I've made here is that without a more precise date value
     * I will just select ten records as ID is a string and
     * cannot be sorted further by chronological order
     */
    response.articles = [...articlesByDate.map(({id}) => id).slice(0, 10)];
    const relatedTags: string[] = articlesByDate
      // get all tags
      .map(({tags}) => tags)
      // reduce all tags to a single array
      .reduce((acc: string[], val: string[]) => {
        return [...acc, ...val];
      })
      // remove non unique tags and queried tagName
      .filter((tag: string, index: number, arr: string[]) => {
        return arr.indexOf(tag) === index && tag !== name;
      });

    response.related_tags = relatedTags;

    return response;
  }
}
