import Patient from "./Patient";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm";

export enum DeviceStatus {
  None = "none",
  Active = "active",
  Maintenance = "maintenance",
  Inactive = "inactive",
}

@Entity({ name: "devices" })
export default class Device {
  @PrimaryGeneratedColumn("uuid")
  public id!: string;

  @Column({ nullable: false })
  public title!: string;

  @Column({ nullable: true })
  public description?: string;

  @Column({
    type: "enum",
    enum: DeviceStatus,
    nullable: false,
    default: DeviceStatus.None,
  })
  public status: DeviceStatus = DeviceStatus.None;

  @Column({ nullable: false })
  public canMeasureHeartRate: boolean = false;

  @Column({ nullable: false })
  public canMeasureO2Pulse: boolean = false;

  @Column({ nullable: false })
  public canMeasureTemp: boolean = false;

  @ManyToOne((type) => Patient, (patient) => patient.devices)
  public patient?: Patient;

  @CreateDateColumn()
  public createdAt!: Date;

  @UpdateDateColumn()
  public updatedAt?: Date;

  @DeleteDateColumn()
  public deletedAt?: Date;
}
