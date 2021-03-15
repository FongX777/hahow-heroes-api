async function callForHeroes({heroSourceApi}) {
  const { data: heroes } = await heroSourceApi.requestHeroes();
  return {heroes};
}


module.exports = {callForHeroes};
