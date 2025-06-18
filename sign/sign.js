const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const passwordConfirmInput = document.getElementById('passwordConfirm')
const nicknameInput = document.getElementById('nickname')
const SignBtn = document.getElementById('SignBtn');
const SignForm = document.querySelector('.sign-box form');

function checkInputs() {
  if (emailInput.value.trim() !== '' && passwordInput.value.trim() !== '' && passwordConfirmInput.value.trim() !== '' && nicknameInput.value.trim() !== '') {
    SignBtn.disabled = false;
    SignBtn.classList.add('enabled');
  }
  else {
    SignBtn.disabled = true;
    SignBtn.classList.remove('enabled');
  }
}

emailInput.addEventListener('input', checkInputs);
passwordInput.addEventListener('input', checkInputs);
passwordConfirmInput.addEventListener('input', checkInputs);
nicknameInput.addEventListener('input', checkInputs);

SignForm.addEventListener('submit', function(event) {
  event.preventDefault();

  // const email = emailInput.value.trim();
  // const password = passwordInput.value.trim();
  // const passwordConfirmInput = passwordConfirmInput.value.trim();
  // const nicknameInput = nicknameInput.value.trim();

  if (passwordInput.value.trim() !== passwordConfirmInput.value.trim())
    alert("비밀번호가 맞지 않습니다.")
  else {
    alert('회원가입에 성공했습니다!');
    window.location.href = '../login/login.html';
  }

});