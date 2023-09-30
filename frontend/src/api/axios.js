import axios from 'axios';

export default axios.create({
    //baseURL: 'http://localhost:3500'
    baseURL: 'http://nodej-loadb-1hlll7ypgzzld-13bfa31c2b9c223c.elb.us-east-1.amazonaws.com:3500'
});