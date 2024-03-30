import dedent from '/static/dedent.js'

export function stdout({ history, prompt }, out) {
  history.innerHTML += `
    <div>
      <p>
        <span class="green">➜ </span>&nbsp;
        <span class="cyan">~</span>
        <span>${prompt.innerText}</span>
      </p>

      <pre>${out}</pre>
    </div>
  `
}

export async function stdoutProcess({ history, prompt, path }, process) {
  stdout({ history, prompt }, '')

  path.style.display = 'none'

  const out = await process()

  history.innerHTML += `
    <div>
      <pre>${out}</pre>
    </div>
  `

  path.style.display = 'initial'
}

export function createTree(dir) {
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

export function scrollDown() {
  document.documentElement.scrollTop = document.documentElement.scrollHeight
}

export async function uptime() {
  const res = await fetch('/api/uptime')
  const up = await res.text()

  return up
}

export async function neofetch() {
  const up = await uptime()

  const colors = [
    'bg', 'red', 'green', 'yellow',
    'blue', 'purple', 'aqua', 'grey'
  ]

  const out = dedent`
    <pre>
         _nnnn_
        dGGGGMMb     ,"""""""""""""".     <span class="green">qxb3@arch</span>
       @p~qp~~qMb    | type "help"! |     ---------
       M|@||@) M|   _;..............'     <span class="green">OS:</span> Arch Linux x86_64
       @,----.JM| -'                      <span class="green">Host:</span> qxb3
      JS^\\__/  qKL                       <span class="green">Kernel:</span> 6.7.8-arch1-1
     dZP        qKRb                      <span class="green">Uptime:</span> ${up}
    dZP          qKKb                     <span class="green">Packages:</span> 1280 (pacman)
   fZP            SMMb                    <span class="green">Shell:</span> zsh 5.9
   HZM            MMMM                    <span class="green">DE:</span> Hyprland
   FqM            MMMM                    <span class="green">Theme:</span> Gruvbox
 __| ".       |\dS"qML                    <span class="green">Terminal:</span> kitty
 |    ".      | "' \Zq                    <span class="green">Editor:</span> neovim
_)     \.___.,|     .'
\____   )MMMMMM|   .'                     ${colors.map(color => `<span class="colors-${color}">   </span>`).join('')}
     \`-'       \`--' hjm
    </pre>`

    return out
}
