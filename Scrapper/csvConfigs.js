const csvHeaders = {
  teams: [
    { id: 'name', title: 'Name' },
    { id: 'rank', title: 'Rank' },
  ],
  gold: [
    { id: 'blueTeam', title: 'BlueTeam' },
    { id: 'gold', title: 'Gold' },
    { id: 'redTeam', title: 'RedTeam' },
  ],
  kills: [
    { id: 'blueTeam', title: 'BlueTeam' },
    { id: 'kills', title: 'Kills' },
    { id: 'redTeam', title: 'RedTeam' },
  ],
  cs: [
    { id: 'blueTeam', title: 'BlueTeam' },
    { id: 'cs', title: 'Cs' },
    { id: 'redTeam', title: 'RedTeam' },
  ],
  towers: [
    { id: 'blueTeam', title: 'BlueTeam' },
    { id: 'towers', title: 'Towers' },
    { id: 'redTeam', title: 'RedTeam' },
  ],
  barons: [
    { id: 'blueTeam', title: 'BlueTeam' },
    { id: 'barons', title: 'Barons' },
    { id: 'redTeam', title: 'RedTeam' },
  ],
  dragons: [
    { id: 'blueTeam', title: 'BlueTeam' },
    { id: 'dragons', title: 'Dragons' },
    { id: 'redTeam', title: 'RedTeam' },
  ],
  matchesDiff: [
    { id: 'blueTeam', title: 'BlueTeam' },
    { id: 'redTeam', title: 'RedTeam' },
    { id: 'winner', title: 'Winner' },
    { id: 'gold', title: 'Gold' },
    { id: 'kills', title: 'Kills' },
    { id: 'cs', title: 'Cs' },
    { id: 'towers', title: 'Towers' },
    { id: 'barons', title: 'Barons' },
    { id: 'dragons', title: 'Dragons' },
  ],
  matches: [
    { id: 'blueTeam', title: 'BlueTeam' },
    { id: 'redTeam', title: 'RedTeam' },
    { id: 'winner', title: 'Winner' },
    { id: 'goldBlue', title: 'GoldBlue' },
    { id: 'goldRed', title: 'GoldRed' },
    { id: 'killsBlue', title: 'KillsBlue' },
    { id: 'killsRed', title: 'KillsRed' },
    { id: 'csBlue', title: 'CsBlue' },
    { id: 'csRed', title: 'CsRed' },
    { id: 'towersBlue', title: 'TowersBlue' },
    { id: 'towersRed', title: 'TowersRed' },
    { id: 'baronsBlue', title: 'BaronsBlue' },
    { id: 'baronsRed', title: 'BaronsRed' },
    { id: 'dragonsBlue', title: 'DragonsBlue' },
    { id: 'dragonsRed', title: 'DragonsRed' },
  ],
};

const csvPaths = {
  teams: `${__dirname}${process.env.PATH_TEAMS}`,
  gold: `${__dirname}${process.env.PATH_GOLD}`,
  kills: `${__dirname}${process.env.PATH_KILLS}`,
  cs: `${__dirname}${process.env.PATH_CS}`,
  towers: `${__dirname}${process.env.PATH_TOWERS}`,
  barons: `${__dirname}${process.env.PATH_BARONS}`,
  dragons: `${__dirname}${process.env.PATH_DRAGONS}`,
  matches: `${__dirname}${process.env.PATH_MATCHES}`,
  matchesDiff: `${__dirname}${process.env.PATH_MATCHES_DIFF}`,
}

module.exports = { csvHeaders, csvPaths };