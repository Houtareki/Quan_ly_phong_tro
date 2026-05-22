import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../../components/layout/AppLayout";
import PageHeader from "../../components/common/PageHeader";
import { getTransactions } from "./services/transactionApi";
import "./TransactionListPage.css";

const TransactionListPage = () => {
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    totalIncomes: 0,
    totalExpenses: 0,
    totalBalance: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("ALL");

  const fetchTransactions = async (type) => {
    setLoading(true);
    try {
      const result = await getTransactions(type);

      setTransactions(result.data);
      if (type === "ALL") {
        setSummary(result.summary);
      }
      setError(null);
    } catch (error) {
      setError(error.message || "Không thể lấy danh sách giao dịch");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(filter);
  }, [filter]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <AppLayout>
      <PageHeader
        title="Quản lý Thu/Chi"
        description="Theo dõi dòng tiền, thu chi của phòng trọ"
        action={
          <button
            type="button"
            className="btn btn-success fw-bold px-4 rounded-pill shadow-sm"
            onClick={() => navigate("/transactions/create")}
          >
            <i className="bi bi-plus-lg me-2"></i> Thêm giao dịch
          </button>
        }
      />

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="d-flex flex-wrap gap-3 mb-4">
        <div className="transaction-summary-card summary-income shadow-sm">
          <p className="text-muted mb-1">Tổng thu</p>
          <h4 className="amount-income mb-0">
            {formatCurrency(summary.totalIncomes)}
          </h4>
        </div>
        <div className="transaction-summary-card summary-expense shadow-sm">
          <p className="text-muted mb-1">Tổng chi</p>
          <h4 className="amount-expense mb-0">
            {formatCurrency(summary.totalExpenses)}
          </h4>
        </div>
        <div className="transaction-summary-card summary-balance shadow-sm">
          <p className="text-muted mb-1">Số dư</p>
          <h4 className="amount-balance mb-0">
            {formatCurrency(summary.totalBalance)}
          </h4>
        </div>
      </div>
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${filter === "ALL" ? "active fw-bold text-success" : "text-muted"}`}
            onClick={() => setFilter("ALL")}
          >
            Tất cả
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${filter === "INCOME" ? "active fw-bold text-success" : "text-muted"}`}
            onClick={() => setFilter("INCOME")}
          >
            Thu
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${filter === "EXPENSE" ? "active fw-bold text-success" : "text-muted"}`}
            onClick={() => setFilter("EXPENSE")}
          >
            Chi
          </button>
        </li>
      </ul>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status"></div>
        </div>
      ) : (
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body p-0">
            {transactions.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <i className="bi bi-inbox fs-1 mb-3 d-block"></i>
                <p>Không có giao dịch nào</p>
              </div>
            ) : (
              <ul className="list-group list-group-flush rounded-4">
                {transactions.map((trans) => (
                  <li
                    key={trans._id}
                    className={`list-group-item p-3 transaction-list-item ${trans.type === "INCOME" ? "transaction-income" : "transaction-expense"}`}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center gap-3">
                        <div
                          className={`rounded-circle p-2 d-flex align-items-center justify-content-center ${trans.type === "INCOME" ? "bg-success bg-opacity-10 text-success" : "bg-danger bg-opacity-10 text-danger"}`}
                          style={{ width: "40px", height: "40px" }}
                        >
                          {" "}
                          <i
                            className={`bi ${trans.type === "INCOME" ? "bi-arrow-down-left" : "bi-arrow-up-right"}`}
                          ></i>
                        </div>
                        <h6 className="mb-1 fw-bold">{tx.category}</h6>
                        <small className="text-muted">
                          {formatDate(trans.date)}{" "}
                          {trans.roomId
                            ? `• Phòng: ${trans.roomId?.roomCode}`
                            : ""}
                        </small>
                        {trans.description && (
                          <div className="text-muted small mt-1">
                            {trans.description}
                          </div>
                        )}
                        <div
                          className={
                            tx.type === "INCOME"
                              ? "amount-income"
                              : "amount-expense"
                          }
                        >
                          {tx.type === "INCOME" ? "+" : "-"}
                          {formatCurrency(tx.amount)}
                        </div>
                      </div>
                      <div
                        className={
                          trans.type === "INCOME"
                            ? "amount-income"
                            : "amount-expense"
                        }
                      >
                        {trans.type === "INCOME" ? "+" : "-"}
                        {formatCurrency(trans.amount)}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default TransactionListPage;
