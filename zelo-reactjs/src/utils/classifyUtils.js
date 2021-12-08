const classifyUtils = {
    getClassifyOfObject: (idConver, classifies) => {
        return classifies.find((ele) =>
            ele.conversationIds.find((id) => id === idConver)
        );
    },
};

export default classifyUtils;
