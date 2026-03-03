import { createUser, findUserByUsername, validatePassword } from "../services/user.service.js";

const loginPage = (req, res) => {
    res.render("login", {
        title: "Login",
        errors: req.query.errors || null
    });
};

const registerPage = (req, res) => {
    res.render("register", {
        title: "Register",
        errors: req.query.errors || null
    });
};

const register = async (req, res) => {
    const { username, password, confirm, role } = req.body;

    if (!username || !password || !confirm) {
        return res.redirect("/register?errors=All fields required");
    }
    if (password !== confirm) {
        return res.redirect("/register?errors=Passwords must match");
    }
    if (role!=="user" && role!=="admin") {
        return res.redirect("/register?errors=invalid role");
    }

    await createUser(username, password, role);
    return res.redirect("/login");
};

const login = async (req, res) => {
    const { username, password} = req.body;

    if (!username || !password) {
        return res.redirect("/login?errors=All fields required");
    }
    
    const user = await findUserByUsername(username);
    if(!user) {
        return res.redirect("/login?errors=Invalid Credentials");
    }

    const isValid = await validatePassword(password, user.password);
    if(!isValid) {
        return res.redirect("/login?errors=Invalid Credentials");
    }

    req.session.user = {
        userId: user.userId,
        username: user.username,
        role: user.role
    };

    return res.redirect("/dashboard");
};

export const isLoggedIn = (req, res, next) => {
    if (!req.user) {
        return res.redirect("/login?erors=Please log in first");
    }
    next();
}

export const hasRole = (role) => {
    return (req, res, next) => {
        if (!req.user || req.user.role !== role) {
            return res.redirect("/login?errors=Acess Denied");
        }
        next();
    };
};

export const logOut = (req, res) => {
    req.session.destroy(() => {
        return res.redirect("/login");
    });
};

export default { loginPage, registerPage, register, login };