import {Before,  Given, When, Then, AfterAll, ITestCaseHookParameter} from '@cucumber/cucumber'
import {Browser, chromium, expect, Page} from '@playwright/test'
import { execSync } from 'child_process'
import { glob, stat } from 'fs'
import { waitForDebugger } from 'inspector'
import getPort from 'get-port'
import { CreateServer }from '../../../server/src/server.ts'
import { Pact } from '@pact-foundation/pact'
import path from 'path'
import {fileURLToPath} from 'url'
import axios from 'axios'
import { debug } from 'console'
declare global {
    var pick: string
    var npcpick: string
    var browser: Browser
    var page: Page
    var result: string
    var scenarioname: string
}
export { };

async function buildGameServerContract(){
    const dirname =fileURLToPath(import.meta.url)
    const provider = new Pact({
        consumer: `client-${global.scenarioname}`,
        provider: 'server',
        port: await getPort(),
        log: path.resolve(dirname, '../../../logs', 'pact.log'),
        dir: path.resolve(dirname, '../../../../pacts'),
        logLevel: 'info',
      });
    await provider.setup()
    await provider.addInteraction({
        state: `player pick ${global.pick} , npc pick ${global.npcpick} , result ${global.result}`,
        uponReceiving: `player request ${global.pick}`,
        withRequest: {
            method: 'POST',
            path: '/api/matches/actions',
            body: { pick: global.pick }
        },
        willRespondWith: {
            status: 200,
            body: { player: global.pick, npc: global.npcpick, result: global.result}
        },
    })
    const response = await axios.post(`${provider.mockService.baseUrl}/api/matches/actions`,  {pick: global.pick});
    await provider.verify();
    await provider.finalize();
}
 
async function setupEnvAndOpenBrowser(): Promise<Page>{
	// build contract
    await buildGameServerContract()
	// start server
    // start client & bff , for demonstration, I will use a bun run dev as bff
    const clientPort = await getPort()
    execSync(`cd ../client && bun run dev --port ${clientPort} &`, {stdio: 'inherit'})
	// start browser
	global.browser = await chromium.launch({headless:false})
	const context = await global.browser.newContext()
	const page = await context.newPage()
	await page.goto(`http://localhost:${clientPort}/`)
	await page.waitForLoadState('domcontentloaded')
	return page
}

Before(function(scenario: ITestCaseHookParameter){
   global.scenarioname= scenario.pickle.name.toLowerCase().replace(/\s/g, '-')
})

Given('I pick {string}', function(pick: string){
    global.pick = pick
})

Given('NPC \\(server) pick {string}', function(npcpick: string){
    global.npcpick = npcpick
})

Given('The game complete with player as a {string}', function (result:string) {
    global.result = result
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
     await global.browser!.close();
})