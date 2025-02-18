const minLengthValidator = (value, minLength) => {
    return value.length >= minLength;
};

const requiredValidator = value => {
    return value.trim() !== '';
};

const numberValidator = value => {
    return !isNaN(value) && Number(value) >= 0;
};

const uuidValidator = value => {
    const re = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[4][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
    return re.test(value);
};

const validate = (value, rules) => {
    let isValid = true;

    for (let rule in rules) {
        switch (rule) {
            case 'minLength':
                isValid = isValid && minLengthValidator(value, rules[rule]);
                break;
            case 'isRequired':
                isValid = isValid && requiredValidator(value);
                break;
            case 'isNumber':
                isValid = isValid && numberValidator(value);
                break;
            case 'isUUID':
                isValid = isValid && uuidValidator(value);
                break;
            default:
                isValid = true;
        }
    }

    return isValid;
};

export default validate;
