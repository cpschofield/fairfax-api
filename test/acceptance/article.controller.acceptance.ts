import {
  Client,
  createRestAppClient,
  expect,
  givenHttpServerConfig,
  toJSON,
} from '@loopback/testlab';
import {App} from '../../src/application';
import {Article} from '../../src/models';
import {ArticleRepository} from '../../src/repositories';
import {givenArticle} from '../helpers';
import * as config from '../../config/json.datasource.json';

describe('Article Controller', () => {
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

  it('creates a article', async function() {
    const article = givenArticle();
    const response = await client
      .post('/articles')
      .send(article)
      .expect(200);
    expect(response.body).to.containDeep(article);
    const result = await articleRepo.findById(response.body.id);
    expect(result).to.containDeep(article);
  });

  it('rejects requests to create a article with a required value missing', async () => {
    const article = givenArticle();
    delete article.id;
    await client
      .post('/articles')
      .send(article)
      .expect(422);
  });

  context('when dealing with a single persisted article', () => {
    let persistedArticle: Article;

    beforeEach(async () => {
      persistedArticle = await givenArticleInstance();
    });

    it('gets a article by ID', () => {
      return client
        .get(`/articles/${persistedArticle.id}`)
        .send()
        .expect(200, toJSON(persistedArticle));
    });

    it('returns 404 when getting a article that does not exist', () => {
      return client.get('/articles/88888').expect(404);
    });
  });

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
});
