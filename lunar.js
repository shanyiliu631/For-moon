/**
 * 农历日期计算库
 * 基于天文学原理和农历数据表
 */

class Lunar {
    // 农历数据表（1900-2100年）
    static lunarData = [
        0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
        0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6, 0x095b0,
        0x049b0, 0x0a4b8, 0x0a4b0, 0x0b27a, 0x0121b0, 0x099c7, 0x0a50a, 0x0b4a0, 0x0aae6, 0x0a548,
        0x05a63, 0x0aba0, 0x0a5c4, 0x0abcd, 0x095bd, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255,
        0x06d2f, 0x0ada0, 0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0, 0x1a4b7, 0x0a500, 0x12b20,
        0x0b6a0, 0x16aea, 0x069e0, 0x0d5a0, 0x0d0b6, 0x16ba0, 0x0ada0, 0x0abbd, 0x025d0, 0x092d0,
        0x0cab5, 0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0,
        0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530, 0x05aa0, 0x076a3, 0x096d0, 0x04afb, 0x04ad0,
        0x0a4b7, 0x0a4b0, 0x0d4b4, 0x0d4b6, 0x0ad50, 0x055a0, 0x0aba4, 0x0a5b0, 0x052b8, 0x0b27a,
        0x01390, 0x0aae6, 0x0b540, 0x0aa54, 0x0b6a0, 0x05b63, 0x0d5a0, 0x0aba0, 0x0d6a6, 0x0ada0,
        0x055b0, 0x02b85, 0x0a9b0, 0x14b9b, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d963,
        0x0d97a, 0x04b50, 0x0a4b8, 0x0aa4a, 0x0ad50, 0x14b55, 0x052b0, 0x0a6e6, 0x0a4e6, 0x0d26a,
        0x0ea5e, 0x0d530, 0x05aa0, 0x076a1, 0x096d0, 0x04afb, 0x04ad4, 0x0a4b7, 0x0a4a0, 0x0d4b4,
        0x0d4b0, 0x0ad50, 0x0a4d8, 0x0a4b0, 0x0aabd, 0x0a5b0, 0x052bb, 0x0b27a, 0x01390, 0x0aaae,
        0x0b540, 0x0aa4b, 0x0b6a0, 0x05b62, 0x0d5a0, 0x0a5b6, 0x0a6a0, 0x0d5a6, 0x0ada0, 0x055b0,
        0x02b8a, 0x0a9b0, 0x14b98, 0x04b50, 0x0a4b8, 0x0aa4a, 0x0ad50, 0x0a4d8, 0x0a4b0, 0x0aa4c,
        0x0a5b0, 0x052ba, 0x0b27a, 0x0131b, 0x0aaae, 0x0b550, 0x0a4a0, 0x0a4b6, 0x0d5a0, 0x0dda0,
        0x0b5a0, 0x056d0, 0x04ae0, 0x0a9d8, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b5a0,
        0x195a6, 0x095b0, 0x049b0, 0x0a4b8, 0x0a4b0, 0x0b27a, 0x0121b0, 0x099c7, 0x0a50a, 0x0b4a0,
        0x0aae6, 0x0a548, 0x05a63, 0x0aba0, 0x0a5c4, 0x0abcd, 0x095bd, 0x049b0, 0x0a577, 0x0a4b0,
        0x0aa50, 0x1b255, 0x06d2f, 0x0ada0, 0x14b63
    ];

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
     * 公历转农历的核心算法
     */
    static solar2Lunar(year, month, day) {
        // 基准日期：农历1900年1月1日 = 公历1900年1月31日
        const baseDate = new Date(1900, 0, 31);
        const currentDate = new Date(year, month - 1, day);
        
        // 计算天数差
        const diff = Math.floor((currentDate - baseDate) / (1000 * 60 * 60 * 24));
        
        let lunarYear = 1900;
        let daysCount = 0;
        
        // 查找农历年份
        for (let i = 1900; i < 2100; i++) {
            const yearDays = this.getLunarYearDays(i);
            if (daysCount + yearDays > diff) {
                lunarYear = i;
                daysCount = diff - daysCount;
                break;
            }
            daysCount += yearDays;
        }
        
        // 查找农历月份
        let lunarMonth = 1;
        let leapMonth = this.getLeapMonth(lunarYear);
        let daysInMonth = 0;
        
        for (let i = 1; i <= 13; i++) {
            if (i === leapMonth + 1 && leapMonth !== 0) {
                daysInMonth = this.getDaysInMonth(lunarYear, leapMonth, true);
            } else {
                let m = i;
                if (leapMonth !== 0 && i > leapMonth + 1) {
                    m = i - 1;
                }
                daysInMonth = this.getDaysInMonth(lunarYear, m, false);
            }
            
            if (daysCount < daysInMonth) {
                lunarMonth = i;
                break;
            }
            daysCount -= daysInMonth;
        }
        
        const lunarDay = daysCount + 1;
        
        return {
            year: lunarYear,
            month: lunarMonth,
            day: lunarDay,
            toString: function() {
                const months = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'];
                const days = ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
                              '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
                              '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'];
                
                let month = this.month;
                let monthStr = months[month - 1] || '正';
                
                // 检查是否为闰月
                let leapMonth = Lunar.getLeapMonth(this.year);
                if (leapMonth !== 0 && month > leapMonth + 1) {
                    monthStr = months[month - 2] || '正';
                }
                
                const dayStr = days[this.day - 1] || '初一';
                return `农历${this.year}年${monthStr}月${dayStr}`;
            }
        };
    }

    /**
     * 获取农历年的总天数
     */
    static getLunarYearDays(year) {
        let sum = 0;
        for (let i = 1; i <= 12; i++) {
            sum += this.getDaysInMonth(year, i, false);
        }
        
        // 加上闰月天数
        let leapMonth = this.getLeapMonth(year);
        if (leapMonth !== 0) {
            sum += this.getDaysInMonth(year, leapMonth, true);
        }
        
        return sum;
    }

    /**
     * 获取农历年的闰月
     */
    static getLeapMonth(year) {
        const data = this.lunarData[year - 1900];
        return (data >> 16) & 0x0f;
    }

    /**
     * 获取农历月的天数
     */
    static getDaysInMonth(year, month, isLeap) {
        const data = this.lunarData[year - 1900];
        
        if (isLeap) {
            return (data >> 0) & 0x01 ? 30 : 29;
        }
        
        return (data >> (16 - month)) & 0x01 ? 30 : 29;
    }
}
