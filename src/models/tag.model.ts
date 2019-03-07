import {Entity, model, property} from '@loopback/repository';

@model()
export class Tag extends Entity {
  @property({
    type: 'string',
    id: true,
    required: true,
  })
  tag: string;

  @property({
    type: 'number',
    required: true,
  })
  count: number;

  @property.array(String, {
    required: true,
  })
  articles: string;

  @property.array(String, {
    required: true,
  })
  related_tags: string;

  constructor(data?: Partial<Tag>) {
    super(data);
  }
}
