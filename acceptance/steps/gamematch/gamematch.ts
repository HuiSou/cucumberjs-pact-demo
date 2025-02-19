import {Before,  Given, When, Then, AfterAll, ITestCaseHookParameter} from '@cucumber/cucumber'
import {Browser, chromium, expect, Page} from '@playwright/test'
import { execSync } from 'child_process'
import getPort from 'get-port'
import { Pact } from '@pact-foundation/pact'
import path from 'path'
import {fileURLToPath} from 'url'
import axios from 'axios'
import { GenericContainer } from "testcontainers"


declare global {
    var pick: string
    var npcpick: string
    var browser: Browser
    var page: Page
    var result: string
    var scenarioname: string
    var pactdir: string 
}
export { };

async function buildGameServerContract() {
    const dirname =fileURLToPath(import.meta.url)
    const pactBasePath = '../../../../pacts'
    const pactConsumerName = `client-${global.scenarioname}`
    const pactProviderName = 'server'
    global.pactdir = path.resolve(dirname, `${pactBasePath}/${pactConsumerName}-${pactProviderName}`)
    const pact = new Pact({
        consumer: pactConsumerName,
        provider: pactProviderName,
        port: await getPort(),
        log: path.resolve(dirname, '../../../logs', 'pact.log'),
        dir: path.resolve(dirname, pactBasePath),
        logLevel: 'info',
      });
    await pact.setup()
    await pact.addInteraction({
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
    const response = await axios.post(`${pact.mockService.baseUrl}/api/matches/actions`,  {pick: global.pick});
    await pact.verify();
    await pact.finalize();
}
 
async function startPactStubServer(): Promise<Number>{

    let container = await new GenericContainer('pactfoundation/pact-stub-server')
    .withExposedPorts(8080)
    .withBindMounts([{source:global.pactdir, target:'/app/pacts'}])
    .withCommand(['--port','8080','--dir','pacts','--cors','--loglevel','debug'])
    .start()

    return container.getMappedPort(8080);
}

async function setupEnvAndOpenBrowser(): Promise<Page>{
	// build contract
    await buildGameServerContract()
	// start server (pact)
    const serverPort = await startPactStubServer()
    // start client 
    const clientPort = await getPort()
    execSync(`cd ../client && export VITE_API_URL=http://localhost:${serverPort} && bun run dev --port ${clientPort} &`, {stdio: 'inherit'})
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