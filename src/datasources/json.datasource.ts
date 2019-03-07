import {inject} from '@loopback/core';
import {juggler} from '@loopback/repository';
import * as config from '../../config/json.datasource.json';

export class JsonDataSource extends juggler.DataSource {
  static dataSourceName = 'jsonStorage';

  constructor(
    @inject('datasources.config.jsonStorage', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
