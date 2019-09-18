function isMatureContent(content, cb) {
  return fetch('https://neutrinoapi-bad-word-filter.p.rapidapi.com/bad-word-filter', {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json',
      'X-RapidAPI-Host': 'neutrinoapi-bad-word-filter.p.rapidapi.com',
      'X-RapidAPI-Key': '5d210b55a2mshe71e782f635fa5ep175b93jsn5171ac9439b8'
    }),
    body: JSON.stringify({ content })
  })
  .then(res => res.json())
  .then(res => {
    if(res['bad-word-count']) cb();
  })
}

module.exports = isMatureContent