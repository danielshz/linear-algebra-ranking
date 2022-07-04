const axios = require('axios');
const cheerio = require('cheerio');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const teamListURL = 'https://lol.fandom.com/wiki/LPL/2021_Season/Spring_Season';

async function getTeamList(url) {
  const responseTeamList = await axios.get(url);
  const teamListHtml = responseTeamList.data;
  
  const $ = cheerio.load(teamListHtml);

  const teamList = [];

  $('span.teamname > a').each((index, element) => teamList.push({
    rank: index + 1,
    name: $(element).text()
  }));

  csvWriter = createCsvWriter({
    path: `${__dirname}/../Dados/Teams.csv`,
    header: [
      { id: 'name', title: 'Name' },
      { id: 'rank', title: 'Rank' },
    ],
    fieldDelimiter: ';'
  });

  csvWriter
  .writeRecords(teamList)
  .then(()=> console.log('The CSV file was written successfully'));

  let scoreboardURL = '';

  $('div.tabheader-content > a').each((index, element) => {
    if($(element).text().includes('Scoreboards'))
      scoreboardURL = 'https://lol.fandom.com' + $(element).attr('href');
  });

  return scoreboardURL;
}

async function getWeeksURL(url) {
  const response = await axios.get(url);
  const scoreboardHtml = response.data;
  
  const $ = cheerio.load(scoreboardHtml);

  const weeks = [url];

  $('div.tabheader-top > div.tabheader-tab div a').each((index, element) => {
    if($(element).attr('href').includes('Scoreboards'))
      weeks.push('https://lol.fandom.com' + $(element).attr('href'));
  });

  await getMatches(weeks[0]);

  return weeks;
}

async function getMatches(week) {
  const response = await axios.get(week);
  const weekMatches = response.data;
  
  const $ = cheerio.load(weekMatches);

  const matchData = [];
  const teamNames = [];
  const teamGold = [];
  const teamKills = [];
  const teamCs = [];
  const teamTowers = [];
  const teamBarons = [];
  const teamDragons = [];

  const matchesQuantity = $('table.sb').length;

  $('table.sb th.sb-teamname').each((index, element) => teamNames.push($(element).text()));
  $('table.sb div.sb-header-Gold').each((index, element) => teamGold.push(parseFloat($(element).text().replace(/[a-zA-Z\s]*$/, '').trim())));
  $('table.sb div.sb-header-Kills').each((index, element) => teamKills.push(parseInt($(element).text().trim())));
  $('table.sb div.sb-p-stat-cs').each((index, element) => teamCs.push(parseInt($(element).text())));
  $('table.sb div[title=Towers]').each((index, element) => teamTowers.push(parseInt($(element).text().trim())));
  $('table.sb div[title=Barons]').each((index, element) => teamBarons.push(parseInt($(element).text().trim())));
  $('table.sb div[title=Dragons]').each((index, element) => teamDragons.push(parseInt($(element).text().trim())));

  for(let i = 0; i < matchesQuantity; i++) {
    matchData.push({
      team1: teamNames[2 * i],
      team2: teamNames[2 * i + 1],
      gold1: teamGold[2 * i],
      gold2: teamGold[2 * i + 1],
      kills1: teamKills[2 * i],
      kills2: teamKills[2 * i + 1],
      cs1: teamCs.slice(5 * i, 5 * (i + 1)).reduce((previousCS, currentCS) => previousCS + currentCS),
      cs2: teamCs.slice(5 * (i + 1), 5 * (i + 2)).reduce((previousCS, currentCS) => previousCS + currentCS),
      towers1: teamTowers[2 * i],
      towers2: teamTowers[2 * i + 1],
      barons1: teamBarons[2 * i],
      barons2: teamBarons[2 * i + 1],
      dragons1: teamDragons[2 * i],
      dragons2: teamDragons[2 * i + 1],
    });
  }

  console.log(matchData[0]);
}

getTeamList(teamListURL).then((scoreboardURL)=> getWeeksURL(scoreboardURL));