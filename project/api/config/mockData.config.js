import {User, UserRole} from "../models/user.model.js";
import bcrypt from "bcryptjs";


export const mockData = async () => {
    const count = await User.countDocuments();

    if (count === 0) {
        const hashedAdminPw = await bcrypt.hash("1234", 10);
        const hashedEmployeePw = await bcrypt.hash("4321", 10);

        await User.insertMany([
            { email: "admin@admin.ch", password: hashedAdminPw, role: UserRole.CTO},
            { email: "employee@employee.ch", password: hashedEmployeePw, role: UserRole.EMPLOYEE }
        ]);
        console.log("Default Users inserted");
    }
};
