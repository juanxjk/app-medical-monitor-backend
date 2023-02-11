import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm";
import Device from "./Device";

export enum GenderType {
  Male = "male",
  Female = "female",
}

export enum PatientStatus {
  None = "none",
  Waiting = "waiting",
  Treatment = "treatment",
  Discharged = "discharged",
}

@Entity({ name: "patients" })
export default class Patient {
  @PrimaryGeneratedColumn("uuid")
  public id!: string;

  @Column({ nullable: false })
  public fullName!: string;

  @Column({ nullable: false })
  public cpf!: string;

  @Column({
    type: "enum",
    enum: GenderType,
    nullable: false,
  })
  public gender!: GenderType;

  @Column({ nullable: false })
  public birthDate!: Date;

  @Column({
    type: "enum",
    enum: PatientStatus,
    nullable: false,
    default: PatientStatus.None,
  })
  public status!: PatientStatus;

  @Column({ nullable: true })
  public bed?: string;

  @Column("text", { nullable: true })
  public note?: string;

  @Column({ nullable: true })
  public prognosis?: string;

  @Column({
    type: "jsonb",
    array: false,
    default: () => "'[]'",
    nullable: false,
  })
  public illnesses!: Array<string>;

  @Column({
    type: "jsonb",
    array: false,
    default: () => "'[]'",
    nullable: false,
  })
  public comorbidities!: Array<string>;

  @OneToMany((type) => Device, (device) => device.patient)
  public devices?: Device[];

  @CreateDateColumn()
  public createdAt!: Date;

  @UpdateDateColumn()
  public updatedAt?: Date;

  @DeleteDateColumn()
  public deletedAt?: Date;
}
