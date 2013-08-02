define(['jquery', 'color_scale'], function ($, colorScale) {
  $.fn.temperatureRange = function (temp) {
    if (isNaN(temp)) return this

    var temperature = Math.floor(temp),
        top = (35 - temperature) / 45 * 100 + '%',
        temperatureColor = colorScale(temperature)

    this
      .css('top', top)
      .find('.temperature')
        .css('background-color', temperatureColor)
        .find('p')
          .html(temperature)

    return this
  }
})
