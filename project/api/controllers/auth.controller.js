import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import {logEvent} from "../utils/logEvent.js";

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(401).json({ message: 'Email and password are required!' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        if (user.role === 'CTO') {
            const logMessage = `CTO LOGIN erfolgreich: Benutzer ${user.email} hat sich angemeldet.`;
            logEvent(logMessage);
        }

        const token = jwt.sign({ email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 60 * 60 * 1000
        });

        return res.json({ role: user.role });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const logout = async (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict'
    });
    res.status(200).json({ message: 'Logged out' });
}

const userInformation = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Not authenticated' });
    }

    return res.json({ role: req.user.role });
}

export { login, logout, userInformation};