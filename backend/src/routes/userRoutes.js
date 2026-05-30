import express from "express";
import {
  createSupportRequest,
  getMyInvoices,
  getMyRoom,
  getTenants,
  getMySupportRequests,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/my-room", getMyRoom);
router.get("/my-invoices", getMyInvoices);
router.get("/my-support-requests", getMySupportRequests);
router.get("/tenants", getTenants);
router.post("/support", createSupportRequest);

export default router;
