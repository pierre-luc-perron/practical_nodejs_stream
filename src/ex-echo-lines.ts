import stream from "stream";

export class LineEcho extends stream.Transform {
  lineBuffer: string;

  constructor(opts?: stream.TransformOptions) {
    super(opts);
    this.lineBuffer = "";
  }

  // eslint-disable-next-line no-underscore-dangle
  override _transform(
    chunk: string,
    _encoding: BufferEncoding,
    callback: stream.TransformCallback
  ): void {
    let [m, n] = [0, 0];
    // Find the next new line. It does not care about about '\r' variants.
    // eslint-disable-next-line no-cond-assign
    while ((n = chunk.indexOf("\n", m)) !== -1) {
      const line = chunk.slice(m, n);
      this.lineBuffer += line;
      this.push(this.lineBuffer);
      this.lineBuffer = "";
      m = n + 1;
    }
    const rest = chunk.slice(m, n);
    this.lineBuffer += rest;
    callback();
  }
}

/**
 * Echo stream line by line. The function is similar to process.stdout
 */
export default function echoLines(
  readable: stream.Readable,
  writable: stream.Writable
) {
  /* eslint-disable no-console */
  stream.pipeline(
    readable.setEncoding("utf8"),
    new LineEcho({ decodeStrings: false }).setEncoding("utf8"),
    writable,
    (err) => {
      if (err) {
        console.error("Why does pipeline fail?", err);
      } else {
        console.log("Well done!");
      }
    }
  );
}
