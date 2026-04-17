import axios from 'axios';

const getAge = async (name) => {
    try{
        const response = await axios.get(`https://api.agify.io?name=${name}`);
        return response.data;
    }catch(error){
        console.error(error);
    }
}

export default getAge;