import { Router } from "express";
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  loginUser,
  updateUser,
} from "../controllers/user";
import {
  validateLoginPayload,
  validateUserPayload,
} from "../middleware/validateRequest";

const usersRouter = Router();

usersRouter.get("/", getUsers);
usersRouter.get("/:id", getUserById);
usersRouter.post("/", validateUserPayload("create"), createUser);
usersRouter.post("/login", validateLoginPayload, loginUser);
usersRouter.put("/:id", validateUserPayload("update"), updateUser);
usersRouter.delete("/:id", deleteUser);

export default usersRouter;
