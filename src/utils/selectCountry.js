const countryCodes = (result) => {
    if(!result || !result.country || result.country.length === 0){
        return null;
    }
    const topCountry = result.country.reduce((max, country) => {
        return country.probability > max.probability ? country : max;
    })

    const country = {
        country_id: topCountry.country_id,
        country_probability: topCountry.probability
    }

    return country;
}

export default countryCodes;