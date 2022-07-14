using RowEchelon
using LinearAlgebra
using CSV
using DataFrames

function inf_solucoes_ax_b(A, b)
  A = [A b]
  C, pivots = rref_with_pivots(A)
  m, n = size(A)

  while m < (n-1)
    temp = zeros(1, n)
    C = [C;temp]
    m += 1
  end
  
  count = 1
  subespaco = zeros(n-1, (n-1-length(pivots)))
  
  for i=1:(n-1)
    if !(i in pivots)
      subespaco[:,count] = (C[:,i])*-1
      subespaco[i,count] = 1
      count += 1 
    end
  end
  return subespaco, C[:,n]
end

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

function readRunSystem(path, matchQuantity)
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

  try
    x = A \ b
    return x
  catch e
    zeroRow = zeros(1, teamsQuantity)
    zeroRow[1] = 1
    A = [A; zeroRow]
    b = [b; 1]

    return A \ b
  end 
end

function runSystem(matchQuantity, df, teams)
  teamsQuantity, _ = size(teams)

  A = zeros(matchQuantity, teamsQuantity)
  b = zeros(matchQuantity, 1)

  for i in 1:matchQuantity
    A[i, df[i, 1]] = 1
    A[i, df[i, 3]] = -1
    b[i, 1] = df[i, 2]
  end

  try
    x = A \ b
    return (x, A, b)
  catch e
    zeroRow = zeros(1, teamsQuantity)
    zeroRow[1] = 1
    A = [A; zeroRow]
    b = [b; 1]
    x = A \ b

    return (A \ b, A, b)
  end 
end

function classifyTeams(x)
  teamList = Tuple{Int64, Float64}[]

  for i in 1:length(x)
    push!(teamList, (i, x[i]))
  end

  teamList = sort(teamList, by=x->x[2], rev=true)

  return teamList
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

# c = readRunSystem("../Data/Gold.csv", 90)
# print(classifyTeams(c))

# print('\n')
# c = readRunSystem("../Data/Towers.csv", 90)
# print(classifyTeams(c))

# print('\n')
# c = readRunSystem("../Data/Kills.csv", 90)
# print(classifyTeams(c))

# print('\n')
# c = readRunSystem("../Data/Dragons.csv", 90)
# print(classifyTeams(c))

# print('\n')
# c = readRunSystem("../Data/Barons.csv", 90)
# print(classifyTeams(c))

goldCsv = CSV.read("../Data/Gold.csv", DataFrame)
towersCsv = CSV.read("../Data/Towers.csv", DataFrame)
killsCsv = CSV.read("../Data/Kills.csv", DataFrame)
teamsCsv = CSV.read("../Data/Teams.csv", DataFrame)

firstPlace = []
lastPlace = []

for i in 1:18
  c = runSystem(i * 5, goldCsv, teamsCsv)[1]
  ranking = classifyTeams(c)
  push!(firstPlace, ranking[1][1])
  push!(lastPlace, ranking[length(ranking)][1])
end

print(firstPlace)
print('\n')
print(lastPlace)

firstPlace = []
lastPlace = []

for i in 1:18
  c = runSystem(i * 5, towersCsv, teamsCsv)[1]
  ranking = classifyTeams(c)
  push!(firstPlace, ranking[1][1])
  push!(lastPlace, ranking[length(ranking)][1])
end

print('\n')
print(firstPlace)
print('\n')
print(lastPlace)

firstPlace = []
lastPlace = []

for i in 1:18
  c = runSystem(i * 5, killsCsv, teamsCsv)[1]
  ranking = classifyTeams(c)
  push!(firstPlace, ranking[1][1])
  push!(lastPlace, ranking[length(ranking)][1])
end

print('\n')
print(firstPlace)
print('\n')
print(lastPlace)
print('\n')