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
const access_token = process.env.access_token;
const OAuth2_client = new Oauth2(clientId, clientSecret); // clientId, clientSecret)
OAuth2_client.setCredentials({ refresh_token: refreshToken });


module.exports = {
  // Method untuk refresh access token
  refreshAccessToken: async (req, res) => {
    try {
      const tokens = await OAuth2_client.getAccessToken();
      onsole.log(tokens);

      return res.status(200).json({
        status: 200,
        message: "Token refreshed successfully",
        access_token: tokens.token,
        expires_in: tokens.res?.data?.expires_in
      });

    } catch (error) {
      console.error('Error in refreshAccessToken:', error);
      return res.status(500).json({
        status: 500,
        message: 'Failed to refresh token',
        error: error.message
      });
    }
  },
  getContak: async (req, res) => {
    let query = req.query;
    try {
      // const tokens = await OAuth2_client.getAccessToken();
      // console.log(tokens); 

      let config = {
        method: "get",
        url:
          "https://people.googleapis.com/v1/people:searchContacts?readMask=names,emailAddresses,photos,organizations,phoneNumbers&query=" +
          query.query,
        headers: {
          Authorization: "Bearer " + access_token
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
      console.error(error);
      return res.status(500).json({ error: error });
    }
  },
  addContak: async (req, res) => {
    // const tokens = await OAuth2_client.getAccessToken();
    let body = req.body;
    // console.log(body);
    let config = {
      method: "post",
      url: "https://people.googleapis.com/v1/people:createContact",
      headers: {
        Authorization: "Bearer " + access_token,
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
        return res.status(200).json({
          status: 200,
          message: "success",
          data: error,
        });
      });
    return res.status(200).json({
      status: 200,
      message: "success",
      data: create,
      // body: body,
    });
  },
  batchGetContak: async (req, res) => {
    let query = req.query;
    try {
      // const tokens = await OAuth2_client.getAccessToken();
      // console.log(query);
      let config = {
        method: "get",
        url:
          "https://people.googleapis.com/v1/people:batchGet?personFields=names,emailAddresses,organizations,phoneNumbers&resourceNames=" + query.resourceNames,
        headers: {
          Authorization: "Bearer " + access_token,
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
