var jwt = require('jsonwebtoken');
require('dotenv').config();
const axios = require('axios');
const FormData = require('form-data');
let data = new FormData();
const { google } = require('googleapis');
const Oauth2 = google.auth.OAuth2;
const clientId = process.env.clientId;
const clientSecret = process.env.clientSecret;
var refreshToken = process.env.refreshToken;
const OAuth2_client = new Oauth2(clientId, clientSecret); // clientId, clientSecret)
OAuth2_client.setCredentials({ refresh_token: refreshToken });

module.exports = {
    getContak:async (req, res) => {
        let query = req.query;
        try {
            const tokens = await OAuth2_client.getAccessToken(); 
     
            let config = {
                method: 'get',
                url: 'https://people.googleapis.com/v1/people:searchContacts?readMask=names,emailAddresses,phoneNumbers&query='+query.nohp,
                headers: { 
                    'Authorization': 'Bearer ' + tokens.token
                }
              };

            let data =  axios.request(config).then((response) => {
                console.log(JSON.stringify(response.data));
            })
            .catch((error) => {
                console.log(error);
            });
         return   res.send(data);
            
        } catch (error) {
        return res.status(500).json({ error: error.message })
            
        }

        
    },
    addContak: (req, res) => {
        let data = req.body;
        let sql = `INSERT INTO kontak SET ?`;
        db.query(sql, data, (err, result) => {
            if (err) throw err;
            res.send(result);
        })
    }
}
