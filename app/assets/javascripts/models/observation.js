define([
  'model',
  'requests/observations_for_date',
  'models/clock',
  'env',
  'core_extensions/date',
  'core_extensions/number'
], function (model, observationsForDate, clock, ENV) {
  return model('observations', function () {
    var self = this

    var dateIndex = new model.Indexer(this.collection, 'date')

    var initAndAddToCollection = function (attrs) {
      self.collection.add(new self (attrs))
    }

    var dateAsPercentage = function (date) {
      var daysAgo = ENV.endDate.daysBetween(date)
      return ((ENV.duration + 0) - daysAgo) / ENV.duration
    }

    this.load = function (date) {
      var date = (date || ENV.startDate).beginningOfDay()

      return observationsForDate(date)
        .then(function (data) {
          data.forEachWait(initAndAddToCollection)
        })
        .then(this.emit.bind(this, 'loaded', dateAsPercentage(date)))
        .then(this.loadNext.bind(this, date))
    }

    this.loadNext = function (date) {
      var nextDay = date.nextDay()

      if (nextDay.isToday()) return

      setTimeout(this.load.bind(this, nextDay), 1200)
    }

    this.findByDate = function (date) {
      return dateIndex.get(date)
    }

    this.averageForDate = function (date) {
      var temperatureSum = this.findByDate(date)
        .map(function (observation) { return observation.get('temperature') })
        .reduce(function (total, n) { return total + n }, 0)

      return temperatureSum /  this.findByDate(date).length
    }

    this.findByDateAndSelect = function (date) {
      this.findByDate(date).forEach(function (observation) {
        observation.select()
      })
    }

    clock.on('tick', this.findByDateAndSelect, this)

    clock.on('tick', function (date) {
      var hoursTicked = ENV.startDate.hoursBetween(date),
          totalHours = ENV.startDate.hoursBetween(ENV.endDate),
          hoursAsPercentage = hoursTicked / totalHours

      this.emit('played', hoursAsPercentage)
    }, this)

    this.prototype.initialize = function () {
      this.set('date', new Date(Date.parse(this.get('date'))))
    }

    this.prototype.select = function () {
      this.set('selected', true)
      this.emit('selected')
    }

    this.prototype.isForDate = function (date) {
      var d = this.get('date')

      return d.getFullYear() == date.getFullYear() &&
             d.getMonth() == date.getMonth() &&
             d.getDate() == date.getDate() &&
             d.getHours() == date.getHours()
    }
  })
})
