const ageClassifier = (age) => {
    if (age >= 0 && age <= 12) {
        return "child";
    } else if (age >= 13 && age <= 19) {
        return "teenager";
    } else if (age >= 20 && age <= 59) {
        return "adult";
    } else if (age >= 60) {
        return "senior";
    }
    return "adult";
}

export default ageClassifier;