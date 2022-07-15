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
  dataframe = CSV.read(path, DataFrame)

  count = 0
  matchQuantity, _ = size(dataframe)

  for i in 1:matchQuantity
    if dataframe[i, 3] == dataframe[i, 1] && dataframe[i, column] > 0
      count += 1
    elseif dataframe[i, 3] == dataframe[i, 2] && dataframe[i, column] < 0
      count += 1
    end
  end

  return count / matchQuantity * 100
end

function readRunSystem(path, matchQuantity)
  dataframe = CSV.read(path, DataFrame)
  teams = CSV.read("../Data/Teams.csv", DataFrame)
  teamsQuantity, _ = size(teams)

  A = zeros(matchQuantity, teamsQuantity)
  b = zeros(matchQuantity, 1)

  for i in 1:matchQuantity
    A[i, dataframe[i, 1]] = 1
    A[i, dataframe[i, 3]] = -1
    b[i, 1] = dataframe[i, 2]
  end

  try
    x = A \ b
    return x
  catch e
    zeroRow = zeros(1, teamsQuantity)
    zeroRow[1] = 1
    A = [A; zeroRow]
    b = [b; 1]

    x = A \ b
    return x
  end 
end

function runSystem(matchQuantity, dataframe, teams)
  teamsQuantity, _ = size(teams)

  A = zeros(matchQuantity, teamsQuantity)
  b = zeros(matchQuantity, 1)

  for i in 1:matchQuantity
    A[i, dataframe[i, 1]] = 1
    A[i, dataframe[i, 3]] = -1
    b[i, 1] = dataframe[i, 2]
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

    return (x, A, b)
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

function getNthPlace(matchesLimit, place, dataframe, teamsDf)
  nthPlace = []

  for i in 1:div(nrow(dataframe), matchesLimit)
    c = runSystem(i * matchesLimit, dataframe, teamsDf)[1]
    ranking = classifyTeams(c)
    push!(nthPlace, ranking[place][1])
  end

  return nthPlace
end

function calculateError(matchesLimit, place, dataframe, teamsDf)
  absoluteError = []
  relativeError = []

  for i in 1:div(nrow(dataframe), matchesLimit)
    x, A, b = runSystem(i * matchesLimit, dataframe, teamsDf)
    p = A * x

    push!(absoluteError, dist(p, b))
    push!(relativeError, cos(p, b))
  end

  return absoluteError, relativeError
end

function magnitude(x)
  tam = x'x
  return sqrt(tam)
end

function dist(x, y)
  return sqrt((x-y)'*(x-y))[1]
end

function cos(x, y)
  return (x'*y / (magnitude(x) * magnitude(y)))[1]
end

teamsCsv = CSV.read("../Data/Teams.csv", DataFrame)
goldCsv = CSV.read("../Data/Gold.csv", DataFrame)
towersCsv = CSV.read("../Data/Towers.csv", DataFrame)
killsCsv = CSV.read("../Data/Kills.csv", DataFrame)
dragonsCSv = CSV.read("../Data/Dragons.csv", DataFrame)
baronsCSv = CSV.read("../Data/Barons.csv", DataFrame)
csCSv = CSV.read("../Data/Cs.csv", DataFrame)

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

# c = readRunSystem("../Data/Towers.csv", 90)
# print(classifyTeams(c))

# c = readRunSystem("../Data/Kills.csv", 90)
# print(classifyTeams(c))

# c = readRunSystem("../Data/Dragons.csv", 90)
# print(classifyTeams(c))

# c = readRunSystem("../Data/Barons.csv", 90)
# print(classifyTeams(c))

# firstPlace = getNthPlace(5, 1, goldCsv, teamsCsv)
# lastPlace = getNthPlace(5, 10, goldCsv, teamsCsv)

# firstPlace = getNthPlace(5, 1, towersCsv, teamsCsv)
# lastPlace = getNthPlace(5, 10, towersCsv, teamsCsv)

# firstPlace = getNthPlace(5, 1, killsCsv, teamsCsv)
# lastPlace = getNthPlace(5, 10, killsCsv, teamsCsv)

# firstPlace = getNthPlace(5, 1, dragonsCSv, teamsCsv)
# lastPlace = getNthPlace(5, 10, dragonsCSv, teamsCsv)

# firstPlace = getNthPlace(5, 1, baronsCSv, teamsCsv)
# lastPlace = getNthPlace(5, 10, baronsCSv, teamsCsv)

# absolute, relative = calculateError(5, 1, goldCsv, teamsCsv)
# absolute, relative = calculateError(5, 1, towersCsv, teamsCsv)
# absolute, relative = calculateError(5, 1, killsCsv, teamsCsv)