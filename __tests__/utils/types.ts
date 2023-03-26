export type AsStringAndNumbers<T> = {
  [K in keyof Partial<T>]: string | number | string[] | number[];
};
