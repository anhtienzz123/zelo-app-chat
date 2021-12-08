const DAY_MILISECONDS = 86400000;
const HOURSE_MILISECONDS = 3600000;
const MINUTE_MILISECONDS = 60000;

const dateUtils = {
    toObject: (date) => {
        return {
            day: date.getDate(),
            month: date.getMonth() + 1,
            year: date.getFullYear(),
        };
    },

    toDate: (dateString) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        if (date.toDateString() === 'Invalid Date') return null;

        return date;
    },
    toDateFromObject: function (dateObj) {
        const { day, month, year } = dateObj;
        const dateString = `${year}-${month}-${day}`;
        return this.toDate(dateString);
    },
    toObjectFull: (date) => {
        return {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            day: date.getDate(),
            hours: date.getHours(),
            minutes: date.getMinutes(),
            seconds: date.getSeconds(),
        };
    },

    toTime: (date) => {
        const nowTempt = new Date();

        //  tính năm
        if (nowTempt.getFullYear() - date.getFullYear() > 0)
            return `${date.getDate()}/${
                date.getMonth() + 1
            }/${date.getFullYear()}`;

        const dateWasMinus7day = nowTempt.setDate(nowTempt.getDate() - 7);

        if (date < dateWasMinus7day)
            return `${date.getDate()}/${date.getMonth() + 1}`;

        const now = new Date();
        const numberMiliseconds = now - date;

        // tính ngày
        const day = Math.floor(numberMiliseconds / DAY_MILISECONDS);
        if (day > 0) return `${day} ngày`;

        // tính giờ
        const hour = Math.floor(numberMiliseconds / HOURSE_MILISECONDS);
        if (hour > 0) return `${hour} giờ`;

        // tính phút
        const minute = Math.floor(numberMiliseconds / MINUTE_MILISECONDS);
        if (minute > 0) return `${minute} phút`;

        return 'Vài giây';
    },
};

module.exports = dateUtils;
