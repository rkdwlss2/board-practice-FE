// script.js
document.addEventListener('DOMContentLoaded', () => {
    // --- 로그인 페이지 관련 ---
    const loginForm = document.getElementById('login-form');
    const signupBtn = document.getElementById('signup-btn');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // -- 로그인 API 호출
            fetch(`http://localhost:8080/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json' // JSON 형식으로 데이터 전송
                },
                body: JSON.stringify({ // 자바스크립트 객체 JSON 변환
                    email: document.getElementById('email').value,
                    password: document.getElementById('password').value
                })
            })
                .then(async (response) => {
                    if (!response.ok){
                        const errorData = await response.json();

                        if (errorData.email){
                            alert(`이메일 오류: 올바른 이메일 주소 형식을 입력해주세요.`)
                        }
                        if (errorData.password){
                            alert(`비밀번호 오류: 비밀번호는 8자이상, 20자 이하이며, 대문자,소문자,숫자,특수문자를 최소 1개 포함해야 합니다.`)
                        }
                        if (errorData.message){
                            alert(errorData.message);
                        }
                        return;
                    }
                    return response.json();
                })
                .then(data => {
                    if (data) {
                        console.log("로그인 성공:", data);
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
            // 회원가입 페이지로 이동
            window.location.href = 'signup.html';
        });
    }


    // --- 회원가입 페이지 관련 ---
    const signupForm = document.getElementById('signup-form');
    const profileInput = document.getElementById('profile-input');
    const profilePreview = document.getElementById('profile-preview');
    const plusIcon = document.getElementById('plus-icon');

    // 프로필 이미지 미리보기 기능
    if (profileInput) {
        profileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    profilePreview.src = e.target.result;
                    profilePreview.style.display = 'block';
                    plusIcon.style.display = 'none';
                }
                reader.readAsDataURL(file);
            } else {
                profilePreview.src = '';
                profilePreview.style.display = 'none';
                plusIcon.style.display = 'block';
            }
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // TODO: 회원가입 폼 데이터 검증 및 서버 전송 로직
            
            const password = document.getElementById('password').value;
            const passwordConfirm = document.getElementById('password-confirm').value;

            if(password !== passwordConfirm) {
                alert("비밀번호가 일치하지 않습니다.");
                return;
            }

            console.log('회원가입 시도');
        });
    }

    // --- 게시판 목록 페이지 관련 ---
    const writePostBtn = document.getElementById('write-post-btn');
    if(writePostBtn) {
        writePostBtn.addEventListener('click', () => {
            // 글쓰기 페이지로 이동 (아직 페이지는 없음)
            console.log('글쓰기 버튼 클릭');
            // window.location.href = 'write.html';
        });
    }
});