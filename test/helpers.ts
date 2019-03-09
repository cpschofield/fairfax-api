import {Article, Tag} from '../src/models';

/**
 * Generate a complete Article object for use with tests.
 * @param article A partial (or complete) Article object.
 */
export function givenArticle(article?: Partial<Article>): Article {
  const data = Object.assign(
    {
      id: '99999',
      title: 'Acceptance Test',
      date: '2016-09-23',
      body: 'Some text for testing',
      tags: ['reason', 'facts', 'logic'],
    },
    article,
  );
  return new Article(data);
}

export function givenTag(tag?: Partial<Tag>): Tag {
  const data = Object.assign(
    {
      tag: 'reason',
      count: 1,
      articles: ['99999'],
      related_tags: ['facts', 'logic'],
    },
    tag,
  );
  return new Tag(data);
}
