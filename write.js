// write.js
document.addEventListener('DOMContentLoaded', () => {
    const writeForm = document.getElementById('write-form');

    if(writeForm) {
        writeForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const title = document.getElementById('post-title').value;
            const content = document.getElementById('post-content').value;
            const imageFile = document.getElementById('post-image').files[0];

            console.log('제목:', title);
            console.log('내용:', content);
            if(imageFile) {
                console.log('첨부 이미지:', imageFile);
            }

            // TODO: FormData를 사용하여 게시글 작성 API 호출

             fetch('http://localhost:8080/boards/posts', {
                 method: 'POST',
                 headers: {
                     'Content-Type': 'application/json' // JSON 형식으로 데이터 전송
                 },
                 credentials: 'include',
                 body: JSON.stringify({ // 자바스크립트 객체 JSON 변환
                     title: title,
                     content: content
                 })
             }).then(async (response) => {
                     // 1. 401 에러는 바로 처리
                     if (response.status === 401) {
                         alert("로그인이 필요한 서비스입니다.");
                         window.location.href = 'index.html';
                         throw new Error("Unauthorized");
                     }

                     // 2. 응답이 200번대 성공인지 확인
                     if (!response.ok) {
                         // 실패인 경우에만 json()을 읽음
                         const errorData = await response.json();
                         alert(errorData.message || "작성 실패");
                         throw new Error("Fetch failed");
                     }

                     // 3. 성공인 경우에만 json()을 읽어서 반환
                     return response;
                 })
                 .then(data => {
                     if (data) {
                         console.log("게시글 작성 성공:", data);
                         window.location.href = 'board.html'; // 성공 시 게시판으로 이동
                     }
                 })
                 .catch(error => {
                     if (error !== "Unauthorized"){
                         console.error('네트워크 Error:', error)
                     }
                 });

        });
    }
});