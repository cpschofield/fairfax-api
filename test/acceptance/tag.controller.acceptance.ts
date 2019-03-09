import {
  Client,
  createRestAppClient,
  givenHttpServerConfig,
  toJSON,
} from '@loopback/testlab';
import {App} from '../../src/application';
import {Article, Tag} from '../../src/models';
import {ArticleRepository} from '../../src/repositories';
import {givenArticle, givenTag} from '../helpers';
import * as config from '../../config/json.datasource.json';

describe('Tag Controller', () => {
  let app: App;
  let client: Client;
  let articleRepo: ArticleRepository;

  before(givenRunningApplicationWithCustomConfiguration);
  after(() => app.stop());

  before(givenArticleRepositories);
  before(() => {
    client = createRestAppClient(app);
  });

  beforeEach(async () => {
    await articleRepo.deleteAll();
  });

  context(
    'when getting a tag based on various tagName and date combinations',
    () => {
      let persistedArticle: Article;

      beforeEach(async () => {
        persistedArticle = await givenArticleInstance();
      });

      it('gets a tag by tagName and date', async () => {
        const tag = await givenTagInstance({tag: persistedArticle.tags[0]});
        return client
          .get(
            `/tag/${persistedArticle.tags[0]}/${persistedArticle.date
              .split('-')
              .join('')}`,
          )
          .send()
          .expect(200, toJSON(tag));
      });

      // it('returns a tag with count 0, empty related_tags and empty articles for a tag with no entries on the supplied date', () => {
      //   return client
      //     .get('/tag/missingtag/20160922')
      //     .expect(200, toJSON(givenTag));
      // });
    },
  );

  async function givenRunningApplicationWithCustomConfiguration() {
    app = new App({
      rest: givenHttpServerConfig(),
    });

    await app.boot();
    app.bind('datasources.config.jsonStorage').to(config);
    await app.start();
  }

  async function givenArticleRepositories() {
    articleRepo = await app.getRepository(ArticleRepository);
  }

  async function givenArticleInstance(article?: Partial<Article>) {
    return await articleRepo.create(givenArticle(article));
  }

  async function givenTagInstance(tag?: Partial<Tag>) {
    return givenTag(tag);
  }
});
