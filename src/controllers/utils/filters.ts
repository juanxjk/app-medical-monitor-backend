export const removeNullValues = (rawObj: any): any => {
  const obj = { ...rawObj };
  for (const field in obj) if (obj[field] == null) delete obj[field];
  return obj;
};

export const filterFields = <T>(raw: Partial<T>, allowed: (keyof T)[]) => {
  const filtered: Partial<T> = {};

  for (const field in raw)
    if (allowed.includes(field)) filtered[field] = raw[field];

  return filtered;
};
