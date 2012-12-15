define(['model', 'requests/all_locations'], function (model, allLocations) {
  return model('location', function () {
    this.load = function () {
      var ctor = this
      var initAndAddToCollection = function (attrs) {
        ctor.collection.add(new ctor (attrs))
      }

      return allLocations()
        .then(function (data) {
          data.forEach(initAndAddToCollection)
        })
    }

    this.prototype.lnglat = function () {
      return [this.get('lng'), this.get('lat')]
    }
  })
})
