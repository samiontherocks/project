const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const SignBtn = document.getElementById('loginBtn');
const SignForm = document.querySelector('.login-box form');
const errorMessage = document.getElementById('error-message');

function checkInputs() {
  if (emailInput.value.trim() !== '' && passwordInput.value.trim() !== '') {
    SignBtn.disabled = false;
    SignBtn.classList.add('enabled');
  } else {
    SignBtn.disabled = true;
    SignBtn.classList.remove('enabled');
  }
}

emailInput.addEventListener('input', checkInputs);
passwordInput.addEventListener('input', checkInputs);

SignForm.addEventListener('submit', function(event) {
  event.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  fetch('/public/users.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('사용자 데이터를 불러올 수 없습니다.');
      }
      return response.json();
    })
    .then(users => {
      const userFound = users.find(user => user.email === email && user.password === password);

      if (userFound) {
        errorMessage.textContent = '';
        errorMessage.classList.remove('visible');

        localStorage.setItem('isLogin', 'true');
        localStorage.setItem('email', userFound.email);
        localStorage.setItem('password', userFound.password)
        localStorage.setItem('nickname', userFound.nickname);  

        alert('로그인에 성공했습니다!');
        window.location.href = '/home/home.html';
      } else {
        errorMessage.textContent = '아이디 또는 비밀번호가 올바르지 않습니다.';
        errorMessage.classList.add('visible');
      }
    })
    .catch(error => {
      errorMessage.textContent = '로그인 처리 중 오류가 발생했습니다.';
      errorMessage.classList.add('visible');
      console.error(error);
    });
});