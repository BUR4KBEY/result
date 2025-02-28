[![NPM Version](https://img.shields.io/npm/v/%40burakbey%2Fresult?style=for-the-badge&logo=npm&color=blue&cacheSeconds=3600)](https://npmjs.com/package/@burakbey/result)
[![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/bur4kbey/result/test.yml?style=for-the-badge&label=tests&cacheSeconds=3600)](https://github.com/BUR4KBEY/result/actions/workflows/test.yml)
[![Codecov](https://img.shields.io/codecov/c/github/bur4kbey/result?style=for-the-badge&cacheSeconds=3600)](https://app.codecov.io/gh/BUR4KBEY/result)
[![GitHub License](https://img.shields.io/github/license/bur4kbey/result?style=for-the-badge)](https://github.com/BUR4KBEY/result/blob/main/LICENSE)
[![GitHub Repo stars](https://img.shields.io/github/stars/bur4kbey/result?style=for-the-badge&label=%E2%AD%90%20STARS&color=yellow&cacheSeconds=3600)](https://github.com/BUR4KBEY/result)

# 🎯 [@burakbey/result](https://npmjs.com/package/@burakbey/result)

This library provides a **Rust-inspired** `Result` type for **TypeScript**, ensuring type-safe success and error states while promoting explicit and predictable error handling.

## 🧠 Why Use This?

In TypeScript, error handling often relies on throwing exceptions, which can lead to unpredictable control flow and runtime crashes. This library introduces a **Rust-inspired** `Result` type, enabling you to handle success and error cases explicitly and type-safely, without the pitfalls of thrown exceptions.

While there are existing libraries like [neverthrow](https://www.npmjs.com/package/neverthrow) that implement the `Result` pattern, they can be complex or overwhelming to use. This package offers a **minimalist and easy-to-use** alternative.

## 🚀 Installation

Install the package using your preferred package manager. Here's an example using `pnpm`:

```bash
pnpm add @burakbey/result
```

## 📝 Examples

### Basic Usage

```ts
import { type Result, ok, err } from '@burakbey/result';

// A function that returns a `Result`
function divide(a: number, b: number): Result<number, string> {
  if (b === 0) {
    return err('Division by zero is not allowed');
  }
  return ok(a / b);
}

// Handle the `Result`
const result = divide(10, 2);

if (result.isOk()) {
  console.log('Result:', result.value); // Result: 5
} else {
  console.error('Error:', result.error); // This won't run in this case
}
```

### Extract Both Success and Error as a Tuple

```ts
// Unwrap as a tuple: [successValue, errorValue]
const [value, error] = divide(10, 0).unwrapTuple();

if (error) {
  console.error('Error:', error); // Error: Division by zero is not allowed
} else {
  console.log('Value:', value); // This won't run in this case
}
```

### Unwrapping the Success Value

```ts
const result = divide(10, 2);

// Unwrap the success value (throws if it's `Err`)
const value = result.unwrap();
console.log('Unwrapped Value:', value); // Unwrapped Value: 5

// This will throw if the result is `Err`
const riskyValue = divide(10, 0).unwrap(); // Throws `ResultError`
```

### Unwrapping with Fallback

```ts
const result = divide(10, 0);

// Unwrap with a fallback value
const value = result.unwrapOr(0);
console.log('Value:', value); // Value: 0
```

### Unwrapping the Error

```ts
const result = divide(10, 0);

// Unwrap the error value (throws if it's `Ok`)
const error = result.unwrapErr();
console.log('Unwrapped Error:', error); // Unwrapped Error: Division by zero is not allowed

// This will throw if the result is `Ok`
const riskyError = divide(10, 2).unwrapErr(); // Throws `ResultError`
```

### Transform the Success Value

```ts
const result = divide(10, 2);

// Map the success value to a new one
const mappedResult = result.map(value => value * 2);

if (mappedResult.isOk()) {
  console.log('Mapped Value:', mappedResult.value); // Mapped Value: 10
}
```

### Pattern Matching for Success and Error

```ts
const result = divide(10, 0);

// Match on the result to handle both cases
const output = result.match({
  ok: value => `Success: ${value}`, // Called if the result is `Ok`
  err: error => `Error: ${error}` // Called if the result is `Err`
});

console.log(output); // Error: Division by zero is not allowed
```

### Working with Asynchronous Operations

```ts
import { type AsyncResult, err, ok } from '@burakbey/result';

// Mocking a database function
// Think of this function as coming from a database library
// such as Prisma, TypeORM, or Mongoose.
function lookDb(): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.5) {
        resolve('data'); // Simulate a successful database query
      } else {
        reject(new Error('Database error')); // Simulate a database error
      }
    }, 2000); // Simulate a 2-second delay
  });
}

// This function represents an implementation inside your codebase.
// Note that the `AsyncResult<T, E>` is just `Promise<Result<T, E>>`.
async function getUser(): AsyncResult<string, Error> {
  try {
    const data = await lookDb(); // Await the database query
    return ok(data); // Wrap the success value in an `Ok`
  } catch (error) {
    return err(error as Error); // Wrap the error in an `Err`
  }
}

// Example usage
(async () => {
  const result = await getUser(); // Await the async result (promise)
  const [value, error] = result.unwrapTuple(); // Unwrap the result into a tuple

  if (value) {
    console.log('Success:', value); // Log the success value
  } else {
    console.error('Error:', error); // Log the error
  }
})();
```

## 🧪 Code Coverage and Tests

Tests are crucial for ensuring that the library functions as expected. You can review the code coverage reports by visiting [**Codecov**](https://app.codecov.io/gh/BUR4KBEY/result). The primary objective is to achieve complete coverage of the entire codebase through rigorous testing.

## ☕ Support

If you find this project useful and would like to support [me](https://github.com/BUR4KBEY), you can do so by visiting [my website](https://burakbey.dev).

<a href="https://burakbey.dev" target="_blank"><img src="https://burakbey.dev/github_support_snippet.png" style="height: 56px !important;width: 200px !important;" alt="Buy me a coffee"></img></a>
