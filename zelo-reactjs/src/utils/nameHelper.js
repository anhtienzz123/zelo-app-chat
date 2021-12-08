const getSummaryName = (name) => {
    if (name) {
        let tempName = name.split(' ');
        let sumary = '';
        if (tempName.length > 1) {
            tempName.forEach((ele, index) => {
                if (index < 2) {
                    sumary += ele.substr(0, 1);
                }
            });
        } else {
            sumary += tempName[0].substr(0, 1);
        }
        return sumary;
    }
};

export default getSummaryName;
