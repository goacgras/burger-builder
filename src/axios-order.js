import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://react-burger-builder-678d8.firebaseio.com/'
});

export default instance;