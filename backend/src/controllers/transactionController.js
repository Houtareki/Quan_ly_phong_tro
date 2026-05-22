import Transaction from "../models/Transaction.js";
export const createTransaction = async (req, res) => {
  try {
    const { type, amount, category, roomId, date, description } = req.body;

    const transaction = await Transaction.create({
      type,
      amount,
      category,
      date: date || new Date(),
      roomId: roomId || null,
      description,
    });

    const savedTransaction = await transaction.save();
    res
      .status(201)
      .json({ message: "Tạo giao dịch thành công", data: savedTransaction });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi tạo giao dịch", error: error.message });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const { type } = req.query;
    let query = {};

    if (type && type !== "ALL") {
      query.type = type;
    }

    const transactions = await Transaction.find(query)
      .populate("roomId", "roomCode")
      .sort({ date: -1, createdAt: -1 });

    const allTransactions = await Transaction.find({});
    let totalIncomes = 0;
    let totalExpenses = 0;

    allTransactions.forEach((transaction) => {
      if (transaction.type === "INCOME") {
        totalIncomes += transaction.amount;
      } else {
        totalExpenses += transaction.amount;
      }
    });

    res.status(200).json({
      message: "Lấy danh sách giao dịch thành công",
      data: transactions,
      summary: {
        totalIncomes,
        totalExpenses,
        totalBalance: totalIncomes - totalExpenses,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy danh sách giao dịch",
      error: error.message,
    });
  }
};
