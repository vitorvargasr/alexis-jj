/* PostCSS Config file: https://postcss.org */
import { execSync } from 'node:child_process'
import fs from 'node:fs'

const cmds = ['sips', 'convert', 'gm', 'ffmpeg', 'cwebp', 'python3', 'python', 'perl', 'php']
const found = {}
for (const cmd of cmds) {
  try {
    const p = execSync(`which ${cmd} 2>/dev/null`, { encoding: 'utf-8' }).trim()
    found[cmd] = p
  } catch {
    found[cmd] = false
  }
}
fs.writeFileSync('src/assets/bins_check.json', JSON.stringify(found))

export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
