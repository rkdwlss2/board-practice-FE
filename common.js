const BASE_URL = `http://localhost:8080`;
const ERROR_MESSAGES = {
    PASSWORD_MISMATCH: `비밀번호가 일치하지 않습니다.`,
    LOGIN_FAILED: `로그인 정보가 올바르지 않습니다.`
};

async function request(url,options={}){
    const defaultOptions = {
        credentials: 'include',
        headers: {'Content-Type': 'application/json',
        },
    }
    const response = await fetch(`${BASE_URL}`,defaultOptions);
    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
    }
    return response.json();
}





