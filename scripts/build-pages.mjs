import fs from 'node:fs';
import path from 'node:path';

const base = (process.env.PAGES_BASE_PATH || '/cozybed-home').replace(/\/$/, '');
if (base && !/^\/[a-zA-Z0-9_/-]+$/.test(base)) throw new Error('Invalid Pages base path');
const source = path.resolve('dist');
const output = path.resolve(process.env.PAGES_OUTPUT || '_site');
if (output === source || output.startsWith(source + path.sep)) throw new Error('Output must be separate from dist');
fs.mkdirSync(output, { recursive: true });
fs.cpSync(source, output, { recursive: true });
function walk(dir) {
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, item.name);
    if (item.isDirectory()) walk(file);
    else if (/\.(html|js|css)$/.test(item.name)) {
      const original = fs.readFileSync(file, 'utf8');
      // Prefix root-relative URLs, including JS '/' + localImage expressions.
      // Leave relative assets, external URLs and protocol-relative URLs untouched.
      const adapted = original.replace(/(["'`])\/(?!\/)(?=[a-zA-Z#?]|["'`])/g, '$1' + base + '/');
      fs.writeFileSync(file, adapted);
    }
  }
}
walk(output);
fs.writeFileSync(path.join(output, '.nojekyll'), '');
console.log(`Pages artifact ready at ${output}, base path ${base || '/'}`);
