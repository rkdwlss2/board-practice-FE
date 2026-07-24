import { useState } from "react";
import { apiRequest, ApiError, clearClientAuthState } from "../api/client.js";
import AuthField from "../components/AuthField.jsx";

function PasswordEditPage() {
  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const submitPassword = async (event) => {
    event.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setIsSubmitting(true);
    try {
      await apiRequest("/users/me/password", {
        method: "PUT",
        body: JSON.stringify(form),
      });
      clearClientAuthState();
      window.alert("회원 비밀번호 수정되었습니다.");
      window.location.href = "/index.html";
    } catch (submitError) {
      if (!(submitError instanceof ApiError && submitError.status === 401)) {
        setError(submitError.message || "비밀번호 수정 실패했습니다.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="page-shell">
      <section className="signup-container">
        <h2>비밀번호 수정</h2>
        <form onSubmit={submitPassword}>
          <AuthField
            label="새 비밀번호"
            id="password"
            type="password"
            required
            placeholder="새 비밀번호를 입력하세요"
            value={form.password}
            onChange={updateField}
          />
          <AuthField
            label="비밀번호 확인"
            id="confirmPassword"
            type="password"
            required
            placeholder="비밀번호를 다시 입력하세요"
            value={form.confirmPassword}
            onChange={updateField}
          />
          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="button-group">
            <button type="submit" className="btn-login" disabled={isSubmitting}>
              {isSubmitting ? "수정 중..." : "수정하기"}
            </button>
            <button type="button" className="btn-signup" onClick={() => window.history.back()}>
              취소
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default PasswordEditPage;
