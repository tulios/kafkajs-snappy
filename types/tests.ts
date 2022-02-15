import { CompressionTypes, CompressionCodecs } from 'kafkajs'

import SnappyCodec from './index'

CompressionCodecs[CompressionTypes.Snappy] = SnappyCodec
