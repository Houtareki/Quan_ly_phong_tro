import express from "express";
import { getContractActive } from "../controllers/contractController.js";

const router = express.Router();

router.get("/active", getContractActive);

export default router;
