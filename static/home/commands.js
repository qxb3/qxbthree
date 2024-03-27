import figlet from '/static/figlet.js'
import { uptime, neofetch, createTree } from '/static/home/utils.js'

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
  'tree': {
    description: 'list directories in a tree-like format.',
    fn: async ({ stdout }) => {
      const res = await fetch('/api/pinned')
      const repositories = await res.json()

      let tree = createTree({
        name: '<span class="blue">projects</span>',
        children: repositories.map(({ repo, description, stars, forks, link }) => ({
          name: `<span class="blue">${repo}</span>`,
          children: [
            { name: `description: ${description}` },
            { name: `stars: ${stars}` },
            { name: `forks: ${forks}` },
            { name: `link: ${link}` }
          ]
        }))
      })

      tree += `\n${repositories.length + 1} directories, ${repositories.length * 4} files`

      stdout(tree)
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
    description: 'print given arguments.',
    fn: ({ stdout, args }) => {
      stdout(args)
    }
  },
  'figlet': {
    description: 'generate ascii art/banners.',
    fn: ({ stdout, args }) => {
      figlet(args, function(err, data) {
        if (err) return stdout('Error: Something went wrong...')

        stdout(data ?? '')
      })
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
