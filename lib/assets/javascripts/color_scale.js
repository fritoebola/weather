define(['d3'], function (d3) {
  return d3.scale.linear()
    .domain([-15, -3, 3, 15, 20, 30])
    .range(['#2b63d4', '#26d6d9', '#38c78e', '#94bd42', '#F2dd00', '#Ff8700'])
})
