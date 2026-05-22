import { Link } from "react-router-dom";
import "./NotFoundPage.css";

const NotFoundPage = () => {
  return (
    <div className="not-found-page">
      <div className="not-found-card">
        <div className="not-found-code">404</div>

        <div className="not-found-divider"></div>

        <h1 className="not-found-title">Không tìm thấy trang</h1>

        <p className="not-found-description">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </p>

        <div className="not-found-actions">
          <Link to="/" className="btn not-found-btn-primary">
            <i className="bi bi-house-door me-2"></i>
            Về trang chủ
          </Link>

          <button
            type="button"
            className="btn not-found-btn-secondary"
            onClick={() => window.history.back()}
          >
            <i className="bi bi-arrow-left me-2"></i>
            Quay lại
          </button>
        </div>
      </div>

      <div className="not-found-bg-circle not-found-bg-circle-1"></div>
      <div className="not-found-bg-circle not-found-bg-circle-2"></div>
    </div>
  );
};

export default NotFoundPage;
