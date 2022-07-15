using CSV
using DataFrames

include("systemLibrary.jl")

print("Enter the matches quantity: ")
matchesQuantity = parse(Int, readline())

teamsCsv = CSV.read("../Data/Teams.csv", DataFrame)
goldCsv = CSV.read("../Data/Gold.csv", DataFrame)
towersCsv = CSV.read("../Data/Towers.csv", DataFrame)
killsCsv = CSV.read("../Data/Kills.csv", DataFrame)
dragonsCsv = CSV.read("../Data/Dragons.csv", DataFrame)
baronsCsv = CSV.read("../Data/Barons.csv", DataFrame)
csCsv = CSV.read("../Data/Cs.csv", DataFrame)

c = runSystem(matchesQuantity, goldCsv, teamsCsv)[1]
print("\nGold\n")
print("$(classifyTeams(c))\n")

c = runSystem(matchesQuantity, towersCsv, teamsCsv)[1]
print("\nTowers\n")
print("$(classifyTeams(c))\n")

c = runSystem(matchesQuantity, killsCsv, teamsCsv)[1]
print("\nKills\n")
print("$(classifyTeams(c))\n")

c = runSystem(matchesQuantity, dragonsCsv, teamsCsv)[1]
print("\nDragons\n")
print("$(classifyTeams(c))\n")

c = runSystem(matchesQuantity, baronsCsv, teamsCsv)[1]
print("\nBarons\n")
print("$(classifyTeams(c))\n")

c = runSystem(matchesQuantity, csCsv, teamsCsv)[1]
print("\nCs\n")
print("$(classifyTeams(c))\n")
