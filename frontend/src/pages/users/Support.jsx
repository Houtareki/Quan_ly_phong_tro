import { useState } from "react";
import { sendSupport } from "../reports/services/userService";
import "./Style.css";

function Support() {
  const [content, setContent] = useState("");

  const handleSubmit = async () => {
    if (!content.trim()) return;

    await sendSupport({ content });
    alert("Đã gửi yêu cầu");
    setContent("");
  };

  return (
    <div className="user-card support-page">
      <div className="support-header">
        <h2>Hỗ trợ</h2>
        <p>Gửi yêu cầu hoặc phản hồi đến quản lý phòng trọ</p>
      </div>

      <div className="support-form">
        <label>Nội dung yêu cầu</label>

        <textarea
          className="support-textarea"
          placeholder="Nhập nội dung hỗ trợ của bạn..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={8}
        />

        <button className="btn-primary support-btn" onClick={handleSubmit}>
          Gửi yêu cầu
        </button>
      </div>
    </div>
  );
}

export default Support;