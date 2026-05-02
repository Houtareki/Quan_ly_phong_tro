import express from "express";
import {
  confirmPaymentTransaction,
  createPaymentRequest,
  getPaymentTransactionById,
  getPaymentTransactions,
  rejectPaymentTransaction,
} from "../controllers/paymentTransactionController.js";

const router = express.Router();

router.get("/", getPaymentTransactions);
router.post("/", createPaymentRequest);
router.get("/:id", getPaymentTransactionById);
router.patch("/:id/confirm", confirmPaymentTransaction);
router.patch("/:id/reject", rejectPaymentTransaction);

export default router;
