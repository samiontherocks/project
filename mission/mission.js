// 식물 컬렉션, 미션 예시 데이터
const weeklyMissions = [
  "일주일 연속 기록하기",
  "감정 태그 다양하게 사용하기",
  "특정 주제 일기 작성하기"
];

const completedMissions = [
  "일주일 연속 기록하기",
  "감정 태그 다양하게 사용하기",
  "특정 주제 일기 작성하기",
  "일주일 연속 기록하기",
  "감정 태그 다양하게 사용하기",
  "특정 주제 일기 작성하기",
  "일주일 연속 기록하기",
  "감정 태그 다양하게 사용하기",
  "특정 주제 일기 작성하기"
];

// 이번주 미션 렌더링
function renderWeeklyMission() {
  const ul = document.getElementById('weekly-mission-list');
  ul.innerHTML = weeklyMissions.map((m, i) => `
    <li>
      <input type="checkbox" id="mission${i+1}">
      <label for="mission${i+1}">${m}</label>
    </li>
  `).join('');
}

// 완료 미션 렌더링
function renderCompletedMission() {
  const ul = document.getElementById('completed-mission-list');
  ul.innerHTML = completedMissions.map(m => `
    <li>
      <span class="checkmark">&#10003;</span>
      <span>${m}</span>
    </li>
  `).join('');
}

// 초기 렌더링
renderWeeklyMission();
renderCompletedMission();
