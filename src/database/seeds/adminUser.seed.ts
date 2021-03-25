import User from "../../models/User";
import { UserRole } from "../../models/User";

const user = new User();
user.id = "67d5b820-b40b-467e-ab94-096fd78762fe";
user.fullName = "ADMINISTRATOR";
user.username = "admin";
user.email = "admin@admin.com";
user.isVerified = true;
user.role = UserRole.Admin;
user.password = "admin";

export default user;
