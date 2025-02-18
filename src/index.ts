import { Elysia } from "elysia";

type PlayerAction = { pick:string } 
const app = new Elysia().post("/api/matches/actions", ({body}) => {
 const playerAction = body as PlayerAction
 return { player:playerAction.pick, npc:"rock", result:"inconclusive" }
}
).listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
