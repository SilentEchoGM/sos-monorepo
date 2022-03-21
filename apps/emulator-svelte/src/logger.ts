type LogLevel = "info" | "error" | "warn" | "debug";
type LogMeta = { filepath: string; [key: string]: any };

let maxLengthFilepath = 0;

const createLevel =
  (level: LogLevel, meta: LogMeta) =>
  (message: string, obj: any = null) => {
    if (maxLengthFilepath < meta.filepath.length) {
      maxLengthFilepath = meta.filepath.length;
    }

    const formatted = [
      new Date().toISOString(),
      level === "error" ? level : " " + level,
      meta.filepath.padEnd(maxLengthFilepath, " "),
      "\n",
      message,
    ];

    const formatObj = (obj: any) => {
      if (!obj) return ["\n"];
      if (typeof obj !== "object")
        return [
          {
            value: obj,
          },
          "\n",
        ];
      return [obj, "\n"];
    };

    console[level](...formatted, ...formatObj(obj));
  };

export const getLogger = (meta: LogMeta) => {
  return {
    info: createLevel("info", meta),
    error: createLevel("error", meta),
    warn: createLevel("warn", meta),
    verbose: createLevel("debug", meta),
  };
};
