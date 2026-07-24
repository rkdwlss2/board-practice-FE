import { useState } from "react";
import { apiRequest, ApiError } from "../api/client.js";

function WritePage() {
  const [form, setForm] = useState({ title: "", content: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const submitPost = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await apiRequest("/boards/posts", {
        method: "POST",
        body: JSON.stringify(form),
      });
      window.location.href = "/board.html";
    } catch (submitError) {
      if (!(submitError instanceof ApiError && submitError.status === 401)) {
        setError(submitError.message || "게시글 작성에 실패했습니다.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="page-shell">
      <section className="write-container">
        <h2>게시글 작성</h2>
        <form onSubmit={submitPost}>
          <div className="input-group">
            <label htmlFor="title">제목</label>
            <input
              id="title"
              name="title"
              type="text"
              required
              placeholder="제목을 입력하세요"
              value={form.title}
              onChange={updateField}
            />
          </div>
          <div className="input-group">
            <label htmlFor="content">내용</label>
            <textarea
              id="content"
              name="content"
              rows="10"
              required
              placeholder="내용을 입력하세요"
              value={form.content}
              onChange={updateField}
            />
          </div>
          <div className="input-group">
            <label htmlFor="post-image">이미지 첨부</label>
            <input id="post-image" type="file" accept="image/*" />
          </div>
          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="button-group">
            <button type="submit" className="btn-login" disabled={isSubmitting}>
              {isSubmitting ? "작성 중..." : "완료"}
            </button>
            <button type="button" className="btn-signup" onClick={() => { window.location.href = "/board.html"; }}>
              취소
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default WritePage;
