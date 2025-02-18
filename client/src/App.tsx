import { useState } from 'react'
import './App.css'

function App() {
  const [npcPick, setNpcPick] = useState('')
  const [result, setResult] = useState('')

  async function handlePlay(myPick: string) {
    try {
      const response = await fetch('http://localhost:3000/api/matches/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pick:myPick }),
      })

      const data = await response.json()
      if (data.error) {
        alert(data.error)
        return
      }
      setNpcPick(data.npc)
      setResult(data.result)
    } catch (err) {
      console.error('Error:', err)
    }
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <h1>Rock-Paper-Scissor</h1>
      <div>
        <button onClick={() => handlePlay('Rock')}>Rock</button>
        <button onClick={() => handlePlay('Paper')}>Paper</button>
        <button onClick={() => handlePlay('Scissor')}>Scissor</button>
      </div>
      <div>
        <p>NPC picked: <strong>{npcPick}</strong></p>
        <p>Result: <strong>{result}</strong></p>
      </div>
    </div>
  )
}

export default App
