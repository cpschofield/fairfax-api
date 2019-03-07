import {Tag, Article} from '../models';
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

  // Map to `GET /tag/{tagName}/{date}`
  @get('/tag/{tagName}/{date}', {
    responses: {
      '200': {
        description: 'returns a tag selected by tagName and date',
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
    @param.path.string('date') date: string,
  ): Promise<any> {
    const response: Tag = new Tag({tag: name});
    const articles: Article[] = await this.article.find();

    // filter all articles for instance of tag name
    const articlesByTagName: Article[] = (await this.article.find()).filter(
      (article: Article) => article.tags.indexOf(name) !== -1,
    );

    /*
     * The assumption I made regarding the requirement
     * "The count field shows the number of tags for the tag for that day."
     * was that this referred to the supplied date
     */
    const articlesByDate: Article[] = articles.filter(
      (article: Article) => article.date.split('-').join('') === date,
    );
    response.count = articlesByDate.length;
    /*
     * The assumption I've made here is that without a more precise date value
     * I will just select ten records as ID is a string and
     * cannot be reliably sorted by order of entry
     */
    response.articles = [...articlesByDate.map(({id}) => id).slice(0, 10)];
    const relatedTags = [...articlesByTagName.map(({tags}) => tags)];
    response.related_tags;
    // {
    // 	 "tag" : "health",
    // 	 "count" : 17,
    // 	 "articles" : [
    // 		 "1",
    // 		 "7"
    // 	 ],
    // 	 "related_tags" : [
    // 	 	 "science",
    // 		 "fitness"
    // 	 ]
    // }

    // The related_tags field contains a list of tags that are on the articles
    // that the current tag is on for the same day.
    //  - It should not contain duplicates.

    // The count field shows the number of tags for the tag for that day.

    // The articles field contains a list of ids for the
    // last 10 articles entered for that day.

    // step 1. search all articles for tag name
    // step 2. count the number of references of the tag
    // step 3. for each of the articles find other unique tags
    // step 4. limit to the last 10 article ids that match supplied day

    return relatedTags;
  }
}
