// 获取元素
const dateInput = document.getElementById('dateInput');
const gregorianDateEl = document.getElementById('gregorianDate');
const lunarDateEl = document.getElementById('lunarDate');
const moonEmojiEl = document.getElementById('moonEmoji');
const moonNameEl = document.getElementById('moonName');
const moonDescriptionEl = document.getElementById('moonDescription');

// 设置今天的日期为默认值
function setTodayAsDefault() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    dateInput.value = `${year}-${month}-${day}`;
    updateDisplay();
}

// 格式化日期为中文显示
function formatGregorianDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
    return date.toLocaleDateString('zh-CN', options);
}

// 计算月相
function getMoonPhase(date) {
    // 参考新月日期：2000年1月6日
    const referenceNewMoon = new Date(2000, 0, 6);
    const lunarCycle = 29.53058867; // 农历周期（天）
    
    const timeDiff = date - referenceNewMoon;
    const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
    const phaseInCycle = daysDiff % lunarCycle;
    const phasePercent = (phaseInCycle / lunarCycle) * 100;
    
    return {
        percent: phasePercent,
        day: Math.round(phaseInCycle)
    };
}

// 获取月相的表情和名称
function getMoonInfo(phasePercent) {
    if (phasePercent < 1.84) {
        return { emoji: '🌑', name: '新月', description: '月球照亮面积：0%' };
    } else if (phasePercent < 6.84) {
        return { emoji: '🌒', name: '新月渐盈', description: '月球照亮面积：' + Math.round(phasePercent) + '%' };
    } else if (phasePercent < 12.5) {
        return { emoji: '🌓', name: '上弦月', description: '月球照亮面积：' + Math.round(phasePercent) + '%' };
    } else if (phasePercent < 25) {
        return { emoji: '🌔', name: '盈凸月', description: '月球照亮面积：' + Math.round(phasePercent) + '%' };
    } else if (phasePercent < 27.5) {
        return { emoji: '🌕', name: '满月', description: '月球照亮面积：' + Math.round(phasePercent) + '%' };
    } else if (phasePercent < 40.5) {
        return { emoji: '🌖', name: '亏凸月', description: '月球照亮面积：' + Math.round(phasePercent) + '%' };
    } else if (phasePercent < 48.5) {
        return { emoji: '🌗', name: '下弦月', description: '月球照亮面积：' + Math.round(phasePercent) + '%' };
    } else if (phasePercent < 53) {
        return { emoji: '🌘', name: '残月', description: '月球照亮面积：' + Math.round(phasePercent) + '%' };
    } else {
        return { emoji: '🌒', name: '新月渐盈', description: '月球照亮面积：' + Math.round(100 - phasePercent) + '%' };
    }
}

// 更新显示内容
function updateDisplay() {
    const selectedDate = new Date(dateInput.value + 'T00:00:00');
    
    // 更新公历日期
    gregorianDateEl.textContent = formatGregorianDate(selectedDate);
    
    // 更新农历日期
    const lunarDate = Lunar.fromDate(selectedDate);
    lunarDateEl.textContent = lunarDate.toString();
    
    // 计算月相
    const moonPhase = getMoonPhase(selectedDate);
    const moonInfo = getMoonInfo(moonPhase.percent);
    
    // 更新月相显示
    moonEmojiEl.textContent = moonInfo.emoji;
    moonNameEl.textContent = moonInfo.name;
    moonDescriptionEl.textContent = moonInfo.description;
}

// 监听日期输入变化
dateInput.addEventListener('change', updateDisplay);

// 初始化：设置今天的日期
setTodayAsDefault();