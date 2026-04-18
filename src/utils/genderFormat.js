const genderFormat = (result) => {
    return {
        gender: result.gender,
        gender_probability: result.probability,
        sample_size: result.count
    }
}

export default genderFormat;