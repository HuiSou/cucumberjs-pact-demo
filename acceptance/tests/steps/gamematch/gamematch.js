import {Before,  Given, When, Then} from '@cucumber/cucumber'
import {chromium, expect} from '@playwright/test'



Before(async function(){
	const browser = await chromium.launch({headless:false})
	const context = await browser.newContext()
       });
       
Given('I pick rock', async function(){
	return 'pending';
});
Given('NPC (server) pick {string}', async function(string){

});
