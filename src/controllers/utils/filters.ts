export const removeNullValues = (rawObj: any): any => {
  const obj = { ...rawObj };
  for (const field in obj) if (obj[field] == null) delete obj[field];
  return obj;
};
