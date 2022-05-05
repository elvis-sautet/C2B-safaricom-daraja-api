const dateTime = require("node-datetime");
const axios = require("axios");

//consumer key
const consumer_key = process.env.CONSUMER_KEY;
//consumer secret
const consumer_secret = process.env.CONSUMER_SECRET;
// short code
const mpesa_short_code = process.env.MPESA_SHORT_CODE;

//pass key
const passKey = process.env.PASS_KEY;

// formatted date from node-datetime
const date_time = dateTime.create();
const formatted_date = date_time.format("YmdHMS");

// generate a password
const generatePassword = () => {
  const password = mpesa_short_code + passKey + formatted_date;

  // hashed base64 encoded password
  const base64Password = Buffer.from(password).toString("base64");
  return base64Password;
};

// generate an access token
const generateAccessToken = async () => {
  const password = generatePassword();
  const url = `https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials`;

  const auth =
    "Basic " +
    Buffer.from(consumer_key + ":" + consumer_secret).toString("base64");

  const options = {
    method: "GET",
    headers: {
      Authorization: auth,
    },
  };
  const request = await axios.get(url, options);
  const access_token = request.data.access_token;
  return access_token;
};

//register url
const registerUrl = async (req, res) => {
  const access_token = await generateAccessToken();
  console.log(access_token);
  const url = `https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + access_token,
  };
  const requestBody = {
    ShortCode: mpesa_short_code,
    ResponseType: "Cancelled",
    ConfirmationURL: "https://af5b-80-240-201-82.ngrok.io/confirmation",
    ValidationURL: "https://af5b-80-240-201-82.ngrok.io/validation",
  };
  const options = {
    method: "POST",
    headers: headers,
    data: requestBody,
  };
  try {
    const response = await axios.post(url, requestBody, options);
    console.log(response.data);
    res.json(response.data);
  } catch (error) {
    // if axios throws an error check if the error is from axios or from the server
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
      res.json(error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log("failed to get response");
      console.log(error.request);
      res.json(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log("Error", error.message);
      res.json(error.message);
    }
  }
};

// simulate c2b transaction
const simulatePayment = async (req, res) => {
  const access_token = await generateAccessToken();
  const url = `https://sandbox.safaricom.co.ke/mpesa/c2b/v1/simulate`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + access_token,
  };
  const requestBody = {
    ShortCode: mpesa_short_code,
    CommandID: "CustomerPayBillOnline",
    Amount: "1",
    Msisdn: "254708374149",
    BillRefNumber: "TestAPI",
  };
  const options = {
    method: "POST",
    headers: headers,
    data: requestBody,
  };
  try {
    const response = await axios.post(url, requestBody, options);
    res.json({
      status: "success",
      response: response.data,
    });
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

module.exports = {
  registerUrl,
  simulatePayment,
};
