import express from "express";
import authCtl from "../controllers/auth.controller.js";
import pageCtl from "../controllers/page.controller.js";
import { isLoggedIn, hasRole } from "../controllers/auth.controller.js";
import { logOut } from "../controllers/auth.controller.js";

const router = express.Router();

router.get("/", pageCtl.homePage);

router.get("/login", authCtl.loginPage);
router.post("/login", authCtl.login);

router.get("/register", authCtl.registerPage);
router.post("/register", authCtl.register);

router.get("/dashboard", isLoggedIn, pageCtl.dashboardPage);
router.get("/admin", isLoggedIn, hasRole("admin"), pageCtl.adminPage);

router.get("/logOut", logOut);

export default router;