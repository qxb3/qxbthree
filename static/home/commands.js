import figlet from '/static/figlet.js'
import { uptime, neofetch, createTree } from '/static/home/utils.js'

// Weird hack to Load fonts on startup
figlet()

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
        im currently 18 yrs old living in the place called philippines,
        i have no life and i just code for fun. :)
      `)
    }
  },
  'contacts': {
    description: 'get my contacts',
    fn: ({ stdout, dedent }) => {
      stdout(dedent`
        email: <a href="qxbthree@gmail.com">qxbthree@gmail.com</a>
        github: <a href="qxbthree@gmail.com">qxbthree@gmail.com</a>
        facebook: <a href="https://www.facebook.com/qxbthree">https://www.facebook.com/qxbthree</a>
      `)
    }
  },
  'tree': {
    description: 'list directories in a tree-like format. (projects)',
    fn: async ({ stdoutProcess }) => {
      stdoutProcess(async () => {
        const res = await fetch('/api/pinned')
        const repositories = await res.json()

        let tree = createTree({
          name: '<span class="blue">projects</span>',
          children: repositories.map(({ name, description, stars, forks, link }) => ({
            name: `<span class="blue">${name}</span>`,
            children: [
              { name: `description: ${description}` },
              { name: `stars: ${stars}` },
              { name: `forks: ${forks}` },
              { name: `link: ${link}` }
            ]
          }))
        })

        tree += `\n${repositories.length + 1} directories, ${repositories.length * 4} files`

        return tree
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
  'figlet': {
    description: 'generate ascii art/banners.',
    fn: ({ stdout, args }) => {
      figlet(args, function(err, data) {
        if (err) return stdout('Error: Something went wrong...')

        stdout(data ?? '')
      })
    }
  },
  'theme': {
    description: 'toggle terminal theme to light/dark',
    fn: ({ stdout }) => {
      const theme = document.body.getAttribute('theme')

      if (theme === 'light') document.body.setAttribute('theme', 'dark')
      if (theme === 'dark') document.body.setAttribute('theme', 'light')

      stdout(`Changed theme to ${theme === 'light' ? 'dark' : 'light'}`)
    }
  },
  'echo': {
    description: 'print given arguments.',
    fn: ({ stdout, args }) => {
      stdout(args)
    }
  },
  'uptime': {
    description: 'see system uptime.',
    fn: async ({ stdout }) => {
      const up = await uptime()
      stdout(up)
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
