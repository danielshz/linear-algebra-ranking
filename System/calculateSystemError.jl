using CSV
using DataFrames

include("systemLibrary.jl")

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

print("Enter the matches per day: ")
matchesLimit = parse(Int, readline())

teamsCsv = CSV.read("../Data/Teams.csv", DataFrame)
goldCsv = CSV.read("../Data/Gold.csv", DataFrame)
towersCsv = CSV.read("../Data/Towers.csv", DataFrame)
killsCsv = CSV.read("../Data/Kills.csv", DataFrame)
dragonsCSv = CSV.read("../Data/Dragons.csv", DataFrame)
baronsCSv = CSV.read("../Data/Barons.csv", DataFrame)
csCSv = CSV.read("../Data/Cs.csv", DataFrame)

absolute, relative = calculateError(matchesLimit, 1, goldCsv, teamsCsv)
print("\nGold\n")
print("Absolute: $(absolute)\n")
print("Relative: $(relative)\n")

absolute, relative = calculateError(matchesLimit, 1, towersCsv, teamsCsv)
print("\nTowers\n")
print("Absolute: $(absolute)\n")
print("Relative: $(relative)\n")

absolute, relative = calculateError(matchesLimit, 1, killsCsv, teamsCsv)
print("\nKills\n")
print("Absolute: $(absolute)\n")
print("Relative: $(relative)\n")

absolute, relative = calculateError(matchesLimit, 1, dragonsCSv, teamsCsv)
print("\nDragons\n")
print("Absolute: $(absolute)\n")
print("Relative: $(relative)\n")

absolute, relative = calculateError(matchesLimit, 1, baronsCSv, teamsCsv)
print("\nBarons\n")
print("Absolute: $(absolute)\n")
print("Relative: $(relative)\n")

absolute, relative = calculateError(matchesLimit, 1, csCSv, teamsCsv)
print("\nCs\n")
print("Absolute: $(absolute)\n")
print("Relative: $(relative)\n")