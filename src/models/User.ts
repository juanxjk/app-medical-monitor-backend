import bcrypt from "bcrypt";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from "typeorm";

import appConfig from "../config";

export enum UserRole {
  Admin = "admin",
  Doctor = "doctor",
  Nurse = "nurse",
  Physiotherapist = "physiotherapist",
  Patient = "patient",
  Guest = "guest",
}

@Entity({ name: "users" })
export default class User {
  @PrimaryGeneratedColumn("uuid")
  public id!: string;

  @Column({ nullable: false })
  public fullName!: string;

  @Column({ nullable: false, unique: true })
  public username!: string;

  public set password(password: string) {
    this.passwordHash = bcrypt.hashSync(password, appConfig.bcryptRounds);
  }

  @Column({ nullable: false, select: false })
  public passwordHash!: string;

  @Column({ nullable: false, unique: true })
  public email!: string;

  @Column({ nullable: false, default: false })
  public isVerified!: boolean;

  @Column({ nullable: false, default: false })
  public isBanned!: boolean;

  @Column({
    type: "enum",
    enum: UserRole,
    nullable: false,
    default: UserRole.Guest,
  })
  public role!: UserRole;

  public checkPassword(password: string): boolean {
    return bcrypt.compareSync(password, this.passwordHash);
  }

  @CreateDateColumn()
  public createdAt!: Date;

  @UpdateDateColumn()
  public updatedAt?: Date;

  @DeleteDateColumn()
  public deletedAt?: Date;
}
