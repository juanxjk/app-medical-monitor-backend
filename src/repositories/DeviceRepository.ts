import GenericRepository from "./GenericRepository";
import Device from "../models/Device";

export default class DeviceRepository extends GenericRepository<Device> {
  constructor() {
    super(Device);
  }
}
