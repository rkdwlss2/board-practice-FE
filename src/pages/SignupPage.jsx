import { useEffect, useState } from "react";
import { apiRequest } from "../api/client.js";
import AuthField from "../components/AuthField.jsx";

function SignupPage() {
  const [form, setForm] = useState({ email: "", password: "", passwordConfirm: "", nickname: "" });
  const [previewUrl, setPreviewUrl] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const selectProfile = (event) => {
    const file = event.target.files?.[0];
    setPreviewUrl((current) => {
      if (current) URL.revokeObjectURL(current);
      return file ? URL.createObjectURL(file) : "";
    });
  };

  const signup = async (event) => {
    event.preventDefault();
    setError("");
    if (form.password !== form.passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    setIsSubmitting(true);
    try {
      await apiRequest("/users/signup", {
        method: "POST",
        body: JSON.stringify({ email: form.email, password: form.password, nickname: form.nickname }),
        redirectOnUnauthorized: false,
      });
      window.location.href = "/index.html";
    } catch (signupError) {
      const details = signupError.details || {};
      if (details.email) setError("올바른 이메일 주소 형식을 입력해 주세요.");
      else if (details.password) setError("비밀번호는 8~20자이며 대·소문자, 숫자, 특수문자를 포함해야 합니다.");
      else setError(signupError.message || "회원가입에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="animated-bg" />
      <section className="auth-card signup-container">
        <div className="auth-heading">
          <span className="auth-eyebrow">JOIN US</span>
          <h1>회원가입</h1>
          <p>새로운 계정을 만들고 대화를 시작하세요.</p>
        </div>
        <form onSubmit={signup}>
          <div className="profile-upload-container">
            <label htmlFor="profile-input" className="profile-upload">
              {previewUrl ? <img src={previewUrl} alt="프로필 미리보기" /> : <span aria-hidden="true">+</span>}
            </label>
            <input id="profile-input" className="profile-file-input" type="file" accept="image/*" onChange={selectProfile} />
          </div>
          <AuthField label="이메일" id="email" type="email" required autoComplete="email" placeholder="이메일을 입력하세요" value={form.email} onChange={updateField} />
          <AuthField label="비밀번호" id="password" type="password" required autoComplete="new-password" placeholder="비밀번호를 입력하세요" value={form.password} onChange={updateField} />
          <AuthField label="비밀번호 확인" id="passwordConfirm" type="password" required autoComplete="new-password" placeholder="비밀번호를 다시 입력하세요" value={form.passwordConfirm} onChange={updateField} />
          <AuthField label="닉네임" id="nickname" type="text" required placeholder="닉네임을 입력하세요" value={form.nickname} onChange={updateField} />
          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="button-group">
            <button type="submit" className="btn-login" disabled={isSubmitting}>
              {isSubmitting ? "가입 중..." : "회원가입"}
            </button>
            <a className="auth-secondary-link" href="/index.html">이미 계정이 있나요? 로그인</a>
          </div>
        </form>
      </section>
    </main>
  );
}

export default SignupPage;
