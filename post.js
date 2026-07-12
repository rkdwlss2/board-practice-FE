// post.js
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');


    if (!postId) {
        alert('잘못된 접근입니다.');
        window.location.href = 'board.html';
        return;
    }

    // 1. 게시글 상세 정보 조회
    fetch(`http://localhost:8080/boards/posts/${postId}`, { method: 'GET'
    ,credentials: 'include'
    })
        .then(async (response) => {
            if (!response.ok) {
                const errorData = await response.json();
                if (errorData.message) alert(errorData.message);
                return;
            }
            return response.json();
        })
        .then(data => {
            if (data) {
                const post = data;

                // 헤더 업데이트 (제목, 작성자, 수정/삭제 버튼)
                const postDetailHeader = document.querySelector('.post-detail-header');
                if (postDetailHeader) {
                    let buttonHtml = ``;

                    if (data.owner){
                        buttonHtml =
                            `<div class="post-actions">
                            <button class="btn-edit">수정</button>
                            <button class="btn-delete">삭제</button>
                        </div>
                    `;
                    }
                    postDetailHeader.innerHTML = `
                        <h2 class="post-detail-title">${post.title}</h2>
                        <div class="author-info">
                            <img src="./image/dog.jpg" alt="작성자 프로필">
                            <div class="author-meta">
                                <span class="author-name">${post.writer}</span>
                                <span class="post-timestamp">${post.createDate}</span>
                            </div>
                        </div>`+buttonHtml;


                }

                // 본문 업데이트
                const postDetailContent = document.querySelector('.post-detail-content');
                if (postDetailContent) {
                    postDetailContent.innerHTML = `
                        <p>${post.content}</p>
                        <img src="./image/dog.jpg" alt="게시글 이미지" style="max-width: 100%; margin-top: 20px;">
                    `;
                }

                // 하단 스탯 업데이트 (좋아요, 댓글수, 조회수)
                const postDetailFooter = document.querySelector('.post-detail-footer');
                if (postDetailFooter) {
                    const activeClass = post.isLiked ? 'active' : '';
                    const heartIcon = post.isLiked ? 'fa-solid' : 'fa-regular';

                    postDetailFooter.innerHTML = `
                        <div class="post-stats">
                            <button class="btn-like ${activeClass}" id="like-btn">
                                <i class="${heartIcon} fa-heart"></i>
                                <span id="like-count">${post.likeCount}</span>
                            </button>
                            <span>
                                <i class="fa-regular fa-comment"></i> 
                                <span id="comment-count">${post.commentCount}</span>
                            </span>
                            <span>조회수 ${post.viewCount}</span>
                        </div>
                    `;
                }
            }
        })
        .catch(error => console.error('게시글 로드 에러:', error));

    // 2. 댓글 목록 조회
    fetch(`http://localhost:8080/boards/posts/${postId}/comment`, { method: 'GET' })
        .then(response => response.json())
        .then(data => {
            const commentList = document.querySelector('.comment-list');
            if (commentList && data) {
                commentList.innerHTML = data.map(comment => `
                    <div class="comment-item" data-id="${comment.commentId}">
                        <div class="comment-author">
                            <img src="./image/dog.jpg" alt="프로필">
                            <span>${comment.writer}</span>
                        </div>
                        <div class="comment-content">
                            <p>${comment.content}</p>
                            <span class="comment-timestamp">${comment.createDate}</span>
                        </div>
                        <div class="comment-actions">
                            <button class="btn-edit-comment">수정</button>
                            <button class="btn-delete-comment">삭제</button>
                        </div>
                    </div>
                `).join('');
            }
        });

    // --- 이벤트 리스너 (이벤트 위임 사용) ---
    document.addEventListener('click', (e) => {
        // A. 좋아요 버튼 클릭
        const likeBtn = e.target.closest('#like-btn');
        if (likeBtn) {
            const isLiked = likeBtn.classList.contains('active');
            const method = isLiked ? 'DELETE' : 'POST';

            fetch(`http://localhost:8080/boards/likes/${postId}`, {
                method: method,
                credentials: 'include'
            })
                .then(response => {
                    if (response.ok) {
                        likeBtn.classList.toggle('active');
                        const countSpan = likeBtn.querySelector('#like-count');
                        const icon = likeBtn.querySelector('i');
                        let currentCount = parseInt(countSpan.textContent);

                        if (likeBtn.classList.contains('active')) {
                            countSpan.textContent = currentCount + 1;
                            icon.classList.replace('fa-regular', 'fa-solid');
                        } else {
                            countSpan.textContent = currentCount - 1;
                            icon.classList.replace('fa-solid', 'fa-regular');
                        }
                    }
                });
            return; // 좋아요 처리 후 종료
        }

        // 게시글 수정 버튼
        if (e.target.classList.contains('btn-edit')) {
            console.log('게시글 수정 버튼 클릭');
            location.href = 'edit.html?id=' + postId;
        }

        // B. 게시글 삭제 버튼
        if (e.target.classList.contains('btn-delete')) {
            if (confirm('게시글을 삭제하시겠습니까?')) {
                fetch(`http://localhost:8080/boards/posts/${postId}`, {
                    method: 'DELETE',
                    credentials: 'include'
                })
                    .then(res => { if(res.ok) window.location.href = 'board.html'; });
            }
        }
    });

    // C. 댓글 작성 폼 제출
    const commentForm = document.getElementById('comment-form');
    if (commentForm) {
        commentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const textarea = commentForm.querySelector('textarea');
            const content = textarea.value;

            fetch(`http://localhost:8080/boards/posts/${postId}/comment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ content })
            })
                .then(response => {
                    if (response.ok) {
                        // 댓글 작성 후 페이지를 새로고침하여 최신 상태(댓글수 포함)를 반영
                        window.location.reload();
                    }
                });
        });
    }

    // 댓글 삭제 (이벤트 위임)
    const commentsContainer = document.querySelector('.comments-container');
    if (commentsContainer) {
        commentsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-delete-comment')) {
                if (confirm('댓글을 삭제하시겠습니까?')) {
                    const commentItem = e.target.closest('.comment-item');
                    const commentId = commentItem.dataset.id;

                    fetch(`http://localhost:8080/boards/posts/comment/${commentId}`, {
                        method: 'DELETE',
                        credentials: 'include'
                    })
                        .then(async (response) => {
                            if (response.status === 401) {
                                alert("로그인이 필요합니다.");
                                window.location.href = 'index.html';
                                return;
                            }
                            if (response.ok) {
                                alert("댓글이 삭제되었습니다.");
                                window.location.reload();
                            } else {
                                const errorData = await response.json();
                                alert(errorData.message || "삭제 실패");
                            }
                        })
                        .catch(error => console.error('네트워크 Error:', error));
                }
            }
        });
    }
});