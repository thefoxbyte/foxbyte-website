export type CastEvent = { t: number; data: string };
export type Cast = { cols: number; rows: number; events: CastEvent[]; duration: number };
export type Cell = { ch: string; cls: string };

export function parseCast(source: string, idleLimit = 1.5): Cast {
  const lines = source.split("\n").filter((l) => l.trim());
  const header = JSON.parse(lines[0]) as { version?: number; width?: number; height?: number; term?: { cols?: number; rows?: number } };
  const relative = header.version === 3;
  const cols = header.term?.cols ?? header.width ?? 80;
  const rows = header.term?.rows ?? header.height ?? 24;
  const events: CastEvent[] = [];
  let clock = 0;
  let previous = 0;
  for (const line of lines.slice(1)) {
    if (!line.startsWith("[")) continue;
    const [time, code, data] = JSON.parse(line) as [number, string, string];
    const absolute = relative ? previous + time : time;
    clock += Math.min(absolute - previous, idleLimit);
    previous = absolute;
    if (code === "o") events.push({ t: clock, data });
  }
  return { cols, rows, events, duration: clock };
}

const colours: Record<number, string> = {
  30: "k", 31: "r", 32: "g", 33: "y", 34: "b", 35: "m", 36: "c", 37: "w",
  90: "k", 91: "r", 92: "g", 93: "y", 94: "b", 95: "m", 96: "c", 97: "w",
};

export class Screen {
  lines: Cell[][] = [[]];
  private row = 0;
  private col = 0;
  private fg = "";
  private bold = false;

  write(data: string) {
    for (let i = 0; i < data.length; i++) {
      const ch = data[i];
      if (ch === "\u001b") {
        i = this.escape(data, i);
        continue;
      }
      if (ch === "\r") this.col = 0;
      else if (ch === "\n") this.newline();
      else if (ch === "\b") this.col = Math.max(0, this.col - 1);
      else if (ch === "\t") this.col += 8 - (this.col % 8);
      else if (ch >= " ") this.put(ch);
    }
  }

  view(rows: number) {
    return this.lines.slice(Math.max(0, this.lines.length - rows));
  }

  private put(ch: string) {
    const line = this.line();
    while (line.length < this.col) line.push({ ch: " ", cls: "" });
    line[this.col] = { ch, cls: `${this.fg}${this.bold ? " bold" : ""}`.trim() };
    this.col++;
  }

  private line() {
    while (this.lines.length <= this.row) this.lines.push([]);
    return this.lines[this.row];
  }

  private newline() {
    this.row++;
    this.col = 0;
    this.line();
  }

  private escape(data: string, i: number) {
    const kind = data[i + 1];
    if (kind === "]") {
      let j = i + 2;
      while (j < data.length && data[j] !== "\u0007" && !(data[j] === "\u001b" && data[j + 1] === "\\")) j++;
      return data[j] === "\u001b" ? j + 1 : j;
    }
    if (kind !== "[") return i + 1;
    let j = i + 2;
    while (j < data.length && !/[@-~]/.test(data[j])) j++;
    const params = data.slice(i + 2, j).replace(/^\?/, "");
    const nums = params.split(";").map((n) => parseInt(n, 10));
    const n = Number.isNaN(nums[0]) ? 1 : nums[0];
    switch (data[j]) {
      case "m":
        for (const code of params ? nums : [0]) {
          if (code === 0 || Number.isNaN(code)) {
            this.fg = "";
            this.bold = false;
          } else if (code === 1) this.bold = true;
          else if (code === 22) this.bold = false;
          else if (code === 39) this.fg = "";
          else if (colours[code]) this.fg = colours[code];
        }
        break;
      case "K":
        this.line().length = Math.min(this.line().length, this.col);
        break;
      case "J":
        if (n === 2 || n === 3) {
          this.lines = [[]];
          this.row = 0;
          this.col = 0;
        }
        break;
      case "H":
      case "f":
        if (!params) {
          this.lines = [[]];
          this.row = 0;
          this.col = 0;
        }
        break;
      case "A":
        this.row = Math.max(0, this.row - n);
        break;
      case "B":
        this.row += n;
        this.line();
        break;
      case "C":
        this.col += n;
        break;
      case "D":
        this.col = Math.max(0, this.col - n);
        break;
      case "G":
        this.col = Math.max(0, n - 1);
        break;
    }
    return j;
  }
}
