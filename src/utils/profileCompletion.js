const PROFILE_COMPLETION_FIELDS = [
    "mobileNumber",
    "githubLink",
    "linkedinLink",
    "resumeLink",
    "about",
];

const isFilled = (value) => {
    if (value === null || value === undefined) {
        return false;
    }

    if (typeof value === "string") {
        return value.trim().length > 0;
    }

    return true;
};

const calculateProfileCompletion = (userData = {}) => {
    const totalFields = PROFILE_COMPLETION_FIELDS.length;

    if (totalFields === 0) {
        return 0;
    }

    const filledFields = PROFILE_COMPLETION_FIELDS.reduce((count, field) => {
        return count + (isFilled(userData[field]) ? 1 : 0);
    }, 0);

    const completion = (filledFields / totalFields) * 100;
    return Math.round(completion);
};

export { PROFILE_COMPLETION_FIELDS, calculateProfileCompletion };
