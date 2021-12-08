const FILTER_FRIEND = {
    FILTER_LEFT: [
        {
            key: '1',
            value: 'Tất cả',
        },
        {
            key: '2',
            value: 'Nhóm tôi quản lý',
        },
    ],

    FILTER_RIGHT: [
        {
            key: '1',
            value: 'Theo tên nhóm (A-Z)',
        },
        {
            key: '2',
            value: 'Theo tên nhóm (Z-A)',
        },
    ],
};

export function getValueFromKey(type, key) {
    if (type === 'LEFT') {
        return FILTER_FRIEND.FILTER_LEFT.find((ele) => ele.key === key).value;
    }
    if (type === 'RIGHT') {
        return FILTER_FRIEND.FILTER_RIGHT.find((ele) => ele.key === key).value;
    }
}
