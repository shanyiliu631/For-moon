// 获取元素
const dateInput = document.getElementById('dateInput');
const gregorianDateEl = document.getElementById('gregorianDate');
const lunarDateEl = document.getElementById('lunarDate');
const moonEmojiEl = document.getElementById('moonEmoji');
const moonNameEl = document.getElementById('moonName');
const moonDescriptionEl = document.getElementById('moonDescription');

// 设置今天的日期为默认值（北京时间）
function setTodayAsDefault() {
    const today = new Date().toLocaleString('en-US', { timeZone: 'Asia/Shanghai' });
    const [month, day, year] = today.split('/');
    const dateStr = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    dateInput.value = dateStr;
    updateDisplay();
}

// 格式化日期为中文显示（北京时间）
function formatGregorianDate(date) {
    const dateStr = date.toLocaleString('zh-CN', { 
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
        timeZone: 'Asia/Shanghai'
    });
    return dateStr;
}

// 月���计算 - 使用全球统一标准
// 新月参考点：2000年1月6日18:14 UTC (JD 2451550.25972)
function calculateMoonPhase(date) {
    // 转换为UTC时间的毫秒数
    const dateUTC = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
    
    // 参考新月时间 (UTC)：2000-01-06 18:14:00
    const referenceNewMoon = new Date(Date.UTC(2000, 0, 6, 18, 14, 0));
    
    // 朔望周期（天数）
    const lunarCycle = 29.53058867;
    
    // 计算自参考新月以来的天数
    const daysSinceNewMoon = (dateUTC - referenceNewMoon) / (1000 * 60 * 60 * 24);
    
    // 计算当前月相在周期中的位置（0-1）
    const phaseValue = (daysSinceNewMoon % lunarCycle) / lunarCycle;
    
    // 转换为百分比（0-100）
    const phasePercent = phaseValue * 100;
    
    return phasePercent;
}

// 获取月相名称和emoji
function getMoonInfo(phasePercent) {
    // 规范化百分比到 0-100
    const phase = phasePercent % 100;
    
    if (phase < 1.84) {
        return { emoji: '🌑', name: '新月', description: '月球照亮面积：0%' };
    } else if (phase < 6.84) {
        return { emoji: '🌒', name: '新月渐盈', description: '月球照亮面积：' + Math.round(phase) + '%' };
    } else if (phase < 12.5) {
        return { emoji: '🌓', name: '上弦月', description: '月球照亮面积：' + Math.round(phase) + '%' };
    } else if (phase < 25) {
        return { emoji: '🌔', name: '盈凸月', description: '月球照亮面积：' + Math.round(phase) + '%' };
    } else if (phase < 27.5) {
        return { emoji: '🌕', name: '满月', description: '月球照亮面积：' + Math.round(phase) + '%' };
    } else if (phase < 40.5) {
        return { emoji: '🌖', name: '亏凸月', description: '月球照亮面积：' + Math.round(100 - phase) + '%' };
    } else if (phase < 48.5) {
        return { emoji: '🌗', name: '下弦月', description: '月球照亮面积：' + Math.round(100 - phase) + '%' };
    } else if (phase < 53) {
        return { emoji: '🌘', name: '残月', description: '月球照亮面积：' + Math.round(100 - phase) + '%' };
    } else {
        return { emoji: '🌒', name: '新月渐盈', description: '月球照亮面积：' + Math.round(phase) + '%' };
    }
}

// 更新显示
function updateDisplay() {
    const dateValue = dateInput.value; // 格式: YYYY-MM-DD
    const [year, month, day] = dateValue.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    
    // 显示公历日期（北京时间）
    const gregorianStr = formatGregorianDate(date);
    gregorianDateEl.textContent = gregorianStr;
    
    // 计算农历日期
    const lunarInfo = Lunar.solar2lunar(year, month, day);
    const lunarStr = Lunar.formatLunarDate(lunarInfo);
    lunarDateEl.textContent = lunarStr;
    
    // 计算月相
    const phasePercent = calculateMoonPhase(date);
    const moonInfo = getMoonInfo(phasePercent);
    
    // 更新月相显示
    moonEmojiEl.textContent = moonInfo.emoji;
    moonNameEl.textContent = moonInfo.name;
    moonDescriptionEl.textContent = moonInfo.description;
}

// 监听日期变化
dateInput.addEventListener('change', updateDisplay);

// 初始化 - 显示今天
setTodayAsDefault();
