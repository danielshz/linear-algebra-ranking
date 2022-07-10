using RowEchelon
using LinearAlgebra
using CSV
using DataFrames

function calculateDataVictoryPercent(path, column)
  df = CSV.read(path, DataFrame)

  count = 0
  matchQuantity, _ = size(df)

  for i in 1:matchQuantity
    if df[i, 3] == df[i, 1] && df[i, column] > 0
      count += 1
    elseif df[i, 3] == df[i, 2] && df[i, column] < 0
      count += 1
    end
  end

  return count / matchQuantity * 100
end

function runSystem(path, matchQuantity)
  df = CSV.read(path, DataFrame)
  teams = CSV.read("../Data/Teams.csv", DataFrame)
  teamsQuantity, _ = size(teams)

  A = zeros(matchQuantity, teamsQuantity)
  b = zeros(matchQuantity, 1)

  for i in 1:matchQuantity
    A[i, df[i, 1]] = 1
    A[i, df[i, 3]] = -1
    b[i, 1] = df[i, 2]
  end

  return A \ b
end

function classifyTeams(x)
  teamList = Tuple{Int64, Float64}[]

  for i in 1:length(x)
    push!(teamList, (i, x[i]))
  end

  teamList = sort(teamList, by=x->x[2], rev=true)
  print(teamList)
end

# gold = calculateDataVictoryPercent("../Data/MatchesDiff.csv", 4)
# kills = calculateDataVictoryPercent("../Data/MatchesDiff.csv", 5)
# cs = calculateDataVictoryPercent("../Data/MatchesDiff.csv", 6)
# tower = calculateDataVictoryPercent("../Data/MatchesDiff.csv", 7)
# baron = calculateDataVictoryPercent("../Data/MatchesDiff.csv", 8)
# dragon = calculateDataVictoryPercent("../Data/MatchesDiff.csv", 9)

# print("Gold: $(gold)\n")
# print("Kills: $(kills)\n")
# print("CS: $(cs)\n")
# print("Tower: $(tower)\n")
# print("Baron: $(baron)\n")
# print("Dragon: $(dragon)\n")

c = runSystem("../Data/Gold.csv", 90)

classifyTeams(c)

print('\n')
c = runSystem("../Data/Towers.csv", 90)
classifyTeams(c)

print('\n')
c = runSystem("../Data/Kills.csv", 90)
classifyTeams(c)

print('\n')
c = runSystem("../Data/Dragons.csv", 90)
classifyTeams(c)

print('\n')
c = runSystem("../Data/Barons.csv", 90)
classifyTeams(c)