using RowEchelon
using LinearAlgebra
using CSV
using DataFrames

include("systemLibrary.jl")

function getNthPlace(matchesLimit, place, dataframe, teamsDf)
  nthPlace = []

  for i in 1:div(nrow(dataframe), matchesLimit)
    c = runSystem(i * matchesLimit, dataframe, teamsDf)[1]
    ranking = classifyTeams(c)
    push!(nthPlace, ranking[place][1])
  end

  return nthPlace
end

print("Enter the matches per day: ")
matchesLimit = parse(Int, readline())

print("Enter the place: ")
place = parse(Int, readline())

teamsCsv = CSV.read("../Data/Teams.csv", DataFrame)
goldCsv = CSV.read("../Data/Gold.csv", DataFrame)
towersCsv = CSV.read("../Data/Towers.csv", DataFrame)
killsCsv = CSV.read("../Data/Kills.csv", DataFrame)
dragonsCsv = CSV.read("../Data/Dragons.csv", DataFrame)
baronsCsv = CSV.read("../Data/Barons.csv", DataFrame)
csCsv = CSV.read("../Data/Cs.csv", DataFrame)

nthPlace = getNthPlace(matchesLimit, place, goldCsv, teamsCsv)
print("\nGold\n")
print("$(nthPlace)\n")

nthPlace = getNthPlace(matchesLimit, place, towersCsv, teamsCsv)
print("\nTowers\n")
print("$(nthPlace)\n")

nthPlace = getNthPlace(matchesLimit, place, killsCsv, teamsCsv)
print("\nKills\n")
print("$(nthPlace)\n")

nthPlace = getNthPlace(matchesLimit, place, csCsv, teamsCsv)
print("\nCs\n")
print("$(nthPlace)\n")

nthPlace = getNthPlace(matchesLimit, place, dragonsCsv, teamsCsv)
print("\nDragons\n")
print("$(nthPlace)\n")

nthPlace = getNthPlace(matchesLimit, place, baronsCsv, teamsCsv)
print("\nBarons\n")
print("$(nthPlace)\n")