import { uptime, neofetch } from '/static/home/utils.js'

// export const COMMANDS = [
//   { name: 'help', description: 'show help menu.' },
//   { name: 'whoami', description: 'who am i?.' },
//   { name: 'uptime', description: 'see system uptime.' },
//   { name: 'neofetch', description: 'fetch system info.' },
//   { name: 'clear', description: 'clear history.' },
//   { name: 'bruh', description: 'clear history.' },
// ]

const COMMANDS = {
  'help': {
    description: 'show help menu.',
    fn: ({ stdout, dedent }) => {
      stdout(dedent`
        Help Menu

        Commands:
        ${Object.keys(COMMANDS)
            .map(command => `  <span class="green">${command}</span> - ${COMMANDS[command].description}`)
            .join('<br>')
          }
      `)
    }
  },
  'whoami': {
    description: 'who am i?.',
    fn: ({ stdout, dedent }) => {
      stdout(dedent`
        who am i?

        i am qxb3! my real name is justin,
        im currently 18 yrs old living in the terrible place called philippines,
        i have no life and i just code for fun. :)
      `)
    }
  },
  'uptime': {
    description: 'see system uptime.',
    fn: async ({ stdout }) => {
      const up = await uptime()
      stdout(up)
    }
  },
  'echo': {
    description: 'print given arguments',
    fn: ({ stdout, args }) => {
      stdout(args)
    }
  },
  'neofetch': {
    description: 'fetch system info.',
    fn: async ({ stdout }) => {
      const fetch = await neofetch()
      stdout(fetch)
    }
  },
  'clear': {
    description: 'clear history.',
    fn: ({ history }) => {
      history.innerHTML = ''
    }
  }
}

export default COMMANDS
