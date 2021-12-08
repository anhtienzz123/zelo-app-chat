const DAY_MILISECONDS = 86400000;
const HOURSE_MILISECONDS = 3600000;
const MINUTE_MILISECONDS = 60000;

const dateUtils = {
  toTime: dateString => {
    const date = new Date(dateString);
    const nowTempt = new Date();

    //  tính năm
    if (nowTempt.getFullYear() - date.getFullYear() > 0)
      return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

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

    return 'Vài giây trước';
  },
  getTime: dateString => {
    const date = new Date(dateString);
    return date.getHours() + ':' + ('00' + date.getMinutes()).slice(-2);
  },
  getDate: dateString => {
    const date = new Date(dateString);
    return (
      ('00' + date.getDate()).slice(-2) +
      '/' +
      ('00' + (date.getMonth() + 1)).slice(-2) +
      '/' +
      date.getFullYear()
    );
  },
};

module.exports = dateUtils;
