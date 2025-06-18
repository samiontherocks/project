
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

function getPast7DaysDateStrings() {
  const dates = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');

    dates.push(`${year}-${month}-${day}`);
  }

  return dates;
}

function parseDiaryDate(dateStr) {
  const match = dateStr.match(/(\d+)월 (\d+)일/);
  if (!match) return null;
  const [, month, day] = match;
  const now = new Date();
  return new Date(now.getFullYear(), parseInt(month) - 1, parseInt(day));
}

function changeMonth(offset) {
  currentDate.setMonth(currentDate.getMonth() + offset);
  currentYear = currentDate.getFullYear();
  currentMonth = currentDate.getMonth();
  renderCalendar(currentYear, currentMonth);
}

document.querySelector('.calendar-arrow1').addEventListener('click', () => {
  changeMonth(-1);
});
document.querySelector('.calendar-arrow2').addEventListener('click', () => {
  changeMonth(1);
});

function renderCalendar(year = currentYear, month = currentMonth) {
  const tbody = document.getElementById('calendar-body');
  const header = document.querySelector('.calendar-year-month');
  tbody.innerHTML = '';

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  header.textContent = `${year}년 ${month + 1}월`;

  const past7Dates = getPast7DaysDates().map(d => d.getTime());

  let day = 1;
  for (let i = 0; i < 6; i++) {
    const tr = document.createElement('tr');
    let isRowEmpty = true;

    for (let j = 0; j < 7; j++) {
      const td = document.createElement('td');

      if (i === 0 && j < firstDay) {
        td.className = 'inactive';
        td.textContent = '';
      } else if (day > lastDate) {
        td.className = 'inactive';
        td.textContent = '';
      } else {
        td.textContent = day;
        const cellDate = new Date(year, month, day);
        cellDate.setHours(0, 0, 0, 0);

        if (past7Dates.includes(cellDate.getTime())) {
          td.classList.add('active');
        }

        day++;
        isRowEmpty = false;
      }

      tr.appendChild(td);
    }

    if (!isRowEmpty) {
      tbody.appendChild(tr);
    }
  }
}

// ========== JSON 기반 일기 로딩 및 렌더링 ==========
async function loadUserDiaries(nickname) {
  const response = await fetch('/public/users.json');
  const users = await response.json();
  const user = users.find(u => u.nickname === nickname);
  return user ? user.diaries : {};
}

function renderLogListByDiaries(diaryData, filterRecent7 = true) {
  const logList = document.getElementById('log-list');
  logList.innerHTML = '';

  let dateKeys = Object.keys(diaryData);

  if (filterRecent7) {
    const past7DateStrs = getPast7DaysDateStrings();
    dateKeys = dateKeys.filter(dateStr => past7DateStrs.includes(dateStr));
  }

  const sortedDates = dateKeys.sort((a, b) => new Date(b) - new Date(a));

  sortedDates.forEach((date, i) => {
    const entries = diaryData[date];
    if (!entries || entries.length === 0) return;

    const month = new Date(date).getMonth() + 1;
    const day = new Date(date).getDate();
    const formattedDate = `${month}월 ${day}일`;
    const first = entries[0];

    const entryHtml = `
      <div class="log-entry" data-idx="${i}">
        <div class="log-entry-row">
          <div class="log-entry-left">
            <span class="log-entry-date">${formattedDate}</span>
          </div>
          <div class="log-entry-title-wrap">
            <div class="log-entry-title-row">
              <span class="log-entry-time">${first.time}</span>
              <span class="log-entry-dot"></span>
              <span class="log-entry-title">${first.title}</span>
              <span class="log-entry-arrow">
                <img src="/img/my-dropdown-icon.png" alt="드롭다운 아이콘" style="width:20px; height:20px;">
              </span>
            </div>
            <div class="log-entry-content">
              <div class="log-entry-detail-row">
                <div class="log-entry-left"></div>
                <div class="log-entry-detail-right">
                  <div class="log-entry-detail-content">${first.content}</div>
                </div>
              </div>
              ${entries
                .slice(1)
                .map(entry => `
                  <div class="log-entry-detail-row">
                    <div class="log-entry-left">
                      <span class="log-entry-time">${entry.time}</span>
                    </div>
                    <div class="log-entry-detail-right">
                      <div class="log-entry-title-row">
                        <span class="log-entry-dot"></span>
                        <span class="log-entry-title">${entry.title}</span>
                      </div>
                      <div class="log-entry-detail-content">${entry.content}</div>
                    </div>
                  </div>
                `)
                .join('')}
            </div>
          </div>
        </div>
      </div>
    `;
    logList.innerHTML += entryHtml;
  });

  document.querySelectorAll('.log-entry').forEach(entry => {
    entry.addEventListener('click', function (e) {
      if (!e.target.closest('.log-entry-arrow')) return;
      
      this.classList.toggle('open');
    });
  });
}

// 검색 기능
function setupSearch(diaryData) {
  const input = document.querySelector('.search-bar input');
  input.addEventListener('input', function () {
    const keyword = this.value.trim();

    if (keyword === '') {
      renderLogListByDiaries(diaryData, true);
      return;
    }

    const filteredData = {};

    Object.entries(diaryData).forEach(([date, entries]) => {
      const matched = entries.filter(entry =>
        entry.title.includes(keyword) || entry.content.includes(keyword)
      );
      if (matched.length > 0) filteredData[date] = matched;
    });

    renderLogListByDiaries(filteredData, false);
  });
}

// 초기 렌더링
const today = new Date();
let currentYear = today.getFullYear();
let currentMonth = today.getMonth();
let currentDate = new Date();

window.addEventListener('DOMContentLoaded', async () => {
  renderCalendar();

  const nickname = localStorage.getItem('nickname');
  if (!nickname) {
    console.error('nickname이 localStorage에 없습니다.');
    return;
  }

  const diaryData = await loadUserDiaries(nickname);

  renderLogListByDiaries(diaryData, true);
  setupSearch(diaryData);
});

