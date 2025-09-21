import mongoose from 'mongoose';
const { Schema } = mongoose;

export const UserRole = {
    CTO: "CTO",
    EMPLOYEE: "Employee"
};

const userSchema = new Schema({
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: Object.values(UserRole) }
});

export const User = mongoose.model('User', userSchema);
