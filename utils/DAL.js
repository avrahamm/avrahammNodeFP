const axios = require('axios/index');

function getData(url)
{
    return axios.get(url);
}

module.exports = {getData};