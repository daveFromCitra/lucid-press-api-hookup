//  ______ ______ ______ ______ ______ ______ ______
// |______|______|______|______|______|______|______|
// |______|______|______|______|______|______|______|
// |______|______|______|______|______|______|______|
// | |              (_)   | |  __ \
// | |    _   _  ___ _  __| | |__) | __ ___  ___ ___
// | |   | | | |/ __| |/ _` |  ___/ '__/ _ \/ __/ __|
// | |___| |_| | (__| | (_| | |   | | |  __/\__ \__ \
// |______\__,_|\___|_|\__,_|_|   |_|  \___||___/___/
//           _____ _____      _____   ____   _____
//     /\   |  __ \_   _|    |  __ \ / __ \ / ____|
//    /  \  | |__) || |______| |__) | |  | | (___
//   / /\ \ |  ___/ | |______|  ___/| |  | |\___ \
//  / ____ \| |    _| |_     | |    | |__| |____) |
// /_/____\_\_|__ |_____|____|_|_____\____/|_____/__
// |______|______|______|______|______|______|______|
// |______|______|______|______|______|______|______|
// |______|______|______|______|______|______|______|
//
// coder: Dave Blois
// version: 1.00
//
const axios = require('axios');
const utf8 = require('utf8');
const CryptoJS = require('crypto-js');

const auth = require("./apiConfig");

const url = "https://print.app.lucidpress.com/api/printOrders?statuses=SentToVendor";
const header = {
  "Authorization": auth.lucidAuth
}


// this is the LUCID PRESS call to grab files.
function lucidCall() {
  axios({
      method: 'get',
      url: url,
      headers: header
    })
    .then(response => response.data)
    .then(data => {
      //just grabbing all the print jobs in the first order
      console.log(data[0].printJobs)
      console.log(data);
    })
    .catch(err => console.error(err))
}


const jsonData = {
  "destination": {
    "name": "hp.citracommunications"
  },
  "orderData": {
    "sourceOrderId": "DAVE-TEST",
    "items": [{
      "quantity": 1,
      "sourceItemId": "DAVE-1234",
      "sku": "AH_RackCard_4x9_2SD",
      "components": [{
        "code": "Content",
        "fetch": true,
        "path": "https://images.unsplash.com/photo-1632341503970-dbec32e7ec76?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2487&q=80"
      }]
    }],
    "shipments": [{
      "shipTo": {
        "name": "Dave Blois",
        "companyName": "Delta Print Group",
        "address1": "4251 Gateway Park Blvd",
        "town": "Sacramento",
        "postcode": "95831",
        "isoCountry": "US"
      },
      "carrier": {
        "alias": "shipping"
      }
    }]
  }
};
var json = JSON.stringify(jsonData);

function requestGet() {
  var path = "/api/order/";
  var baseUrl = "https://pro-api.oneflowcloud.com";
  var method = "GET";
  axios({
    method: method,
    url: baseUrl + path,
    headers: createHeaders(method, path)
  })
  .then(response => console.log(response))
};

function requestPost() {
  var path = "/api/order";
  var baseUrl = "https://orders.oneflow.io";
  var method = "POST";
  axios({
    method: method,
    url: baseUrl + path,
    headers: createHeaders(method, path),
    data: json
  })
  .then(response => console.log(response))
  .catch(error => console.log(error.response.data.errors))
};



function createHeaders(method, path) {
    var secret = auth.posSecret;
    var key = auth.posKey;
    var timestamp = (new Date()).toISOString();
    var toSign = method.toUpperCase() + " " + path + " " + timestamp;
    var hash = CryptoJS.HmacSHA1(toSign, secret);
    var sig = CryptoJS.enc.Hex.stringify(hash);
    var headers = {
      'x-oneflow-authorization': `${key}:${sig}`,
      'x-oneflow-date': timestamp,
      'content-type': 'application/json'
    };
    return headers;
}

lucidCall();
