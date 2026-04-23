const parseNaturalLanguageQuery = (query) => {
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
        return null;
    }

    const q = query.toLowerCase().trim();
    const filters = {};

    const hasMale =/\b(male|man|men|boy|boys|males)\b/.test(q);
    const hasFemale = /\b(female|woman|women|girl|girls|females)\b/.test(q)

    if (hasMale && !hasFemale) {
        filters.gender = 'male';
    }

    if (hasFemale && !hasMale) {
        filters.gender = 'female';
    }

    if (/\b(child|children|kid|kids)\b/.test(q)) {
        filters.age_group = 'child';
    } else if (/\b(teenager|teenagers|teens)\b/.test(q)) {
        filters.age_group = 'teenager';
    } else if (/\b(adult|adults)\b/.test(q)) {
        filters.age_group = 'adult';
    } else if (/\b(senior|seniors|elderly|old)\b/.test(q)) {
        filters.age_group = 'senior';
    }

    const aboveMatch = q.match(/(?:above|over|older than|at least)\s+(\d+)/);
    if (aboveMatch) {
        filters.min_age = parseInt(aboveMatch[1], 10);
    }

    const belowMatch = q.match(/(?:below|under|younger than)\s+(\d+)/);
    if (belowMatch) {
        filters.max_age = parseInt(belowMatch[1], 10);
    }

    if (/\byoung\b/.test(q)) {
        filters.min_age = 16;
        filters.max_age = 24;
    }

    const countryMap = {
        NG: ["nigeria", "nigerian", "nigerians"],
        KE: ["kenya", "kenyan", "kenyans"],
        UG: ["uganda", "ugandan", "ugandans"],
        GH: ["ghana", "ghanaian", "ghanaians"],
        ZA: ["south africa", "sa", "south african", "south africans"],
        TZ: ["tanzania", "tanzanian", "tanzanians"],
        ET: ["ethiopia", "ethiopian", "ethiopians"],
        CM: ["cameroon", "cameroonian", "cameroonians"],
        BJ: ["benin", "beninese"],
        AO: ["angola", "angolan", "angolans"],
        SD: ["sudan", "sudanese"],
        US: ["united states", "usa", "us", "american", "americans"],
        GB: ["united kingdom", "uk", "british"],
        CA: ["canada", "canadian", "canadians"],
        IN: ["india", "indian", "indians"],
        FR: ["france", "french"],
        DE: ["germany", "german", "germans"],
        ES: ["spain", "spanish"],
        IT: ["italy", "italian", "italians"],
        JP: ["japan", "japanese"],
        CN: ["china", "chinese"],
        BR: ["brazil", "brazilian", "brazilians"],
        MX: ["mexico", "mexican", "mexicans"],
        AU: ["australia", "australian", "australians"],
};

    const countryMatch = q.match(/from\s+([a-z\s]+)/);
    if (countryMatch) {
        const name = countryMatch[1].trim();
        if (countryMap[name]) {
            filters.country_id = countryMap[name];
        }
    }

    for (const [code, names] of Object.entries(countryMap)) {
        if (names.some(name => q.includes(name))) {
            filters.country_id = code;
            break;
        }
    }

    if (Object.keys(filters).length === 0) return null;

    return filters;
};

export default parseNaturalLanguageQuery;
