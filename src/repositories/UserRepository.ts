import User from "../models/User";
import GenericRepository from "./GenericRepository";

export default class UserRepository extends GenericRepository<User> {
  constructor() {
    super(User);
  }
}
