require('dotenv').config();

const axios = require('axios');
const cheerio = require('cheerio');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

async function searchTeamList(url) {
  const responseTeamList = await axios.get(url);
  const teamListHtml = responseTeamList.data;
  
  const $ = cheerio.load(teamListHtml);
  
  const teamList = [];
  
  $('td.standings-team span.team span.teamimage-right > a').each((i, element) => teamList.push({
    rank: i + 1,
    name: $(element).attr('title')
  }));

  const header = [
    { id: 'name', title: 'Name' },
    { id: 'rank', title: 'Rank' },
  ];

  const path = `${__dirname}${process.env.PATH_TEAMS}`;

  csvWriter = createCsvWriter({
    path,
    header,
    fieldDelimiter: ';'
  });

  await csvWriter.writeRecords(teamList);
  
  let scoreboardURL = '';
  
  $('div.tabheader-content > a').each((i, element) => {
    if($(element).text().includes('Scoreboards'))
    scoreboardURL = process.env.ROOT_PAGE + $(element).attr('href');
  });
  
  return [teamList, scoreboardURL];
}

async function searchWeeksURL(url) {
  const response = await axios.get(url);
  const scoreboardHtml = response.data;
  
  const $ = cheerio.load(scoreboardHtml);
  
  const weeks = [url];

  $('div.tabheader-top > div.tabheader-tab div a').each((index, element) => {
    if($(element).attr('href').includes('Scoreboards'))
    weeks.push(process.env.ROOT_PAGE + $(element).attr('href'));
  });

  return weeks;
}

async function searchMatches(week, teamArray) {
  const response = await axios.get(week);
  const weekMatches = response.data;
  
  const $ = cheerio.load(weekMatches);
  
  const matchesQuantity = $('table.sb').length;
  
  const teamNames = [];
  const teamGold = [];
  const teamKills = [];
  const teamCs = [];
  const teamTowers = [];
  const teamBarons = [];
  const teamDragons = [];  
  
  $('table.sb th.sb-teamname span.teamname > a').each((i, element) => teamNames.push($(element).attr('title')));
  $('table.sb div.sb-header-Gold').each((i, element) => teamGold.push(parseFloat($(element).text().replace(/[a-zA-Z\s]*$/, '').trim())));
  $('table.sb div.sb-header-Kills').each((i, element) => teamKills.push(parseInt($(element).text().trim())));
  $('table.sb div.sb-p-stat-cs').each((i, element) => teamCs.push(parseInt($(element).text())));
  $('table.sb div[title=Towers]').each((i, element) => teamTowers.push(parseInt($(element).text().trim())));
  $('table.sb div[title=Barons]').each((i, element) => teamBarons.push(parseInt($(element).text().trim())));
  $('table.sb div[title=Dragons]').each((i, element) => teamDragons.push(parseInt($(element).text().trim())));
  
  const matchDataToSystem = {
    gold: [],
    kills: [],
    cs: [],
    towers: [],
    barons: [],
    dragons: [],
  };
  
  for(let i = 0; i < matchesQuantity; i++) {
    matchDataToSystem.gold.push({
      team1: teamArray[teamNames[2 * i]],
      team2: teamArray[teamNames[2 * i + 1]],
      gold: teamGold[2 * i] - teamGold[2 * i + 1],
    });
    
    matchDataToSystem.kills.push({
      team1: teamArray[teamNames[2 * i]],
      team2: teamArray[teamNames[2 * i + 1]],
      kills: teamKills[2 * i] - teamKills[2 * i + 1],
    });
    
    matchDataToSystem.cs.push({
      team1: teamArray[teamNames[2 * i]],
      team2: teamArray[teamNames[2 * i + 1]],
      cs: teamCs.slice(5 * i, 5 * (i + 1))
      .reduce((previousCS, currentCS) => previousCS + currentCS) - teamCs.slice(5 * (i + 1), 5 * (i + 2))
      .reduce((previousCS, currentCS) => previousCS + currentCS),
    });
    
    matchDataToSystem.towers.push({
      team1: teamArray[teamNames[2 * i]],
      team2: teamArray[teamNames[2 * i + 1]],
      towers: teamTowers[2 * i] - teamTowers[2 * i + 1],
    });
    
    matchDataToSystem.barons.push({
      team1: teamArray[teamNames[2 * i]],
      team2: teamArray[teamNames[2 * i + 1]],
      barons: teamBarons[2 * i] - teamBarons[2 * i + 1],
    });
    
    matchDataToSystem.dragons.push({
      team1: teamArray[teamNames[2 * i]],
      team2: teamArray[teamNames[2 * i + 1]],
      dragons: teamDragons[2 * i] - teamDragons[2 * i + 1],
    });
  }

  return matchDataToSystem;
}

