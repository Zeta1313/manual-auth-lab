import express from 'express';
import defaultRouter from './routers/routes.js';
import dotenv from 'dotenv';
import session from "express-session";

//configure Express.js app
const app = express();

dotenv.config();

//view engine
app.set("view engine", "ejs");
app.set("views", "src/views");

//static directories
app.use(express.static('public'));

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

app.use((req, res, next) => {
    if (req.session.user) {
        req.user = req.session.user;
    }
    else {
        req.user=null;
    }
    next();
});

//routers
app.use("/", defaultRouter);

export default app;