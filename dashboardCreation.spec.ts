import {expect, test} from "@playwright/test"

let dashboard = "Salesforce Automation by Arthi";
let accessToken: any;
let instUrl: any;
let id: any;

test(`To create dashboard in salesforce`,async({page})=>{
    await page.goto("https://koch-3f-dev-ed.develop.my.salesforce.com/");
    await page.fill("#username","anjelinarthidevaraj@gmail.com");
    await page.fill("#password","Tco@2023");
    await page.click("#Login");

    //Navigate to dashboard menu
    page.waitForLoadState();
    await page.getByRole("button", {name:'App Launcher'}).click();
    await page.getByPlaceholder("Search apps and items...").fill("Dashboards");
    await page.getByRole("option",{name:"Dashboards"}).click();
    await page.waitForLoadState();

    //Create new Dashboard
    await page.getByRole('button', { name: 'New Dashboard' }).click();
    const newdashboard=page.frameLocator("//iframe[@title='dashboard']").first();
    await newdashboard.locator("#dashboardNameInput").fill(dashboard);
    //await page.fill("#dashboardNameInput",dashboard);
    await newdashboard.locator("#dashboardDescriptionInput").fill("Test Creation of Dashboard");
    //await page.fill("#dashboardDescriptionInput","Test Creation of Dashboard")
    await newdashboard.locator("#submitBtn").click();
    //await page.click("#submitBtn");
    await page.waitForTimeout(10000);
    const frameSet = page.frameLocator("iframe").getByTitle("dasboard").filter({hasText:dashboard})
    await frameSet.isVisible();

})

test(`Test to generate Access Token`, async ({request}) => {

    const clientID = "3MVG95mg0lk4bathWIih46Vrwon1ShnPIpBvcMC9CiyfNdGBs.G81WqRVPiB6MREIT65CT_iDbZoYD9E7YZkf";
    const clientSecret = "5B6C20BB243E2A89FFD930A020A4BE90E80426F5117D4A9660271F5AB3B0277D";
    const username = "anjelinarthidevaraj@gmail.com";
    const password = "Tco@2023";
    const url = "https://koch-3f-dev-ed.develop.my.salesforce.com/services/oauth2/token";
    
    const generatingToken = await request.post(url,{
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
   // console.log(generatingTokenJSON);

    accessToken = generatingTokenJSON.access_token;
    instUrl = generatingTokenJSON.instance_url;
    
})

test(`To get the Dashboard details created`,async({request})=>{
    const getDashboard = await request.get(`${instUrl}/services/data/v59.0/sobjects/Dashboard`,
    {
        headers:{
            "Authorization": "Bearer "+accessToken,
            "Connection" : "keep-alive"
        }
    })
    const respDashboard = await getDashboard.json();
    console.log(respDashboard);
    const respTitle = respDashboard.recentItems[0].Title;
    expect(respTitle).toBe(dashboard);
    expect(getDashboard.status(),'expect status to return 200').toBe(200);
    id = respDashboard.recentItems[0].Id;
    console.log(id);


})

test(`To delete the dashboard created`,async({request})=>{
    const deleteDashboard = await request.delete(`${instUrl}/services/data/v59.0/sobjects/Dashboard/${id}`,
    {
        headers:{
            "Authorization": "Bearer "+accessToken,
            "Connection" : "keep-alive"
        }
    })
    expect(deleteDashboard.status(),'expect status to return 204').toBe(204);
})