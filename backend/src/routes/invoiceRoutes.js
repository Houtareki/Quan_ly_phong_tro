import express from "express";
import {
  createInvoice,
  getInvoices,
  getInvoiceById,
  addPayment,
  deleteInvoice,
} from "../controllers/invoiceController.js";

const router = express.Router();

router.get("/", getInvoices);
router.get("/:id", getInvoiceById);
router.post("/", createInvoice);
router.post("/:id/payment", addPayment);
router.delete("/:id", deleteInvoice);

export default router;
