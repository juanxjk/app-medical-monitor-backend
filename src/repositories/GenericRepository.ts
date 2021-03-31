import * as typeorm from "typeorm";
import { DeepPartial } from "typeorm";

import app from "../App";

type FindOneOptions<T> = {
  withDeleted?: boolean;
  select?: (keyof T)[];
  relations?: string[];
  withRelations?: boolean;
};

type FindManyOptions<T> = FindOneOptions<T> & {
  page?: number;
  size?: number;
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
    const withDeleted = options?.withDeleted ?? false;
    const select = options?.select;
    const relations = options?.relations;
    const withRelations = options?.withRelations ?? false;

    const foundData = await this.repository.findOne(id, {
      withDeleted,
      select,
      relations,
      loadRelationIds: withRelations,
    });
    if (!foundData) throw new Error("Not found");
    return foundData;
  }

  async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    const page = options?.page ?? 1;
    const size = options?.size ?? 25;
    const withDeleted = options?.withDeleted ?? false;
    const select = options?.select;
    const relations = options?.relations;
    const withRelations = options?.withRelations ?? false;

    if (page < 0) throw new Error("'page' param must be greater than 0");
    if (size < 0) throw new Error("'size' param must be greater than 0");
    if (size > 25) throw new Error("'size' param can not be greater than 25");

    let skip = (page - 1) * size;
    let take = size;

    return this.repository.find({
      skip,
      take,
      withDeleted,
      select,
      relations,
      loadRelationIds: withRelations,
    });
  }

  async findOne(
    query: typeorm.FindConditions<T>,
    options?: FindOneOptions<T>
  ): Promise<T> {
    const withDeleted = options?.withDeleted ?? false;
    const select = options?.select;
    const relations = options?.relations;
    const withRelations = options?.withRelations ?? false;

    const foundData = await this.repository.findOne(query, {
      withDeleted,
      select,
      relations,
      loadRelationIds: withRelations,
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
