import 'jest-extended';

import { ResultError, Result, err, ok } from './index';

describe('Result', () => {
  it('should test successful case', () => {
    const r1: Result<number, string> = ok(1);
    const r2: Result<boolean> = ok(true);

    expect(r1.isOk()).toBeTrue();
    expect(r1.isErr()).toBeFalse();
    expect(r1.unwrap()).toBe(1);
    expect(r1.unwrapOr(0)).toBe(1);
    expect(() => r1.unwrapErr()).toThrow(ResultError);
    expect(r1.unwrapTuple()).toStrictEqual([1, undefined]);

    expect(r2.isOk()).toBeTrue();
    expect(r2.isErr()).toBeFalse();
    expect(r2.unwrap()).toBe(true);
    expect(r2.unwrapOr(false)).toBe(true);
    expect(() => r2.unwrapErr()).toThrow(ResultError);
    expect(r2.unwrapTuple()).toStrictEqual([true, undefined]);
  });

  it('should test error case', () => {
    class CustomError {
      name = 'CustomError';
      constructor(public message: string) {}
    }

    const err1 = new Error('example error');
    const err2 = new CustomError('hello world');

    const r1: Result<number, Error> = err(err1);
    const r2: Result<boolean, CustomError> = err(err2);
    const r3: Result<boolean, Error> = err(err2);

    expect(r1.isOk()).toBeFalse();
    expect(r1.isErr()).toBeTrue();
    expect(() => r1.unwrap()).toThrow(ResultError);
    expect(r1.unwrapOr(0)).toBe(0);
    expect(r1.unwrapErr()).toBe(err1);
    expect(r1.unwrapTuple()).toStrictEqual([undefined, err1]);

    expect(r2.isOk()).toBeFalse();
    expect(r2.isErr()).toBeTrue();
    expect(() => r2.unwrap()).toThrow(ResultError);
    expect(r2.unwrapOr(false)).toBe(false);
    expect(r2.unwrapErr()).toBe(err2);
    expect(r2.unwrapTuple()).toStrictEqual([undefined, err2]);

    expect(r3.isOk()).toBeFalse();
    expect(r3.isErr()).toBeTrue();
    expect(() => r3.unwrap()).toThrow(ResultError);
    expect(r3.unwrapOr(true)).toBe(true);
    expect(r3.unwrapErr()).toBe(err2);
    expect(r3.unwrapTuple()).toStrictEqual([undefined, err2]);
  });

  it('should map values correctly', () => {
    const r1: Result<number, string> = ok(10);
    const r2: Result<number, string> = err('error');

    const mappedOk = r1.map(x => x * 2);
    expect(mappedOk.unwrap()).toBe(20);

    const mappedErr = r2.map(x => x * 2);
    expect(mappedErr.isErr()).toBeTrue();
    expect(mappedErr.unwrapErr()).toBe('error');
  });

  it('should match correctly', () => {
    const r1: Result<number, string> = ok(10);
    const r2: Result<number, string> = err('error');

    const okResult = r1.match({
      err: error => `Failure: ${error}`,
      ok: value => `Success: ${value}`
    });
    expect(okResult).toBe('Success: 10');

    const errResult = r2.match({
      err: error => `Failure: ${error}`,
      ok: value => `Success: ${value}`
    });
    expect(errResult).toBe('Failure: error');
  });
});
