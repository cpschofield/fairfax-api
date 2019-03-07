import {DefaultCrudRepository} from '@loopback/repository';
import {Article} from '../models';
import {JsonDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class ArticleRepository extends DefaultCrudRepository<
  Article,
  typeof Article.prototype.id
> {
  constructor(@inject('datasources.jsonStorage') dataSource: JsonDataSource) {
    super(Article, dataSource);
  }
}
