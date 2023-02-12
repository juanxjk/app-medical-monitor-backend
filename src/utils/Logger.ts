const enum LogLevels {
  NONE,
  INFO,
  WARNING,
  ERROR,
  DEBUG,
}

const logLevel = LogLevels.DEBUG;

export class Logger {
  static info(message: string): void {
    if (logLevel < LogLevels.INFO) return;

    printToConsole("INFO", message, Colors.FgCyan);
  }

  static debug(message: string): void {
    if (logLevel < LogLevels.DEBUG) return;

    printToConsole("DEBUG", message, Colors.FgGray);
  }

  static warn(message: string): void {
    if (logLevel < LogLevels.WARNING) return;

    printToConsole("WARN", message, Colors.FgYellow);
  }

  static error(data: any | Error | string): void {
    if (logLevel < LogLevels.ERROR) return;

    let message = data;
    if (data instanceof Error) {
      message = "Exception => " + data.message;
      message += "\n" + Colors.BgWhite + Colors.FgRed + data.stack;
    }
    if (typeof message !== "string") {
      message = JSON.stringify(data);
    }

    printToConsole("ERROR", message, Colors.FgRed);
  }
}

function printToConsole(
  context: string,
  message: string,
  color = Colors.Reset
): void {
  const timestamp = new Date().toUTCString();

  console.log(color + `[${context}] ${timestamp}: ${message}` + Colors.Reset);
}

const enum Colors {
  Reset = "\x1b[0m",
  Bright = "\x1b[1m",
  Dim = "\x1b[2m",
  Underscore = "\x1b[4m",
  Blink = "\x1b[5m",
  Reverse = "\x1b[7m",
  Hidden = "\x1b[8m",

  FgBlack = "\x1b[30m",
  FgRed = "\x1b[31m",
  FgGreen = "\x1b[32m",
  FgYellow = "\x1b[33m",
  FgBlue = "\x1b[34m",
  FgMagenta = "\x1b[35m",
  FgCyan = "\x1b[36m",
  FgWhite = "\x1b[37m",
  FgGray = "\x1b[90m",

  BgBlack = "\x1b[40m",
  BgRed = "\x1b[41m",
  BgGreen = "\x1b[42m",
  BgYellow = "\x1b[43m",
  BgBlue = "\x1b[44m",
  BgMagenta = "\x1b[45m",
  BgCyan = "\x1b[46m",
  BgWhite = "\x1b[47m",
  BgGray = "\x1b[100m",
}

export default Logger;
