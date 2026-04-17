const genderFormat = (result) => {
    const sample_count = result.sample_size;
    return {
        gender: result.gender,
        gender_probability: result.gender_probability,
        sample_size: sample_count
    }
}

export default genderFormat;