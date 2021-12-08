const DAY_MILISECONDS = 86400000;
const HOURSE_MILISECONDS = 3600000;
const MINUTE_MILISECONDS = 60000;

const dateUtils = {
    toTime: (dateString) => {
        const date = new Date(dateString);

        const nowTempt = new Date();

        //  tính năm
        if (nowTempt.getFullYear() - date.getFullYear() > 0)
            return `${date.getDate()}/${
                date.getMonth() + 1
            }/${date.getFullYear()}`;

        const dateWasMinus7day = nowTempt.setDate(nowTempt.getDate() - 7);

        if (date < dateWasMinus7day)
            return `0${date.getDate()}/${date.getMonth() + 1}`.slice(-2);

        const now = new Date();
        const numberMiliseconds = now - date;

        // tính ngày
        const day = Math.floor(numberMiliseconds / DAY_MILISECONDS);
        if (day > 0) return `0${day}`.slice(-2) + ` ngày`;
        // `0${date.getHours()}`.slice(-2);

        // tính giờ
        const hour = Math.floor(numberMiliseconds / HOURSE_MILISECONDS);
        if (hour > 0) return `0${hour}`.slice(-2) + ` giờ`;

        // tính phút
        const minute = Math.floor(numberMiliseconds / MINUTE_MILISECONDS);
        if (minute > 0) return `0${minute}`.slice(-2) + ` phút`;

        return 'Vài giây';
    },

    transferDateString: (day, month, year) => {
        return (
            `0${day}`.slice(-2) + '/' + `0${month}`.slice(-2) + '/' + `${year}`
        );
    },
    compareDate: (time, currentTime) => {
        return time.setHours(0, 0, 0, 0) === currentTime.setHours(0, 0, 0, 0);
    },
    checkLeapYear: (year) => {
        return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
    },
};

module.exports = dateUtils;
