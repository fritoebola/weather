define(['ctrl', 'd3', 'projection', 'topojson'], function (ctrl, d3, projection, topojson) {
  return ctrl('mapController', function () {
    this.afterInitialize(function () {
      this.map = this.options.svg.append('svg:g').attr('class', 'uk-path')
      this.drawMap()
      this.drawClipPath()
    })

    this.include({
      drawMap: function () {
        this.map
          .append('path')
            .datum(topojson.object(this.model, this.model.objects.subunits))
            .attr('d', d3.geo.path().projection(projection))
      },

      drawClipPath: function () {
        this.options.svg
          .append('clipPath')
            .attr('id', 'uk-outline')
            .append('path')
              .datum(topojson.object(this.model, this.model.objects.subunits))
              .attr('d', d3.geo.path().projection(projection))

      }
    })
  })
})
