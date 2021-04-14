import { ILike } from "typeorm";

export function convertToILike(where: any) {
  const newWhere = { ...where };

  for (const key in newWhere)
    if (typeof newWhere[key] == "string")
      newWhere[key] = ILike(`%${newWhere[key]}%`);

  return newWhere;
}
