// edit.js
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    if (!postId) {
        alert('잘못된 접근입니다.');
        location.href = 'board.html';
        return;
    }

    const editForm = document.getElementById('edit-form');
    const titleInput = document.getElementById('post-title');
    const contentInput = document.getElementById('post-content');
    const currentImageInfo = document.getElementById('current-image-info');

    // 1. 기존 게시글 데이터 불러오기
    fetch(`http://localhost:8080/boards/posts/${postId}`)
        .then(res => res.json())
        .then(data => {
            titleInput.value = data.title;
            contentInput.value = data.content;
            if (data.imageUrl) {
                currentImageInfo.textContent = `현재 이미지: ${data.imageUrl.split('/').pop()}`;
            }
        })
        .catch(err => console.error('데이터 로드 실패:', err));

    // 2. 수정 제출
    editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const title = titleInput.value;
        const content = contentInput.value;
        const imageFile = document.getElementById('post-image').files[0];

        // 이미지 포함 시 FormData 사용, 아닐 시 JSON 사용 등 백엔드 사양에 맞춤
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        if (imageFile) {
            formData.append('image', imageFile);
        }

        fetch(`http://localhost:8080/boards/posts/${postId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json' // JSON 형식으로 데이터 전송
            },
            body: JSON.stringify({ // 자바스크립트 객체 JSON 변환
                content: content,
                title: title
            }), // FormData 사용 시 Content-Type 헤더는 브라우저가 자동 설정
            credentials: 'include'
        })
        .then(res => {
            if (res.ok) {
                alert('게시글이 수정되었습니다.');
                location.href = `post.html?id=${postId}`;
            } else {
                alert('수정에 실패했습니다.');
            }
        })
        .catch(err => console.error('수정 요청 에러:', err));
    });
});