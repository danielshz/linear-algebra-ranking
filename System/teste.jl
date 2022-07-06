using LinearAlgebra
using CSV
using DataFrames

A = [0 0 0 1 -1; 1 0 0 -1 0; -1 1 0 0 0; 0 1 0 -1 0; 0 1 -1 0 0]

b = [7; 10; 5; 15; 3]

# A = [1 0; 1 -2]; B = [32; -4];

# X = A \ b

df = CSV.read("../Data/Gold.csv", DataFrame)
print(df[1,:])

# print(X)