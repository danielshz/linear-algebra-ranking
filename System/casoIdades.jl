using RowEchelon
using LinearAlgebra
using DataFrames

A = [0 0 0 1 -1; 1 0 0 -1 0; -1 1 0 0 0; 0 1 0 -1 0; 0 1 -1 0 0; 0 0 0 0 1]
b = [7; 10; 5; 15; 3; 10]
x = A \ b

print(x)
print("\n")
print(A * x)