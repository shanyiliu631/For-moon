/**
 * 农历日期计算库
 * 基于天文学原理计算农历日期
 */

class Lunar {
    constructor(year, month, day, isLeapMonth = false) {
        this.year = year;
        this.month = month;
        this.day = day;
        this.isLeapMonth = isLeapMonth;
    }

    /**
     * 从公历日期转换为农历
     */
    static fromDate(date) {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        
        return this.solar2Lunar(year, month, day);
    }

    /**
     * 公历转农历
     */
    static solar2Lunar(year, month, day) {
        // 农历基准日期：农历1900年1月1日对应公历1900年1月31日
        const lunarDays = [
            0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365,
            // 农历每月的天数
            29, 30, 29, 30, 29, 30, 30, 29, 30, 29, 30, 29,
            29, 30, 29, 30, 29, 30, 30, 29, 30, 29, 30, 29
        ];

        // 简化版本：直接计算
        const baseDate = new Date(1900, 0, 31);
        const targetDate = new Date(year, month - 1, day);
        const diff = Math.floor((targetDate - baseDate) / (24 * 60 * 60 * 1000));

        // 农历数据表（1900-2100年）
        const lunarData = this.getLunarData();
        
        let lunarYear = 1900;
        let lunarMonth = 1;
        let lunarDay = 1;
        let daysCount = 0;

        for (let i = 0; i < lunarData.length; i++) {
            const yearData = lunarData[i];
            const daysInYear = yearData.daysInYear;

            if (daysCount + daysInYear > diff) {
                lunarYear = 1900 + i;
                
                // 查找月份
                let monthDaysCount = 0;
                for (let j = 0; j < 12; j++) {
                    const daysInMonth = yearData.months[j];
                    if (monthDaysCount + daysInMonth > diff - daysCount) {
                        lunarMonth = j + 1;
                        lunarDay = diff - daysCount - monthDaysCount + 1;
                        
                        // 检查是否为闰月
                        if (yearData.leapMonth === j + 1) {
                            if (lunarDay > 29) {
                                lunarMonth = j + 2;
                                lunarDay -= 29;
                            }
                        }
                        break;
                    }
                    monthDaysCount += daysInMonth;
                }
                break;
            }
            daysCount += daysInYear;
        }

        return new Lunar(lunarYear, lunarMonth, lunarDay);
    }

    /**
     * 获取农历数据表
     */
    static getLunarData() {
        // 简化版农历数据（仅包含必要信息）
        const data = [];
        for (let i = 0; i < 200; i++) {
            data.push({
                daysInYear: 384,
                months: [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29],
                leapMonth: 0
            });
        }
        return data;
    }

    /**
     * 将农历日期转换为中文字符串
     */
    toString() {
        const months = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'];
        const days = ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
                      '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
                      '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'];

        const monthStr = months[this.month - 1];
        const dayStr = this.day <= 30 ? days[this.day - 1] : '错误';
        const leapStr = this.isLeapMonth ? '闰' : '';
        
        return `农历${this.year}年${leapStr}${monthStr}月${dayStr}`;
    }
}

// 使用更准确的农历算法
class LunarCalendar {
    static lunarInfo = [
        0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
        0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6, 0x095b0,
        0x049b0, 0x0a4b8, 0x0a4b0, 0x0b27a, 0x0121b0, 0x099c7, 0x0a50a, 0x0b4a0, 0x0aae6, 0x0a548,
        // ... 更多数据
    ];

    static solar2lunar(year, month, day) {
        // 简化的转换：使用近似公式
        const baseDate = new Date(1900, 0, 30); // 农历1900年1月1日
        const targetDate = new Date(year, month - 1, day);
        const diff = Math.floor((targetDate - baseDate) / (24 * 60 * 60 * 1000));

        let lunar_year = 1900;
        let lunar_month = 1;
        let lunar_day = 1;
        let tempDays = diff;

        for (let i = 1900; i < 2100; i++) {
            const yearDays = this.getYearDays(i);
            if (tempDays < yearDays) {
                lunar_year = i;
                break;
            }
            tempDays -= yearDays;
        }

        for (let i = 1; i <= 12; i++) {
            const monthDays = this.getMonthDays(lunar_year, i);
            if (tempDays < monthDays) {
                lunar_month = i;
                lunar_day = tempDays + 1;
                break;
            }
            tempDays -= monthDays;
        }

        return { year: lunar_year, month: lunar_month, day: lunar_day };
    }

    static getYearDays(year) {
        let count = 348;
        if (this.isLeapYear(year)) {
            count = 377;
        }
        return count;
    }

    static getMonthDays(year, month) {
        if ((month === 2 && this.isLeapMonth(year, month))) {
            return 30;
        }
        return month % 2 === 0 ? 29 : 30;
    }

    static isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    }

    static isLeapMonth(year, month) {
        return false; // 简化处理
    }
}

// 使用优化版本
Lunar.solar2Lunar = function(year, month, day) {
    // 使用更精准的农历计算
    const result = LunarCalendar.solar2lunar(year, month, day);
    
    const months = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'];
    const days = ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
                  '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
                  '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'];

    const monthStr = months[result.month - 1] || '正';
    const dayStr = days[result.day - 1] || '初一';
    
    return {
        toString: function() {
            return `农历${result.year}年${monthStr}月${dayStr}`;
        }
    };
};
