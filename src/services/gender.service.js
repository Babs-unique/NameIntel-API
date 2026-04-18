import axios from 'axios';

const classifyGender = async (name) => {
    try{
        const response = await axios.get(`https://api.genderize.io?name=${name}`);
        return response.data;
    }catch(error){
        console.error('Genderize error:', error.message);
        throw new Error('Unable to classify gender');
    }
}

export default classifyGender;