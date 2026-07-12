// login.js
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const signupBtn = document.getElementById('signup-btn');

    const signInBtn = document.getElementById("signIn");
    const signUpBtn = document.getElementById("signUp");
    const fistForm = document.getElementById("signup-form");
    const secondForm = document.getElementById("login-form");
    const container = document.querySelector(".container");

    signInBtn.addEventListener("click", () => {
        container.classList.remove("right-panel-active");
    });

    signUpBtn.addEventListener("click", () => {
        container.classList.add("right-panel-active");
    });

    fistForm.addEventListener("submit", (e) => e.preventDefault());
    secondForm.addEventListener("submit", (e) => e.preventDefault());

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // -- 로그인 API 호출
            fetch(`http://localhost:8080/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' // JSON 형식으로 데이터 전송
                },
                credentials: 'include',
                body: JSON.stringify({ // 자바스크립트 객체 JSON 변환
                    email: document.getElementById('login-email').value,
                    password: document.getElementById('login-password').value
                })
            })
                .then(async (response) => {
                    if (!response.ok) {
                        const errorData = await response.json();

                        if (errorData.email) {
                            alert(`이메일 오류: 올바른 이메일 주소 형식을 입력해주세요.`)
                        }
                        if (errorData.password) {
                            alert(`비밀번호 오류: 비밀번호는 8자이상, 20자 이하이며, 대문자,소문자,숫자,특수문자를 최소 1개 포함해야 합니다.`)
                        }
                        if (errorData.message) {
                            alert(errorData.message);
                        }
                        return;
                    }
                    return response;
                })
                .then(data => {
                    if (data) {
                        console.log("로그인 성공:", data);
                        // var responseHeader = data.headers.get('authorization');

                        window.location.href = 'board.html'; // 로그인 성공 시 게시판으로 이동
                    }
                })
                .catch(error => {
                    console.error('네트워크 Error:', error)
                });
            console.log('로그인 시도');
        });
    }

    if (signupBtn) {
        signupBtn.addEventListener('click', () => {
            window.location.href = 'signup.html';
        });
    }
});