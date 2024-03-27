import dedent from '/static/dedent.js'
import commands from '/static/home/commands.js'
import { neofetch, stdout, scrollDown } from '/static/home/utils.js'

const history =  document.getElementById('history')
const prompt =  document.getElementById('prompt')

const ignore = [
  'Control', 'Alt', 'Meta', 'Shift',
  'Home', 'Delete', 'End', 'PageUp', 'PageDown',
  'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
  'Escape', 'CapsLock', 'Tab', 'Enter', 'Backspace',
  'Insert', 'ContextMenu', 'Pause', 'ScrollLock',
  'PrintScreen', 'F1', 'F2', 'F3', 'F4', 'F5',
  'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'
]

let commandHistory = []
let commandHistoryIndex = 0

document.addEventListener('DOMContentLoaded', async () => {
  history.innerHTML += await neofetch()
})

document.addEventListener('keydown', async (event) => {
  scrollDown()

  if (event.key === 'Enter')              return await runCommand(event)
  if (event.ctrlKey && event.key === 'c') return cancelCommand(event)
  if (event.key === 'Backspace')          return backspace(event)
  if (event.key === 'ArrowUp')            return historyUp(event)
  if (event.key === 'ArrowDown')          return historyDown(event)

  if (!ignore.includes(event.key)) prompt.innerHTML += event.key
})

async function runCommand() {
  const cfg = {
    stdout: (out) => stdout({ history, prompt }, out),
    dedent,
    history,
    prompt,
    args: prompt.innerText.split(' ').slice(1).join(' ')
  }

  const command = commands[prompt.innerText.split(' ')[0]]
  if (command) await command.fn(cfg)
  else {
    if (prompt.innerText.length <= 0)
      return cfg.stdout('')

    cfg.stdout(`Unknown Command: ${prompt.innerText}`)
  }

  if (commandHistory[commandHistory.length - 1] !== prompt.innerText)
    commandHistory.push(prompt.innerText)

  commandHistoryIndex = commandHistory.length
  prompt.innerText = ''
  scrollDown()
}

function cancelCommand() {
  history.innerHTML += `
    <div>
      <p>
        <span class="green">➜ </span>&nbsp;
        <span class="cyan">~</span>
        <span>${prompt.innerText}^C</span>
      </p>
    </div>
  `

  commandHistoryIndex = commandHistory.length
  prompt.innerText = ''
}

function backspace() {
  prompt.innerText = prompt.innerText.slice(0, -1)
}

function historyUp(event) {
  event.preventDefault()
  if (commandHistoryIndex <= 0) return

  prompt.innerText = commandHistory[--commandHistoryIndex]
}

function historyDown(event) {
  event.preventDefault()
  if (commandHistoryIndex >= commandHistory.length - 1) return

  prompt.innerText = commandHistory[++commandHistoryIndex]
}