// 获取元素
const dateInput = document.getElementById('dateInput');
const gregorianDateEl = document.getElementById('gregorianDate');
const lunarDateEl = document.getElementById('lunarDate');
const moonEmojiEl = document.getElementById('moonEmoji');
const moonNameEl = document.getElementById('moonName');
const moonDescriptionEl = document.getElementById('moonDescription');

// 设置今天的日期为默认值（使用北京时间）
function setTodayAsDefault() {
    const today = getTodayInBeijing();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    dateInput.value = `${year}-${month}-${day}`;
    updateDisplay();
}

// 获取北京时间的今天
function getTodayInBeijing() {
    const now = new Date();
    // 创建北京时间的日期对象（UTC+8）
    const beijingTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Shanghai' }));
    return beijingTime;
}

// 格式化日期为中文显示
function formatGregorianDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
    return date.toLocaleDateString('zh-CN', options);
}

// 计算月相（基于新月参考点）
function getMoonPhase(date) {
    // 参考新月日期：2000年1月6日 18:14 (UTC)
    // 转换为北京时间：2000年1月7日 02:14
    const referenceNewMoon = new Date('2000-01-06T18:14:00Z');
    const lunarCycle = 29.53058867; // 农历周期（天）
    
    // 将输入日期转换为UTC时间
    const utcDate = new Date(date.toISOString());
    
    const timeDiff = utcDate - referenceNewMoon;
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
    // 解析输入的日期（本地时间）
    const [year, month, day] = dateInput.value.split('-').map(Number);
    const localDate = new Date(year, month - 1, day);
    
    // 格式化日期为北京时间显示
    const beijingDateStr = localDate.toLocaleDateString('zh-CN', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        weekday: 'long',
        timeZone: 'Asia/Shanghai'
    });
    gregorianDateEl.textContent = beijingDateStr;
    
    // 更新农历日期
    const lunarDate = Lunar.fromDate(localDate);
    lunarDateEl.textContent = lunarDate.toString();
    
    // 计算月相（转换为UTC后再计算）
    const moonPhase = getMoonPhase(localDate);
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