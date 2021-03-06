import * as typeorm from "typeorm";
import { DeepPartial } from "typeorm";
import { convertToILike } from "./utils/find";

import app from "../App";

type FindOneOptions<T> = {
  withDeleted?: boolean;
  select?: (keyof T)[];
  where?: Partial<T>;
  relations?: string[];
  withRelations?: boolean;
};

const getDefaultFindOneOptions = <T>(): FindOneOptions<T> => {
  return {
    withDeleted: false,
    withRelations: false,
  };
};

type FindManyOptions<T> = FindOneOptions<T> & {
  page?: number;
  size?: number;
};

const getDefaultFindManyOptions = <T>(): FindManyOptions<T> => {
  return {
    ...getDefaultFindOneOptions<T>(),
    page: 1,
    size: 25,
  };
};

export interface Repository<T> {
  findByID(id: string | number, options?: FindOneOptions<T>): Promise<T>;

  findAll(options?: FindManyOptions<T>): Promise<T[]>;

  findOne(query: T, options?: FindOneOptions<T>): Promise<T>;

  store(data: T): Promise<T>;

  update(id: string | number, data: DeepPartial<T>): Promise<T>;

  delete(id: string | number): Promise<boolean>;
}

export default class GenericRepository<T> implements Repository<T> {
  protected get repository() {
    if (app.dbConnection) return app.dbConnection.getRepository(this.type);
    else {
      throw new Error("Database not connected.");
    }
  }
  constructor(private type: { new (params?: Partial<T>): T }) {}

  async findByID(id: string | number, options?: FindOneOptions<T>): Promise<T> {
    const optionsWithDefault: FindOneOptions<T> = {
      ...getDefaultFindOneOptions(),
      ...options,
    };

    const foundData = await this.repository.findOne(id, {
      withDeleted: optionsWithDefault.withDeleted,
      select: optionsWithDefault.select,
      relations: optionsWithDefault.relations,
      loadRelationIds: optionsWithDefault.withRelations,
    });
    if (!foundData) throw new Error("Not found");
    return foundData;
  }

  async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    const optionsWithDefault: FindManyOptions<T> = {
      ...getDefaultFindManyOptions(),
      ...options,
    };

    const page = optionsWithDefault.page!;
    const size = optionsWithDefault.size!;

    if (page < 0) throw new Error("'page' param must be greater than 0");
    if (size < 0) throw new Error("'size' param must be greater than 0");
    if (size > 25) throw new Error("'size' param can not be greater than 25");

    let skip = (page - 1) * size;
    let take = size;

    const whereWithILike = convertToILike(optionsWithDefault.where);

    return this.repository.find({
      skip,
      take,
      withDeleted: optionsWithDefault.withDeleted,
      select: optionsWithDefault.select,
      relations: optionsWithDefault.relations,
      where: whereWithILike,
      loadRelationIds: optionsWithDefault.withRelations,
    });
  }

  async findOne(
    query: typeorm.FindConditions<T>,
    options?: FindOneOptions<T>
  ): Promise<T> {
    const optionsWithDefault: FindOneOptions<T> = {
      ...getDefaultFindOneOptions(),
      ...options,
    };

    const foundData = await this.repository.findOne(query, {
      withDeleted: optionsWithDefault.withDeleted,
      select: optionsWithDefault.select,
      relations: optionsWithDefault.relations,
      loadRelationIds: optionsWithDefault.withRelations,
    });
    if (!foundData) throw new Error("Not found");
    return foundData;
  }

  async store(data: T): Promise<T> {
    const result = await this.repository.save(data);
    return result;
  }

  async update(id: string | number, data: DeepPartial<T>): Promise<T> {
    const originalData = await this.repository.findOne(id);
    if (!originalData) {
      throw new Error("Not found");
    }
    const updateData = { ...originalData, ...data };
    const updatedData = this.repository.save(updateData);

    return updatedData;
  }

  async delete(id: string | number): Promise<boolean> {
    const foundData = await this.repository.findOne(id);
    if (!foundData) throw new Error("Not found");
    const result = await this.repository.softDelete(id);

    if (result.affected) return true;
    return false;
  }
}
