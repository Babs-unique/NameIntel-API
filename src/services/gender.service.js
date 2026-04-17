import axios from 'axios';

const classifyGender = async (name) => {
    try{
        const response = await axios.get(`https://api.genderize.io?name=${name}`);
        return response.data;
    }catch(error){
        console.error(error);
        throw new Error('Unable to classify gender');
    }
}

export default classifyGender;