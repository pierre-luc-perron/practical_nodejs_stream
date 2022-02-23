import stream from "stream";

import echoLines from "../src/ex-echo-lines";

class SpyWritable extends stream.Writable {
  written: string[];

  constructor(opts?: stream.WritableOptions) {
    super(opts);
    this.written = [];
  }

  // eslint-disable-next-line no-underscore-dangle
  override _write(
    chunk: string,
    _encoding: BufferEncoding,
    callback: (error?: Error | null) => void
  ): void {
    this.written.push(chunk);
    callback();
  }

  override valueOf(): string[] {
    return this.written;
  }
}

describe("echoLines", () => {
  let readable: stream.Readable;
  let writable: stream.Writable;

  beforeEach(() => {
    readable = new stream.Readable({
      // eslint-disable-next-line no-underscore-dangle
      read(): void {
        this.push("1\n");
        this.push("23\n");
        this.push("456\n");
        this.push("78\n");
        this.push("9\n");
        this.push(null);
      },
    });

    writable = new SpyWritable({ decodeStrings: false });
  });

  it("reads all the line in order", (done) => {
    writable.once("finish", () => {
      try {
        const lines = writable.valueOf() as string[];
        expect(lines[0]).toEqual("1");
        expect(lines[1]).toEqual("23");
        expect(lines[2]).toEqual("456");
        expect(lines[3]).toEqual("78");
        expect(lines[4]).toEqual("9");
        done();
      } catch (error) {
        done(error);
      }
    });
    echoLines(readable, writable);
  });

  it("remove eol", (done) => {
    writable.once("finish", () => {
      try {
        const lines = writable.valueOf() as string[];
        expect(lines.join(" ")).not.toMatch(/\n/);
        done();
      } catch (error) {
        done(error);
      }
    });
    echoLines(readable, writable);
  });
});
