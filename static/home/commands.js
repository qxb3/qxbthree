import { uptime, neofetch } from '/static/home/utils.js'

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
    fn: ({ stdout }) => {
      function createTree(dir) {
        let tree = ''

        function nest(node, level = 0, isLast = false, prefix = '') {
          const currentPrefix = prefix + (level === 0 ? '└── ' : (isLast ? '└── ' : '├── '));
          const nextPrefix = prefix + (level === 0 ? '    ' : (isLast ? '    ' : '│   '));

          tree += `${currentPrefix}${node.name}\n`

          if (node.children && node.children.length > 0) {
            for (let i = 0; i < node.children.length - 1; i++) {
              nest(node.children[i], level + 1, false, nextPrefix);
            }
            if (node.children.length >= 1) {
              nest(node.children[node.children.length - 1], level + 1, true, nextPrefix);
            }
          }
        }

        nest(dir)

        return tree
      }

      let tree = createTree({
        name: '<span class="blue">projects</span>',
        children: [
          {
            name: '<span class="blue">gruvbox.hypr</span>',
            children: [
              { name: 'description: Gruvbox in hyprland' },
              { name: 'stars: 139' },
              { name: 'forks: 7' },
              { name: 'link: https://github.com/qxb3/gruvbox.hypr' }
            ]
          },
          {
            name: '<span class="blue">termux-bot</span>',
            children: [
              { name: 'description: A simple discord bot that can execute commands to your termux.' },
              { name: 'stars: 16' },
              { name: 'forks: 2' },
              { name: 'link: https://github.com/qxb3/termux-bot' }
            ]
          },
          {
            name: '<span class="blue">eiv</span>',
            children: [
              { name: 'description: A simple script to get eruda working with via browser' },
              { name: 'stars: 7' },
              { name: 'forks: 0' },
              { name: 'link: https://github.com/qxb3/eiv' }
            ]
          },
          {
            name: '<span class="blue">TopDownShooter</span>',
            children: [
              { name: 'description: A TopDownShooter made using libgdx and Ashley' },
              { name: 'stars: 4' },
              { name: 'forks: 0' },
              { name: 'link: https://github.com/qxb3/TopDownShooter' }
            ]
          },
          {
            name: '<span class="blue">mirage-helper</span>',
            children: [
              { name: 'description: 🤖 A simple discord bot for mirage realms' },
              { name: 'stars: 2' },
              { name: 'forks: 0' },
              { name: 'link: https://github.com/qxb3/mirage-helper' }
            ]
          },
          {
            name: '<span class="blue">preon</span>',
            children: [
              { name: 'description: A free and open source url shortener' },
              { name: 'stars: 1' },
              { name: 'forks: 0' },
              { name: 'link: https://github.com/qxb3/preon' }
            ]
          },
        ]
      })

      tree += `\n7 directories, 28 files`

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
