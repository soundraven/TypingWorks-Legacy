type Func = (arg: any) => any

export const pipe =
  <T>(...fns: Array<(arg: T) => T>) =>
  (input: T) =>
    fns.reduce((acc, fn) => fn(acc), input)
