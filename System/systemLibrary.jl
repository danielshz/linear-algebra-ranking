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