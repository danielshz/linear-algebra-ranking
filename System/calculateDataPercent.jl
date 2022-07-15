using CSV
using DataFrames

function calculateDataVictoryPercent(column, dataframe)
  count = 0
  matchQuantity, _ = size(dataframe)

  for i in 1:matchQuantity
    if dataframe[i, 3] == dataframe[i, 1] && dataframe[i, column] > 0 || dataframe[i, 3] == dataframe[i, 2] && dataframe[i, column] < 0
      count += 1
    end
  end

  return count / matchQuantity * 100
end

matchesDiff = CSV.read("../Data/MatchesDiff.csv", DataFrame)

gold = calculateDataVictoryPercent(4, matchesDiff)
kills = calculateDataVictoryPercent(5, matchesDiff)
cs = calculateDataVictoryPercent(6, matchesDiff)
tower = calculateDataVictoryPercent(7, matchesDiff)
baron = calculateDataVictoryPercent(8, matchesDiff)
dragon = calculateDataVictoryPercent(9, matchesDiff)

print("Gold: $(gold)\n")
print("Kills: $(kills)\n")
print("CS: $(cs)\n")
print("Tower: $(tower)\n")
print("Baron: $(baron)\n")
print("Dragon: $(dragon)\n")