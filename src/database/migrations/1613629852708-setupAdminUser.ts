import { MigrationInterface, QueryRunner } from "typeorm";

import user from "../seeds/adminUser.seed";
import User from "../../models/User";

export class setupAdminUser1613629852708 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.connection.getRepository(User).insert(user);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.connection.getRepository(User).remove(user);
  }
}
