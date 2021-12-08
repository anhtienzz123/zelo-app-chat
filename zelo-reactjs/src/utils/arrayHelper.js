export function equalsArray(a, b) {
    if (a.length !== b.length) {
        return false;
    }

    var seen = {};
    a.forEach(function (v) {
        var key = typeof v + v;
        if (!seen[key]) {
            seen[key] = 0;
        }
        seen[key] += 1;
    });

    return b.every(function (v) {
        var key = typeof v + v;
        if (seen[key]) {
            seen[key] -= 1;
            return true;
        }
    });
}

export function checkArrayUndefined(array) {
    array.forEach((ele) => {
        if (Object.keys(ele).length === 0) {
            return true;
        }
    });

    return false;
}
