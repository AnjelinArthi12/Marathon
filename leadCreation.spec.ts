import {expect, test} from "@playwright/test";
import { getAccessToken } from "./authHelper";

let accessToken : any;
let inst_Url : any;
let leadId : any;
/* let firstName : "Lead";
let lastName : "API"; */

test(`To get access token using export function`,async()=>{
    const authData = await getAccessToken();
    accessToken = authData.accessToken;
    inst_Url = authData.inst_Url;
})

test(`To create lead in salesforce via API`,async({request})=>{
    const createLead = await request.post("https://koch-3f-dev-ed.develop.my.salesforce.com/services/data/v60.0/sobjects/Lead",
    {
        headers:{
            "Authorization": `Bearer ${accessToken}`,
            "Connection" : "keep-alive",
        },
        data:{
            "LastName":"Michael",
            "Company":"Qeagle"
        }
    })
    const respCreateLead = await createLead.json();
    expect(createLead.status(),'Expect status to be 201').toBe(201);
    leadId = respCreateLead.id;
    console.log(leadId);
})

test(`To update the lead using API`,async({request})=>{
    const updateLead = await request.patch(`${inst_Url}/services/data/v60.0/sobjects/Lead/${leadId}`,
    {
        headers:{
            "Authorization": `Bearer ${accessToken}`,
            "Connection" : "keep-alive",
        },
        data:{
            "Salutation" : "Mr.",
            "FirstName" : "Testleaf"
        }
    })
    expect(updateLead.status(),'Expect status to be 204').toBe(204);
})

test(`To delete the lead created from salesforce`,async({page})=>{
    await page.goto("https://koch-3f-dev-ed.develop.my.salesforce.com/");
    await page.fill("#username","anjelinarthidevaraj@gmail.com");
    await page.fill("#password","Tco@2023");
    await page.click("#Login");

    //Navigate to Leads menu
    page.waitForLoadState();
    await page.getByRole("button", {name:'App Launcher'}).click();
    await page.getByPlaceholder("Search apps and items...").fill("Leads");
    await page.getByRole("option",{name:"Leads"}).click();
    await page.waitForLoadState();

    await page.locator("input[name='Lead-search-input']").click();
    await page.fill("input[name='Lead-search-input']",`Testleaf Michael`);
    await page.keyboard.press('Enter');

    //Delete the lead
    await page.waitForLoadState();
    await page.getByRole('link', { name: 'Testleaf Michael' }).click();

    //Select More Options
   await page.waitForLoadState('load');
   await page.waitForTimeout(5000);
   await page.locator("//button//span[text()='Show more actions']").click();
   //Click on delete
   await page.locator("//div[@class='slds-dropdown__item']//span[text()='Delete']").click();
   //Delete Lead and verify
   await page.waitForLoadState('load');
   await page.getByRole("button",{name:"Delete"}).click();
   expect(await page.innerText('//div[contains(@id,"toastDescription")]//span')).toContain(`Lead "Testleaf Michael" was deleted.`);
   await page.waitForTimeout(5000);

   //Verify Lead is not present once deleted
   await page.waitForLoadState('load');
   await page.locator("input[name='Lead-search-input']").click();
   await page.fill("input[name='Lead-search-input']",`Testleaf Michael`);
   await page.keyboard.press('Enter');
   await page.locator("//span[text()='No items to display.']").isVisible();

})

