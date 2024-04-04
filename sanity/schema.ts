import { type SchemaTypeDefinition } from 'sanity'

import blockContent from './schemaTypes/blockContent'
import speaker from './schemaTypes/speaker'
import schedule from './schemaTypes/schedule'
import talk from './schemaTypes/talk'
import track from './schemaTypes/track'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [speaker, schedule, talk, track, blockContent],
}
