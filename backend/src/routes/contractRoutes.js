import express from "express";
import {
  getContractActive,
  createContract,
  updateContract,
  deleteContract,
} from "../controllers/contractController.js";

const router = express.Router();

router.get("/active", getContractActive);
router.post("/", createContract);
router.patch("/:contractId", updateContract);
router.delete("/:contractId", deleteContract);

export default router;
