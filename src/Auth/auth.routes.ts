// import express from "express";
// import { login, register } from "./auth.controller";

// const router = express.Router();

// router.post("/register", register);
// router.post("/login", login);

// export default router;



import express from "express";
import { register, login } from "./auth.controller";

const router = express.Router();

// POST /auth/register
router.post("/register", register);

// POST /auth/login
router.post("/login", login);

export default router;
