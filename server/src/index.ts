import { Elysia } from "elysia";
import { cors } from '@elysiajs/cors'

type PlayerAction = { pick:string } 
const Choice = {'rock':0, 'paper':1, 'scissor':2 } as const
const NpcChoice = ['rock','paper','scissor'] as const

function decideWinner(playerPick:String, npcPick:String) 
{
  playerPick = playerPick.toLowerCase()
  npcPick = npcPick.toLowerCase()
  if( playerPick === npcPick ) return 'draw'
  const diff = (Choice[playerPick as keyof typeof Choice] - Choice[npcPick as keyof typeof Choice] +3 ) %3
  return diff===1?'win':'lose'
}

export function CreateServer(){
  return new Elysia()
  .use(cors())
  .post("/api/matches/actions", ({body}) => {
    const playerAction = body as PlayerAction
    const npcChoice = NpcChoice[Math.floor(Math.random()*3)]
    console.log(`player ${playerAction.pick} npc ${npcChoice}`)
    return { player:playerAction.pick as string, npc:npcChoice, result:decideWinner(playerAction.pick, npcChoice) }
  })
}

const app = CreateServer().listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
