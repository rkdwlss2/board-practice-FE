// profile.js - 회원정보 수정 및 비밀번호 수정 처리
document.addEventListener('DOMContentLoaded', () => {
    // 1. 드롭다운 토글 기능 (모든 페이지 상단 프로필 클릭 시)
    const userMenu = document.querySelector('.user-menu');
    if (userMenu) {
        userMenu.addEventListener('click', (e) => {
            e.stopPropagation();
            const dropdown = userMenu.querySelector('.dropdown-menu');
            dropdown.classList.toggle('show');
        });
    }

    // 문서 클릭 시 드롭다운 닫기
    document.addEventListener('click', () => {
        const dropdown = document.querySelector('.dropdown-menu');
        if (dropdown) dropdown.classList.remove('show');
    });

    // 2. 회원정보 수정 페이지 로직
    const profileEditForm = document.getElementById('profile-edit-form');
    if (profileEditForm) {
        // 초기 데이터 로드 (예시)
        fetch('http://localhost:8080/users/me',{
            method: 'GET',
            credentials: 'include'
        })

            .then(response => {
                if (!response.ok) throw new Error('로그인 안 됨');
                return response.json();
            })
            .then(user => {
                console.log('세션에서 가져온 유저 정보:', user);
                console.log('유저 닉네임:', user.nickname);
                document.getElementById('email').value = user.email;
                document.getElementById('nickname').value = user.nickname;
            })
            .catch(err => console.error(err));

        // document.getElementById('email').value = "user@example.com";
        // document.getElementById('nickname').value = "현재닉네임";

        profileEditForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newNickname = document.getElementById('nickname').value;
            console.log('닉네임 수정 시도:', newNickname);
            
            fetch(`http://localhost:8080/users/me`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json' // JSON 형식으로 데이터 전송
                },
                body: JSON.stringify({ // 자바스크립트 객체 JSON 변환
                    nickname: newNickname
                }), // FormData 사용 시 Content-Type 헤더는 브라우저가 자동 설정
                credentials: 'include'
            })
                .then(res => {
                    if (res.ok) {
                        alert('닉네임 수정되었습니다.');
                        window.location.href = 'board.html';
                    } else {
                        alert('수정에 실패했습니다.');
                    }
                })
                .catch(err => console.error('수정 요청 에러:', err));
        });

        // 회원탈퇴 버튼
        const withdrawBtn = document.getElementById('withdraw-btn');
        if (withdrawBtn) {
            withdrawBtn.addEventListener('click', () => {
                if (confirm('정말로 탈퇴하시겠습니까? 데이터가 모두 삭제됩니다.')) {
                    console.log('회원 탈퇴 진행');
                    // TODO: 탈퇴 API 호출
                    fetch(`http://localhost:8080/users/me`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json' // JSON 형식으로 데이터 전송
                        },
                        body: JSON.stringify({ // 자바스크립트 객체 JSON 변환
                            email: document.getElementById('email').value
                        }), // FormData 사용 시 Content-Type 헤더는 브라우저가 자동 설정
                        credentials: 'include'
                    })
                        .then(res => {
                            if (res.ok) {
                                alert('회원 삭제되었습니다.');
                                window.location.href = 'index.html';
                            } else {
                                alert('삭제에 실패했습니다.');
                            }
                        })
                        .catch(err => console.error('삭제 요청 에러:', err));
                }
            });
        }
    }

    // 3. 비밀번호 수정 페이지 로직
    const passwordEditForm = document.getElementById('password-edit-form');
    if (passwordEditForm) {
        passwordEditForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const pwd = document.getElementById('password').value;
            const pwdConfirm = document.getElementById('password-confirm').value;

            if (pwd !== pwdConfirm) {
                alert('비밀번호가 일치하지 않습니다.');
                return;
            }

            console.log('비밀번호 수정 시도');
            // TODO: 비밀번호 수정 API 호출
            fetch(`http://localhost:8080/users/me/password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json' // JSON 형식으로 데이터 전송
                },
                body: JSON.stringify({ // 자바스크립트 객체 JSON 변환
                    password: pwd,
                    confirmPassword: pwdConfirm
                }), // FormData 사용 시 Content-Type 헤더는 브라우저가 자동 설정
                credentials: 'include'
            })
                .then(res => {
                    if (res.ok) {
                        alert('회원 비밀번호 수정되었습니다.');
                        window.location.href = 'index.html';
                    } else {
                        alert('비밀번호 수정 실패했습니다.');
                    }
                })
                .catch(err => console.error('비밀번호 수정 요청 에러:', err));

        });
    }
});