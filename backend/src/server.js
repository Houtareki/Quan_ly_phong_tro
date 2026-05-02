import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./configs/db.js";
import "./models/User.js";
import "./models/Room.js";
import "./models/Contract.js";
import "./models/Invoice.js";
import "./models/PaymentTransaction.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import contractRoutes from "./routes/contractRoutes.js";
import paymentTransactionRoutes from "./routes/paymentTransactionRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend quản lý phòng trọ đang chạy");
});

app.use("/api/invoices", invoiceRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/contracts", contractRoutes);
app.use("/api/payment-transactions", paymentTransactionRoutes);
app.use("/api/reports", reportRoutes);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
  });
});
