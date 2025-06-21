// 각 메뉴별 컨텐츠(첨부 이미지 참고)
const contentTemplates = {
  profile: `
    <h2 class="user-main-title">프로필 수정</h2>
    <form class="user-profile-form" id="profile-form">
      <label for="nickname" class="user-label">닉네임</label>
      <input type="text" id="nickname" class="user-input" readonly>
      <label for="email" class="user-label">아이디 (이메일)</label>
      <input type="email" id="email" class="user-input" readonly>
      <button type="button" class="user-edit-btn" id="edit-nickname-btn">수정</button>
    </form>
  `,
  password: `
    <h2 class="user-main-title">비밀번호 변경</h2>
    <form class="user-profile-form">
      <label for="old-password" class="user-label">현재 비밀번호</label>
      <input type="password" id="old-password" class="user-input">
      <label for="new-password" class="user-label">새 비밀번호</label>
      <input type="password" id="new-password" class="user-input">
      <label for="new-password-confirm" class="user-label">새 비밀번호 다시 입력</label>
      <input type="password" id="new-password-confirm" class="user-input">
      <button type="button" class="user-edit-btn" id="password-save-btn">완료</button>
    </form>
  `,
  logout: `
    <h2 class="user-main-title">로그아웃</h2>
    <div>정말 로그아웃 하시겠습니까?</div>
    <button type="button" class="user-edit-btn" data-action="logout">로그아웃</button>
  `,
  delete: `
    <h2 class="user-main-title">회원 탈퇴</h2>
    <p style="color: #15254d"; class="withdraw-question">정말 탈퇴하시겠어요?</p>
    <div class="withdraw-notices">
      <div class="notice">
        <img src="/img/notice.png" alt="알림">
        <span style="color: #5E6D93";>이전 기록을 볼 수 없습니다.</span>
      </div>
      <div class="notice">
        <img src="/img/notice.png" alt="알림">
        <span style="color: #5E6D93">이용 내역이 모두 삭제됩니다.</span>
      </div>
      <div class="notice">
        <img src="/img/notice.png" alt="알림">
        <span style="color: #5E6D93">30일 이내 재가입이 불가합니다.</span>
      </div>
    </div>
    <p style="color: #15254d"; class="withdraw-question2">떠나시는 이유를 알려주세요.</p>
    <div style="color: #5E6D93"; class="withdraw-info">
      그린로그를 아끼고 사랑해주신 시간에 감사드립니다. <br>
      서비스를 이용하며 느끼셨던 점을 저희에게 공유해주시면 <br>
      더욱 유용한 서비스를 제공할 수 있는 그린로그가 되도록 노력하겠습니다.
    </div>
    <textarea class="user-input withdraw-reason"></textarea>
    <button type="button" class="user-edit-btn withdraw-btn" data-action="delete">계정 삭제하기</button>
  `
};

document.addEventListener('DOMContentLoaded', () => {
  const loginEmail = localStorage.getItem('email');

  if (!loginEmail) {
    window.location.href = '/login/login.html';
    return;
  }

  fetch('/public/users.json')
    .then(res => {
      if (!res.ok) throw new Error('사용자 정보를 불러올 수 없습니다.');
      return res.json();
    })
    .then(users => {
      localStorage.setItem('users', JSON.stringify(users));

      const currentUser = users.find(user => user.email === loginEmail);
      if (!currentUser) {
        alert('해당 사용자 정보를 찾을 수 없습니다.');
        localStorage.removeItem('email');
        window.location.href = '/login/login.html';
        return;
      }

      // 프로필 정보 렌더링
      renderProfileContent();
    })
    .catch(error => {
      console.error(error);
      alert('사용자 정보를 불러오는 중 오류가 발생했습니다.');
    });
});

function renderProfileContent() {
  document.getElementById('user-content').innerHTML = contentTemplates['profile'];

  const loginEmail = localStorage.getItem('email');
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const currentUser = users.find(user => user.email === loginEmail);

  if (currentUser) {
    const emailInput = document.getElementById('email');
    const nicknameInput = document.getElementById('nickname');
    if (emailInput && nicknameInput) {
      emailInput.value = currentUser.email;
      nicknameInput.value = currentUser.nickname;
    }
  }

  setProfileEditHandler();
}

function setProfileEditHandler() {
  const editBtn = document.getElementById('edit-nickname-btn');
  const nicknameInput = document.getElementById('nickname');
  if (!editBtn || !nicknameInput) return;

  const newEditBtn = editBtn.cloneNode(true);
  editBtn.parentNode.replaceChild(newEditBtn, editBtn);

  newEditBtn.addEventListener('click', function () {
    if (nicknameInput.hasAttribute('readonly')) {
      nicknameInput.removeAttribute('readonly');
      nicknameInput.classList.add('nickname-editing');
      nicknameInput.focus();
      newEditBtn.textContent = '저장';
    } else {
      nicknameInput.setAttribute('readonly', true);
      nicknameInput.classList.remove('nickname-editing');
      newEditBtn.textContent = '수정';

      const newNickname = nicknameInput.value.trim();
      let users = JSON.parse(localStorage.getItem('users') || '[]');
      const loginEmail = localStorage.getItem('email');
      const idx = users.findIndex(u => u.email === loginEmail);
      if (idx > -1) {
        users[idx].nickname = newNickname;
        localStorage.setItem('users', JSON.stringify(users));
      }
      alert('닉네임이 변경되었습니다.');
    }
  });
}


function setPasswordSaveHandler() {
  const saveBtn = document.getElementById('password-save-btn');
  if (!saveBtn) return;

  saveBtn.addEventListener('click', function () {
    const oldPassword = localStorage.getItem('password');
    const oldPasswordInput = document.getElementById('old-password');
    const newPasswordInput = document.getElementById('new-password');
    const newPasswordConfirmInput = document.getElementById('new-password-confirm');

    if (oldPasswordInput.value.trim() !== oldPassword) {
      alert('기존 비밀번호가 맞지 않습니다.');
    } else if (newPasswordInput.value.trim() !== newPasswordConfirmInput.value.trim()) {
      alert('비밀번호가 맞지 않습니다.');
    } else {
      alert('비밀번호가 변경되었습니다.');
    }
  });
}

document.addEventListener('click', function (e) {
  const action = e.target.dataset.action;

  if (action === 'logout' || action === 'delete') {
    localStorage.setItem('isLogin', 'false');
    localStorage.removeItem('email');
    window.location.href = '/index/index.html';
  }
});

document.querySelectorAll('.sidebar-menu-item').forEach(item => {
  item.addEventListener('click', function () {
    document.querySelectorAll('.sidebar-menu-item').forEach(i => i.classList.remove('active'));
    this.classList.add('active');

    const key = this.getAttribute('data-content');
    document.getElementById('user-content').innerHTML = contentTemplates[key];

    if (key === 'profile') renderProfileContent();
    if (key === 'password') setPasswordSaveHandler();
  });
});
