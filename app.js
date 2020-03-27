const express = require('express');
//const api = require(__dirname + "/Api/login.js" )
const axios = require('axios');
const ejs = require("ejs");
const { uuid } = require('uuidv4');
const xml = require('xml2json');


const app = express();
app.set('view engine', 'ejs');
app.use(express.static("public"));

const key = {"username":"YLX8zu-0139","password":"nmzi5XhK76JsyA0H"};
const endpoint_url = "https://sandbox.galileo-ft.com/intserv/4.0/";
const prodId = 17932;
const ssn = "555555555"
const fn = "Tanner"
const ln = "Orndorff"
const account_nums = [276101014906,276101014922,276101014930,276101014948];
let auth;


async function getAccounts(){
  //find all accounts account number
  let accounts = [];
  let date = new Date();
  let thisMonth = date.toISOString().slice(0,10);
  let lastMonth = new Date(date.setMonth(date.getMonth() - 1)).toISOString().slice(0,10);
  let url = endpoint_url + "getAccountOverview";
  let headers = {
    Authorization : "Bearer " + auth.access_token,
    "Content-Type" : "application/json"
  };
  let body = {
    "transactionId":uuid(),
    "prodId": prodId,
    accountNo : "",
    startDate : lastMonth,
    endDate : thisMonth
  };
  await Promise.all(account_nums.forEach(account => {
      body.accountNo = account;
      axios({
      method: 'post',
      url: url,
      headers: headers,
      data: JSON.stringify(body)
      }).then(function (response) {
        //parse data and store in array of accounts to be rendered
        var json = JSON.parse(xml.toJson(response.data, {reversible: true}));
        console.log(json.response.response_data.pmt_ref_no.$t);
        accounts.push({number:json.response.response_data.pmt_ref_no.$t,balance:0});
      }).catch(function (error){
        console.log(error);
        return accounts;
      });
    }
  ));
  return accounts;
}





app.get("/", function(req,res){
  res.render('home');
});



//API CALLS
app.post("/login", function(req,res){
  axios({
  method: 'post',
  url: endpoint_url + "login",
  headers: {
    "Content-Type" : "application/json"
  },
  data: key
})
  .then(function (response) {
    console.log(response.data);
    auth = {
      access_token : response.data.access_token,
      refresh_token : response.data.refresh_token
    }
    res.redirect("/accountHome")
  }).catch(function (error){
    console.log(error);
    res.render('error');
  });
});//login and get auth

app.get("/accountHome", async function(req,res){
  console.log(await getAccounts());
  //display account overview for each account

})


app.post("/createAccount", function(req,res){
  //format data for create account call
  console.log(auth.access_token);
  let url = endpoint_url + "createAccount";
  let headers = {
    Authorization : "Bearer " + auth.access_token,
    "Content-Type" : "application/json"
  };
  let body = {
    "transactionId":uuid(),
    "prodId": prodId,
    "firstName": fn,
    "lastName": ln,
    "id": ssn,
    "idType": 2
  };
  axios({
  method: 'post',
  url: url,
  headers: headers,
  data: JSON.stringify(body)
})
  .then(function (response) {
    console.log(response.data);
    res.redirect("/accountHome");
  }).catch(function (error){
    console.log(error);
    res.render('error');
  });
});

app.listen(3000, function(req,res){
  console.log("Listening on port 3000");
})
