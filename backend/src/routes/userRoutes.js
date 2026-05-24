import express from "express";
import {
  createSupportRequest,
  getMyInvoices,
  getMyRoom,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/my-room", getMyRoom);
router.get("/my-invoices", getMyInvoices);
router.post("/support", createSupportRequest);

export default router;
