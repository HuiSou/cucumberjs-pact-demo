import {Before,  Given, When, Then, AfterAll} from '@cucumber/cucumber'
import {Browser, chromium, expect, Page} from '@playwright/test'
import { glob } from 'fs'
import { waitForDebugger } from 'inspector'

declare global {
    var pick: string
    var npcpick: string
    var browser: Browser
    var page: Page
    var winner: string
}
export { };

async function setupEnvAndOpenBrowser(): Promise<Page>{
	// build contract
	// start server
	// start browser
	global.browser = await chromium.launch({headless:false})
	const context = await global.browser.newContext()
	const page = await context.newPage()
	await page.goto("http://localhost:5173/")
	await page.waitForLoadState('domcontentloaded')
	return page
}

Given('I pick {string}', function(pick: string){
    global.pick = pick
})

Given('NPC \\(server) pick {string}', function(npcpick: string){
    global.npcpick = npcpick
})

Given('The game decide that {string} should win the game', function (winner:string) {
    global.winner = winner
})

When('The match is on', async function () { 
    global.page = await setupEnvAndOpenBrowser()
    await global.page.getByTestId(global.pick).click() 
})

Then('The winner should be {string}', function (expected_result: string) {
   let locator = global.page.getByTestId('result')
   expect(locator).toHaveText(expected_result)
})

AfterAll(async function(){
     await global.browser.close();
})