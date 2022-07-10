require('dotenv').config();

const axios = require('axios');
const cheerio = require('cheerio');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const { csvHeaders, csvPaths } = require('./csvConfigs');

async function searchTeamList(url) {
  const responseTeamList = await axios.get(url);
  const teamListHtml = responseTeamList.data;
  
  const $ = cheerio.load(teamListHtml);
  
  const teamList = [];
  
  $('td.standings-team span.team span.teamimage-right > a').each((i, element) => teamList.push({
    rank: i + 1,
    name: $(element).attr('title')
  }));

  csvWriter = createCsvWriter({
    path: csvPaths.teams,
    header: csvHeaders.teams,
    fieldDelimiter: ';'
  });

  await csvWriter.writeRecords(teamList);
  
  const scoreboardURL = url + '/Scoreboards';
  
  return [teamList, scoreboardURL];
}

async function searchWeeksURL(url) {
  const response = await axios.get(url);
  const scoreboardHtml = response.data;
  
  const $ = cheerio.load(scoreboardHtml);
  
  const weeks = [url];

  $('div.tabheader-top > div.tabheader-tab:not(.tabheader-active) div a').each((i, element) => {
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
  const matchWinners = [];
  const teamGold = [];
  const teamKills = [];
  const teamCs = [];
  const teamTowers = [];
  const teamBarons = [];
  const teamDragons = [];  
  
  $('table.sb th.sb-teamname span.teamname > a').each((i, element) => teamNames.push($(element).attr('title')));
  $('table.sb tr:nth-child(2) th.side-blue').each((i, element) => matchWinners.push($(element).hasClass('sb-score-winner') && $(element).text() == 1 ? 1 : 2));
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
    matches: [],
    matchesDiff: [],
  };
  
  for(let i = 0; i < matchesQuantity; i++) {
    matchDataToSystem.gold.push({
      blueTeam: teamArray[teamNames[2 * i]],
      redTeam: teamArray[teamNames[2 * i + 1]],
      gold: teamGold[2 * i] - teamGold[2 * i + 1],
    });
    
    matchDataToSystem.kills.push({
      blueTeam: teamArray[teamNames[2 * i]],
      redTeam: teamArray[teamNames[2 * i + 1]],
      kills: teamKills[2 * i] - teamKills[2 * i + 1],
    });
    
    matchDataToSystem.cs.push({
      blueTeam: teamArray[teamNames[2 * i]],
      redTeam: teamArray[teamNames[2 * i + 1]],
      cs: teamCs.slice(5 * i, 5 * (i + 1))
      .reduce((previousCS, currentCS) => previousCS + currentCS) - teamCs.slice(5 * (i + 1), 5 * (i + 2))
      .reduce((previousCS, currentCS) => previousCS + currentCS),
    });
    
    matchDataToSystem.towers.push({
      blueTeam: teamArray[teamNames[2 * i]],
      redTeam: teamArray[teamNames[2 * i + 1]],
      towers: teamTowers[2 * i] - teamTowers[2 * i + 1],
    });
    
    matchDataToSystem.barons.push({
      blueTeam: teamArray[teamNames[2 * i]],
      redTeam: teamArray[teamNames[2 * i + 1]],
      barons: teamBarons[2 * i] - teamBarons[2 * i + 1],
    });
    
    matchDataToSystem.dragons.push({
      blueTeam: teamArray[teamNames[2 * i]],
      redTeam: teamArray[teamNames[2 * i + 1]],
      dragons: teamDragons[2 * i] - teamDragons[2 * i + 1],
    });

    matchDataToSystem.matches.push({
      blueTeam: teamArray[teamNames[2 * i]],
      redTeam: teamArray[teamNames[2 * i + 1]],
      winner: matchWinners[i] == 1 ? teamArray[teamNames[2 * i]] : teamArray[teamNames[2 * i + 1]],
      goldBlue: teamGold[2 * i],
      goldRed: teamGold[2 * i + 1],
      killsBlue: teamKills[2 * i],
      killsRed: teamKills[2 * i + 1],
      csBlue: teamCs.slice(5 * i, 5 * (i + 1)).reduce((previousCS, currentCS) => previousCS + currentCS),
      csRed: teamCs.slice(5 * (i + 1), 5 * (i + 2)).reduce((previousCS, currentCS) => previousCS + currentCS),
      towersBlue: teamTowers[2 * i],
      towersRed: teamTowers[2 * i + 1],
      baronsBlue: teamBarons[2 * i],
      baronsRed: teamBarons[2 * i + 1],
      dragonsBlue: teamDragons[2 * i],
      dragonsRed: teamDragons[2 * i + 1],
    });
    
    matchDataToSystem.matchesDiff.push({
      blueTeam: teamArray[teamNames[2 * i]],
      redTeam: teamArray[teamNames[2 * i + 1]],
      winner: matchWinners[i] == 1 ? teamArray[teamNames[2 * i]] : teamArray[teamNames[2 * i + 1]],
      gold: teamGold[2 * i] - teamGold[2 * i + 1],
      kills: teamKills[2 * i] - teamKills[2 * i + 1],
      cs: teamCs.slice(5 * i, 5 * (i + 1))
        .reduce((previousCS, currentCS) => previousCS + currentCS) - teamCs.slice(5 * (i + 1), 5 * (i + 2))
        .reduce((previousCS, currentCS) => previousCS + currentCS),
      towers: teamTowers[2 * i] - teamTowers[2 * i + 1],
      barons: teamBarons[2 * i] - teamBarons[2 * i + 1],
      dragons: teamDragons[2 * i] - teamDragons[2 * i + 1],
    });
  }

  return matchDataToSystem;
}

async function searchChampionship(teamListURL) {
  const [teamList, scoreboardURL] = await searchTeamList(teamListURL);
  
  const weeksURL = await searchWeeksURL(scoreboardURL);

  const teamArray = [];
  
  const csvWritters = {
    gold: createCsvWriter({
      path: csvPaths.gold,
      header: csvHeaders.gold,
      fieldDelimiter: ';'
    }),
    kills: createCsvWriter({
      path: csvPaths.kills,
      header: csvHeaders.kills,
      fieldDelimiter: ';'
    }),
    cs: createCsvWriter({
      path: csvPaths.cs,
      header: csvHeaders.cs,
      fieldDelimiter: ';'
    }),
    towers: createCsvWriter({
      path: csvPaths.towers,
      header: csvHeaders.towers,
      fieldDelimiter: ';'
    }),
    barons: createCsvWriter({
      path: csvPaths.barons,
      header: csvHeaders.barons,
      fieldDelimiter: ';'
    }),
    dragons: createCsvWriter({
      path: csvPaths.dragons,
      header: csvHeaders.dragons,
      fieldDelimiter: ';'
    }),
    matches: createCsvWriter({
      path: csvPaths.matches,
      header: csvHeaders.matches,
      fieldDelimiter: ';'
    }),
    matchesDiff: createCsvWriter({
      path: csvPaths.matchesDiff,
      header: csvHeaders.matchesDiff,
      fieldDelimiter: ';'
    }),
  };
  
  teamList.forEach(({ name, rank }) => teamArray[name] = rank);

  for (const week of weeksURL) {
    const { gold, kills, cs, towers, barons, dragons, matches, matchesDiff } = await searchMatches(week, teamArray);
  
    await csvWritters.gold.writeRecords(gold);
    await csvWritters.kills.writeRecords(kills);
    await csvWritters.cs.writeRecords(cs);
    await csvWritters.towers.writeRecords(towers);
    await csvWritters.barons.writeRecords(barons);
    await csvWritters.dragons.writeRecords(dragons);
    await csvWritters.matches.writeRecords(matches);
    await csvWritters.matchesDiff.writeRecords(matchesDiff);
  }
}

const championship_page = process.env.CHAMPIONSHIP_PAGE;

searchChampionship(championship_page);