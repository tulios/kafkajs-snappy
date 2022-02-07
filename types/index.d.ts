interface Encoder {
    buffer: Buffer
}

export interface Codec {
    compress: (encoder: Encoder) => Promise<Buffer>;
    decompress: (compressed: Buffer) => Promise<Buffer>;
}

export default function SnappyCodec(): Codec
