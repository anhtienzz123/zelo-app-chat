import COLOR from 'constants/color';
const randomColor = () => {
    const randomIndex = Math.trunc(Math.random() * COLOR.length);
    return COLOR[randomIndex];
};

export default randomColor();
