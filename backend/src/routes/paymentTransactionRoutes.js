import express from "express";
import {
  confirmPaymentTransaction,
  createPaymentRequest,
  getPaymentTransactionById,
  getPaymentTransactions,
  rejectPaymentTransaction,
  createVNPayUrl,
  handleVNPayReturn,
} from "../controllers/paymentTransactionController.js";

const router = express.Router();

router.get("/", getPaymentTransactions);
router.post("/", createPaymentRequest);
router.post("/vnpay-url", createVNPayUrl);
router.get("/vnpay-return", handleVNPayReturn);
router.get("/:id", getPaymentTransactionById);
router.patch("/:id/confirm", confirmPaymentTransaction);
router.patch("/:id/reject", rejectPaymentTransaction);

export default router;
