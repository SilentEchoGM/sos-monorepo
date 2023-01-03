import { array as A, function as f, task as T, taskEither as TE } from "fp-ts";
import db from "localforage";
import { get, Subscriber, Writable, writable } from "svelte/store";
import { getLogger } from "./logger";
const log = getLogger({ filepath: "src/frontend/lib/stores.ts" });

export const persistent = <T>(key: string, defaultValue: T) => {
  let initialized = false;

  const { set, subscribe } = writable(defaultValue);

  const load = async () => {
    try {
      const value = (await db.getItem(key)) as T;
      if (value) {
        log.info(`Loaded ${key} from persistent store`, value);
        set(value);
      } else {
        log.warn(
          `No value found for key ${key}, using default value`,
          defaultValue
        );
        set(defaultValue);
      }
      initialized = true;
    } catch (err) {
      log.error("Failed to load persistent store", err);
    }
  };

  const save = (value: T) => {
    if (initialized) {
      db.setItem(key, value)
        .then(() => {
          set(value);
        })
        .catch((err) => {
          log.error("Failed to save value", err);
        });
    }
  };

  const updateSavedValue = (fn: (value: T) => T) => {
    if (initialized) {
      f.pipe({ subscribe }, get, fn, save);
    }
  };

  load();

  return {
    set: save,
    update: updateSavedValue,
    subscribe,
    load,
    reset: () => {
      save(defaultValue);
    },
    get value() {
      if (initialized) return get({ subscribe });
      return null;
    },
  };
};

export type Persistent<T> = Writable<T> & {
  load: () => Promise<void>;
  reset: () => void;
  readonly value: T;
};

export const getDataExport = f.pipe(
  TE.tryCatch(
    () => db.keys(),
    (err) => new Error(`Unable to fetch db keys: ${err}`)
  ),
  TE.chain((keys) =>
    f.pipe(
      keys,
      A.map((key: string) =>
        TE.tryCatch(
          () => db.getItem(key),
          (err) => new Error(`Unable to fetch db key ${key}: ${err}`)
        )
      ),
      TE.sequenceArray
    )
  ),
  TE.fold((err) => {
    log.error("Failed to export data", err);
    return T.of([]);
  }, T.of)
);

export const downloadData = (filename: string) => (text: string) => {
  var element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:application/json;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);

  log.info("Data exported to file", { filename, text });
};
