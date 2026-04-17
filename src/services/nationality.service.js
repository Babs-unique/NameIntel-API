import axios from 'axios';

const getNationality = async (name) => {
    try{
        const response = await axios.get(`https://api.nationalize.io?name=${name}`);
        return response.data;
    }catch(error){
        console.error(error);
        throw new Error('Unable to get nationality');
    }
}

export default getNationality;