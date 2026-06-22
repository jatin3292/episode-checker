const https = require('https');
const fs = require('fs');

https.get('https://api.github.com/repos/jatin3292/episode-checker/actions/runs', {
  headers: { 'User-Agent': 'Node.js' }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    fs.writeFileSync('gh-runs.json', data);
    console.log('done');
  });
}).on('error', err => {
  console.log('Error: ', err.message);
});
