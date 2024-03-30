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
        im currently 18 yrs old living in the place called philippines.
        i have no life and i just code for fun. :)
      `)
    }
  },
  'stack': {
    description: 'some stuff i know',
    fn: ({ stdout, dedent }) => {
      stdout(dedent`
        <strong>programming languages:</strong>
        - javascript / typescript
        - java
        - python
        - bash
        - c/c++
        <strong>- rust</strong>

        <strong>web:</strong>
        - nodejs
        - react/nextjs
        - sveltejs
        - html/css

        <strong>tools/utils:</strong>
        - git
        - linux (arch btw)
        - docker
        - vim/neovim
      `)
    }
  },
  'contacts': {
    description: 'get my contacts',
    fn: ({ stdout, dedent }) => {
      stdout(dedent`
        email: <a href="mailto:qxbthree@gmail.com" target="_blank">qxbthree@gmail.com</a>
        github: <a href="https://github.com/qxb3" target="_blank">https://github.com/qxb3</a>
        discord: <a href="https://discord.com/users/591150858830479381" target="_blank">https://discord.com/users/591150858830479381</a>
        facebook: <a href="https://www.facebook.com/qxbthree" target="_blank">https://www.facebook.com/qxbthree</a>
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
      const theme = document.body.getAttribute('theme') === 'light' ? 'dark' : 'light'

      document.body.setAttribute('theme', theme)
      localStorage.setItem('theme', theme)

      stdout(`Changed theme to ${theme}`)
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
  'why-is-rust-highlighted-in-stack-command': {
    description: 'why?',
    fn: ({ stdout }) => {
      stdout('yes.')
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
