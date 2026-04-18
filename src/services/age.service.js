import axios from 'axios';

const getAge = async (name) => {
    try{
        const response = await axios.get(`https://api.agify.io?name=${name}`);
        return response.data;
    }catch(error){
        console.error('Agify error:', error.message);
        throw new Error('Unable to get age');
    }
}

export default getAge;