async function searchChampionship(teamListURL) {
  const [teamList, scoreboardURL] = await searchTeamList(teamListURL);
  
  const weeksURL = await searchWeeksURL(scoreboardURL);

  const teamArray = [];
  
  const paths = {
    gold: `${__dirname}${process.env.PATH_GOLD}`,
    kills: `${__dirname}${process.env.PATH_KILLS}`,
    cs: `${__dirname}${process.env.PATH_CS}`,
    towers: `${__dirname}${process.env.PATH_TOWERS}`,
    barons: `${__dirname}${process.env.PATH_BARONS}`,
    dragons: `${__dirname}${process.env.PATH_DRAGONS}`,
  }
  
  const headers = {
    gold: [
      { id: 'team1', title: 'Team1' },
      { id: 'gold', title: 'Gold' },
      { id: 'team2', title: 'Team2' },
    ],
    kills: [
      { id: 'team1', title: 'Team1' },
      { id: 'kills', title: 'Kills' },
      { id: 'team2', title: 'Team2' },
    ],
    cs: [
      { id: 'team1', title: 'Team1' },
      { id: 'cs', title: 'Cs' },
      { id: 'team2', title: 'Team2' },
    ],
    towers: [
      { id: 'team1', title: 'Team1' },
      { id: 'towers', title: 'Towers' },
      { id: 'team2', title: 'Team2' },
    ],
    barons: [
      { id: 'team1', title: 'Team1' },
      { id: 'barons', title: 'Barons' },
      { id: 'team2', title: 'Team2' },
    ],
    dragons: [
      { id: 'team1', title: 'Team1' },
      { id: 'dragons', title: 'Dragons' },
      { id: 'team2', title: 'Team2' },
    ],
  };
  
  const csvWritters = {
    gold: createCsvWriter({
      path: paths.gold,
      header: headers.gold,
      fieldDelimiter: ';'
    }),
    kills: createCsvWriter({
      path: paths.kills,
      header: headers.kills,
      fieldDelimiter: ';'
    }),
    cs: createCsvWriter({
      path: paths.cs,
      header: headers.cs,
      fieldDelimiter: ';'
    }),
    towers: createCsvWriter({
      path: paths.towers,
      header: headers.towers,
      fieldDelimiter: ';'
    }),
    barons: createCsvWriter({
      path: paths.barons,
      header: headers.barons,
      fieldDelimiter: ';'
    }),
    dragons: createCsvWriter({
      path: paths.dragons,
      header: headers.dragons,
      fieldDelimiter: ';'
    }),
  };
  
  teamList.forEach(({ name, rank }) => teamArray[name] = rank);

  for (const week of weeksURL) {
    const { gold, kills, cs, towers, barons, dragons } = await searchMatches(week, teamArray);
  
    await csvWritters.gold.writeRecords(gold);
    await csvWritters.kills.writeRecords(kills);
    await csvWritters.cs.writeRecords(cs);
    await csvWritters.towers.writeRecords(towers);
    await csvWritters.barons.writeRecords(barons);
    await csvWritters.dragons.writeRecords(dragons);
  }

  // weeksURL.forEach(async (week) => {
  //   const { gold, kills, cs, towers, barons, dragons } = await searchMatches(week, teamArray);

  //   await csvWritters.gold.writeRecords(gold);
  //   await csvWritters.kills.writeRecords(kills);
  //   await csvWritters.cs.writeRecords(cs);
  //   await csvWritters.towers.writeRecords(towers);
  //   await csvWritters.barons.writeRecords(barons);
  //   await csvWritters.dragons.writeRecords(dragons);
  // });
}

const championship_page = process.env.CHAMPIONSHIP_PAGE;

searchChampionship(championship_page);

// matchData.push({
//   team1: teamArray[teamNames[2 * i]],
//   team2: teamArray[teamNames[2 * i + 1]],
//   gold1: teamGold[2 * i],
//   gold2: teamGold[2 * i + 1],
//   kills1: teamKills[2 * i],
//   kills2: teamKills[2 * i + 1],
//   cs1: teamCs.slice(5 * i, 5 * (i + 1)).reduce((previousCS, currentCS) => previousCS + currentCS),
//   cs2: teamCs.slice(5 * (i + 1), 5 * (i + 2)).reduce((previousCS, currentCS) => previousCS + currentCS),
//   towers1: teamTowers[2 * i],
//   towers2: teamTowers[2 * i + 1],
//   barons1: teamBarons[2 * i],
//   barons2: teamBarons[2 * i + 1],
//   dragons1: teamDragons[2 * i],
//   dragons2: teamDragons[2 * i + 1],
// });

// matchDataToSystem.push({
//   team1: teamArray[teamNames[2 * i]],
//   team2: teamArray[teamNames[2 * i + 1]],
//   gold: teamGold[2 * i] - teamGold[2 * i + 1],
//   kills: teamKills[2 * i] - teamKills[2 * i + 1],
//   cs: teamCs.slice(5 * i, 5 * (i + 1))
//     .reduce((previousCS, currentCS) => previousCS + currentCS) - teamCs.slice(5 * (i + 1), 5 * (i + 2))
//     .reduce((previousCS, currentCS) => previousCS + currentCS),
//   towers: teamTowers[2 * i] - teamTowers[2 * i + 1],
//   barons: teamBarons[2 * i] - teamBarons[2 * i + 1],
//   dragons: teamDragons[2 * i] - teamDragons[2 * i + 1],
// });