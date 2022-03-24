import { pipe } from "fp-ts/function";
import { array as A, option as O, string as S } from "fp-ts";
import {
  /**
   * @function generateKeyBetween
   * @param {(string | null)} a
   * @param {(string | null)} b
   * @param {(string | undefined)} [digits]
   */
  generateKeyBetween,
  /**
   * @function generateKeyBetween
   * @param {(string | null)} a
   * @param {(string | null)} b
   * @param {number} n
   * @param {(string | undefined)} [digits]
   */
  generateNKeysBetween,
} from "fractional-indexing";

/**
 * Base movement function, use `moveUp` or `moveDown` instead.
 * @function move
 */
export const move =
  (up = false /* @type{moveUp|moveDown} */) =>
  (allIndexes: string[] = [], currentIndex: string = "") => {
    const sorted = A.sort(S.Ord)(allIndexes);
    const last: string | null = pipe(
      sorted,
      A.last,
      O.getOrElse(() => null)
    );
    const first: string | null = pipe(
      sorted,
      A.head,
      O.getOrElse(() => null)
    );

    return pipe(
      sorted,
      A.uniq(S.Eq),
      A.filterMapWithIndex((i, index) =>
        currentIndex === index ? O.some(i) : O.none
      ),
      A.head,
      O.fold(
        () =>
          up ? generateKeyBetween(null, first) : generateKeyBetween(last, null),
        (i) =>
          up
            ? generateKeyBetween(sorted[i - 2] ?? null, sorted[i - 1] ?? null)
            : generateKeyBetween(sorted[i + 1] ?? null, sorted[i + 2] ?? null)
      )
    );
  };

/**
 * Given a list of indices, get a new index for moving current index up one position in the list.
 * @function moveUp
 * @param {Array<string>} [allIndexes=[]]
 * @param {string} [currentIndex=""]
 * @returns {string}
 */
export const moveUp = move(true);

/**
 * Given a list of indices, get a new index for moving current index down one position in the list.
 * @function moveDown
 * @param {Array<string>} [allIndexes=[]]
 * @param {string} [currentIndex=""]
 * @returns {string}
 */
export const moveDown = move(false);

/**
 * Get the starting index for a new list.
 * @returns {string}
 */
export const getStartIndex = () => generateKeyBetween(null, null);

export { generateKeyBetween, generateNKeysBetween };
