/**
 * A type representing either a successful value of type `TSuccess` or an error of type `TError`.
 * Similar to Rust's Result type, providing a way to handle errors without exceptions.
 */
export type Result<TSuccess, TError = never> =
  | Err<TSuccess, TError>
  | Ok<TSuccess, TError>;

/**
 * A type representing either a successful value of type `TSuccess` or an error of type `TError`.
 * Similar to Rust's `Result` type, providing a way to handle errors without exceptions.
 *
 * This type is used for asynchronous operations that return a `Promise` of a `Result` type.
 * It allows for explicit handling of success and error states in asynchronous functions.
 *
 * Equivalent to `Promise<Result<TSuccess, TError>>`.
 */
export type AsyncResult<TSuccess, TError = never> = Promise<
  Result<TSuccess, TError>
>;

/**
 * Abstract base class that implements shared functionality for both `Ok` and `Err` variants.
 */
abstract class BaseResult<TSuccess, TError> {
  /**
   * Applies a function to the contained value based on the variant (`Ok` or `Err`).
   * @param options Object containing handler functions for both variants
   * @returns The result of applying the appropriate function
   */
  match<U>(options: {
    ok: (value: TSuccess) => U;
    err: (error: TError) => U;
  }): U {
    if (this.isOk()) return options.ok(this.value);

    return options.err((this as unknown as Err<TSuccess, TError>).error);
  }

  /**
   * Returns a tuple containing either `[value, undefined]` for `Ok` variants or
   * `[undefined, error]` for `Err` variants.
   * @returns A tuple of `[value, error]` with one element always undefined
   */
  unwrapTuple(): [value: undefined | TSuccess, error: undefined | TError] {
    if (this.isOk()) return [this.value, undefined];

    return [undefined, (this as unknown as Err<TSuccess, TError>).error];
  }

  /**
   * Maps a `Result<T, E>` to `Result<U, E>` by applying a function to the contained
   * `Ok` value, leaving an `Err` value untouched.
   * @param fn Function to apply to the success value
   * @returns A new `Result` with the mapped value if `Ok`, or the original error if `Err`
   */
  map<U>(fn: (value: TSuccess) => U): Result<U, TError> {
    if (this.isOk()) return new Ok(fn(this.value));

    return this as unknown as Err<U, TError>;
  }

  /**
   * Extracts the error value from an `Err` result.
   * @throws `ResultError` if called on an `Ok` variant
   * @returns The error value
   */
  unwrapErr(): TError {
    if (this.isErr()) return this.error;

    throw new ResultError('Called unwrapErr on an Ok value');
  }

  /**
   * Extracts the success value from an `Ok` result.
   * @throws `ResultError` if called on an `Err` variant
   * @returns The success value
   */
  unwrap(): TSuccess {
    if (this.isOk()) return this.value;

    throw new ResultError('Called unwrap on an Err value');
  }

  /**
   * Extracts the success value from an `Ok` result, or returns the provided fallback if `Err`.
   * @param fallback The value to return if this is an `Err` variant
   * @returns The success value or the fallback
   */
  unwrapOr(fallback: TSuccess): TSuccess {
    if (this.isOk()) return this.value;

    return fallback;
  }

  /**
   * Type guard that checks if this result is an `Err` variant.
   * @returns `true` if the result is an `Err` variant, `false` otherwise
   */
  isErr(): this is Err<TSuccess, TError> {
    return this instanceof Err;
  }

  /**
   * Type guard that checks if this result is an `Ok` variant.
   * @returns `true` if the result is an `Ok` variant, `false` otherwise
   */
  isOk(): this is Ok<TSuccess, TError> {
    return this instanceof Ok;
  }
}

/**
 * Represents a successful computation containing a value.
 */
class Ok<TSuccess, TError> extends BaseResult<TSuccess, TError> {
  constructor(public readonly value: TSuccess) {
    super();
  }
}

/**
 * Represents a failed computation containing an error.
 */
class Err<TSuccess, TError> extends BaseResult<TSuccess, TError> {
  constructor(public readonly error: TError) {
    super();
  }
}

/**
 * Custom error class for this library, ensuring that errors can be easily traced
 * back to their source within the library. This helps distinguish them from
 * generic errors.
 */
export class ResultError extends Error {
  name = 'ResultError';

  constructor(message: string) {
    super(message);
  }
}

/**
 * Creates a new `Ok` result containing a success value.
 * @param value The success value
 * @returns A `Result` in the `Ok` variant
 */
export function ok<TSuccess, TError = never>(
  value: TSuccess
): Result<TSuccess, TError> {
  return new Ok(value);
}

/**
 * Creates a new `Err` result containing an error value.
 * @param error The error value
 * @returns A `Result` in the `Err` variant
 */
export function err<TError, TSuccess = never>(
  error: TError
): Result<TSuccess, TError> {
  return new Err(error);
}
