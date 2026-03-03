import db from "../db/db.js";
import bcrypt from "bcrypt";

export const findUserByUsername = async (username) => {
    const [results] = await db.query(
        "SELECT userId, username, password, role FROM users WHERE username = ? LIMIT 1",
        [username]
    );
    return results[0];
};

export const createUser = async (username, plainPassword, role = "user") => {
    if (!username) throw new Error("Username required");
    if(!plainPassword) throw new Error("Password required");
    if(role !== "user" && role !== "admin") throw new Error("Invalid role");    

    const passwordHash = await hashPassword(plainPassword);

    const [result] = await db.execute(
        "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
        [username, passwordHash, role]
    );

    return {
        userId: result.insertId,
        username,
        role
    };
};

export const hashPassword = async (plainPassword) => {
    const saltRounds = 10;
    return await bcrypt.hash(plainPassword, saltRounds);
};

export const validatePassword = async (plainPassword, storedHash) => {
    console.log(plainPassword);
    console.log(storedHash);
    return await bcrypt.compare(plainPassword, storedHash);
}