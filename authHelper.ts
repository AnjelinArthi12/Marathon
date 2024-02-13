import { chromium } from "@playwright/test";

async function getAccessToken(){
    const browser = await chromium.launch();
    const browserContext = await browser.newContext();
    const apiRequestContext = browserContext.request;

    const clientID = "3MVG95mg0lk4bathWIih46Vrwon1ShnPIpBvcMC9CiyfNdGBs.G81WqRVPiB6MREIT65CT_iDbZoYD9E7YZkf";
    const clientSecret = "5B6C20BB243E2A89FFD930A020A4BE90E80426F5117D4A9660271F5AB3B0277D";
    const username = "anjelinarthidevaraj@gmail.com";
    const password = "Tco@2023";
    const url = "https://koch-3f-dev-ed.develop.my.salesforce.com/services/oauth2/token";

    const generatingToken = await apiRequestContext.post(url,{

        headers:{

        "Content-Type" : "application/x-www-form-urlencoded",
        "Connection" : "keep-alive"
    },

        form:{
        "grant_type": "password",
        "client_id" : clientID,
        "client_secret" : clientSecret,
        "username" : username,
        "password" : password

    }
    });

    const generatingTokenJSON = await generatingToken.json();
    console.log(generatingTokenJSON);
    return{
        accessToken: generatingTokenJSON.access_token,
        inst_Url: generatingTokenJSON.instance_url
    }
      
}
export {getAccessToken};


