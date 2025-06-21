function getTodayDateString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const date = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${date}`;
}

function getPast7DaysDates() {
  const today = new Date();
  const dates = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    d.setHours(0, 0, 0, 0);
    dates.push(d);
  }
  return dates;
}

let todayDiaryRecords = [];

const originalCounts = [3, 5, 1, 4, 1, 5, 6];
const past7Days = getPast7DaysDates();
const graphData = past7Days.map((date, index) => {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return {
    date: `${month}월 ${day}일`,
    count: originalCounts[index],
    today: index === 6
  };
});

const missionData = [
  "일주일 연속 기록하기",
  "감정 태그 다양하게 사용하기",
  "특정 주제 일기 작성하기"
];

function renderGraph() {
  const graph = document.getElementById('graph');
  graph.innerHTML = `
    <div class="graph-bar-group-wrapper">
      <div class="graph-bar-group">
        ${graphData.map(bar => `
          <div class="graph-bar${bar.today ? " today" : ""}">  
            <div class="bar-wrapper">
              <div class="bar ${getBarClass(bar.count)}" style="height:${bar.count * 10 + 10}px">
                ${bar.today ? `<span class="bar-today">Today</span>` : ""}
                <span class="bar-count">${bar.count}건</span>
              </div>
            </div>
            <span class="bar-label">${bar.date}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  function getBarClass(count) {
    if (count === 1) return "one";
    else if (count === 3) return "three";
    else if (count === 4) return "four";
    else if (count === 5) return "five";
    return "six";
  }
}

function renderTimelineFromData(timelineData) {
  document.getElementById('timeline-date').innerHTML = `
    <span class="timeline-year">${timelineData.year}</span>
    <span class="timeline-day">${timelineData.day}</span>
    <img src="/img/icon-add.png" alt="수정" class="timeline-edit-icon" />
  `;
  document.getElementById('timeline-list').innerHTML = timelineData.records.map(rec => `
    <li>
      <div class="timeline-time">${rec.time}</div>
      <div class="timeline-dot"></div>
      <div class="timeline-content">
        <div class="timeline-title">${rec.title}</div>
        <div class="timeline-desc">${rec.desc}</div>
      </div>
    </li>
  `).join('');
}

function renderMission() {
  document.getElementById('mission-list').innerHTML = missionData.map((m, i) => `
    <li>
      <input type="checkbox" id="mission${i + 1}">
      <label for="mission${i + 1}">${m}</label>
    </li>
  `).join('');
}

function loadTimelineFromJson() {
  console.log("✅ loadTimelineFromJson() 호출됨");

  fetch('/public/users.json')
    .then(response => {
      if (!response.ok) throw new Error("서버 응답 실패: " + response.status);
      return response.json();
    })
    .then(data => {
      const user = data[0];
      const todayKey = getTodayDateString();
      const todayRecords = user.diaries[todayKey] || [];

      todayDiaryRecords = todayRecords;

      const timelineData = {
        year: String(new Date().getFullYear()),
        day: `${new Date().getMonth() + 1}월 ${new Date().getDate()}일`,
        records: todayRecords.map(entry => ({
          time: entry.time,
          title: entry.title,
          desc: entry.content
        }))
      };

      renderTimelineFromData(timelineData);
    })
    .catch(err => {
      console.error("❌ 타임라인 불러오기 실패:", err);
    });
}

// 모달 생성
const timelineModalHTML = `
  <div id="timeline-modal" class="modal-overlay" style="display:none;">
    <div class="modal-content-with-footer">
      <button class="modal-close" type="button">&times;</button>
      <div class="modal-content-scroll">
        <div class="modal-header-row">
          <h2 class="modal-title">${new Date().getMonth() + 1}월 ${new Date().getDate()}일</h2>
        </div>
        <form id="timeline-edit-form" class="timeline-edit-form"></form>
      </div>
      <div class="fixed-submit-wrapper">
        <button type="submit" form="timeline-edit-form" class="user-edit-btn">수정</button>
      </div>
    </div>
  </div>
`;
document.body.insertAdjacentHTML('beforeend', timelineModalHTML);

// 모달 열기
document.addEventListener('click', function (e) {
  if (e.target.classList.contains('timeline-edit-icon')) {
    const modal = document.getElementById('timeline-modal');
    modal.style.display = 'flex';

    const form = document.getElementById('timeline-edit-form');
    form.innerHTML = '';

    todayDiaryRecords.forEach((record, index) => {
      const group = document.createElement('div');
      group.className = 'entry-group';
      group.innerHTML = `
        <div class="entry-time">
          <input type="text" value="${record.time}" />
        </div>
        <div class="entry-dot"></div>
        <div class="entry-fields">
          <input type="text" value="${record.title}" />
          <textarea rows="3">${record.content}</textarea>
        </div>
      `;
      form.appendChild(group);
    });
  }

  if (e.target.classList.contains('modal-close') || e.target.id === 'timeline-modal') {
    document.getElementById('timeline-modal').style.display = 'none';
  }
});

// 제출 시 모달 닫기
document.addEventListener('submit', function (e) {
  if (e.target.id === 'timeline-edit-form') {
    e.preventDefault();
    alert('타임라인 기록이 저장되었습니다.');
    document.getElementById('timeline-modal').style.display = 'none';
  }
});

renderGraph();
renderMission();
loadTimelineFromJson();
