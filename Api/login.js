//using jshint: 6
const axios = require('axios');

exports.Auth = function Auth(at, rt){
    return {
      access_token : at,
      refresh_token : rt
    }
  }
exports.login = function (key, endpoint_url) {
    axios({
    method: 'post',
    url: endpoint_url + "login",
    header: {
      "Content-Type" : "application/json"
    },
    data: key
  })
    .then(function (response) {
      console.log(response.data);
      let auth = {
        access_token : response.data.access_token,
        refresh_token : response.data.refresh_token
      }
      return auth;
    }).catch(function (error){
      console.log(error);
      return error;
    });
}
