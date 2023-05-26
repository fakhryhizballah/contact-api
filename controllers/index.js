var jwt = require("jsonwebtoken");
require("dotenv").config();
const axios = require("axios");
const FormData = require("form-data");
let data = new FormData();
const { google } = require("googleapis");
const Oauth2 = google.auth.OAuth2;
const clientId = process.env.clientId;
const clientSecret = process.env.clientSecret;
var refreshToken = process.env.refreshToken;
const OAuth2_client = new Oauth2(clientId, clientSecret); // clientId, clientSecret)
OAuth2_client.setCredentials({ refresh_token: refreshToken });

module.exports = {
  getContak: async (req, res) => {
    let query = req.query;
    try {
      const tokens = await OAuth2_client.getAccessToken();

      let config = {
        method: "get",
        url:
          "https://people.googleapis.com/v1/people:searchContacts?readMask=names,emailAddresses,organizations,phoneNumbers&query=" +
          query.query,
        headers: {
          Authorization: "Bearer " + tokens.token,
        },
      };

      let data = await axios
        .request(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
          return response.data;
        })
        .catch((error) => {
          console.log(error);
        });
      console.log(data);
      return res.status(200).json({
        status: 200,
        message: "success",
        data: data,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
  addContak: async (req, res) => {
    const tokens = await OAuth2_client.getAccessToken();
    let body = req.body;
    console.log(body);
    let config = {
      method: "post",
      url: "https://people.googleapis.com/v1/people:createContact",
      headers: {
        Authorization: "Bearer " + tokens.token,
      },
      data: {
        names: [
          {
            givenName: body.name,
          },
        ],
        phoneNumbers: [
          {
            value: body.phoneNumber,
          },
        ],
        emailAddresses: [
          {
            value: body.email,
          },
        ],
        organizations: [
          {
            name: body.organizations.name,
            title: body.organizations.title,
          },
        ],
        birthdays: [
          {
            date: {
              year: body.birthdays.year,
              month: body.birthdays.month,
              day: body.birthdays.day,
            },
          },
        ],
        biographies: [
          {
            value: body.bio,
          },
        ],
      },
    };

    let create = await axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        return response.data;
      })
      .catch((error) => {
        console.log(error);
      });
    return res.status(200).json({
      status: 200,
      message: "success",
      data: create,
      body: body,
    });
  },
  batchGetContak: async (req, res) => {
    let query = req.query;
    try {
      const tokens = await OAuth2_client.getAccessToken();
      console.log(query);
      let config = {
        method: "get",
        url:
          "https://people.googleapis.com/v1/people:batchGet?personFields=names,emailAddresses,organizations,phoneNumbers&resourceNames=" + query.resourceNames,
        headers: {
          Authorization: "Bearer " + tokens.token,
        },
      };
      let batchGet = await axios
        .request(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
          return response.data;
        })
        .catch((error) => {
          console.log(error);
          return error;
        });
      return res.status(200).json({
        status: 200,
        message: "success",
        data: batchGet,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
};
