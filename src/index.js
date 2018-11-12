const snappy = require('snappyjs')

const XERIAL_HEADER = Buffer.from([130, 83, 78, 65, 80, 80, 89, 0])
const SIZE_BYTES = 4
const SIZE_OFFSET = 16

const isFrameFormat = buffer => buffer.slice(0, 8).equals(XERIAL_HEADER)

module.exports = () => ({
  async compress(encoder) {
    return snappy.compress(encoder.buffer)
  },

  // Based on https://github.com/eapache/go-xerial-snappy/blob/master/snappy.go#L110
  async decompress(buffer) {
    if (!isFrameFormat(buffer)) {
      return snappy.uncompress(buffer)
    }

    const encoded = []
    const maxBytes = Buffer.byteLength(buffer)
    let offset = SIZE_OFFSET

    while (offset + SIZE_BYTES <= maxBytes) {
      const size = buffer.readUInt32BE(offset)
      offset += SIZE_BYTES
      encoded.push(buffer.slice(offset, offset + size))
      offset += size
    }

    const decodedBuffers = await Promise.all(
      encoded.map(async encodedBuffer => snappy.uncompress(encodedBuffer))
    )

    return decodedBuffers.reduce(
      (result, decodedBuffer) => Buffer.concat([result, decodedBuffer]),
      Buffer.alloc(0)
    )
  },
})
