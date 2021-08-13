window.addEventListener('load', function () {
  const app = new Vue({
    el: '#app',
    data: {
      searchString: '',
      message: '',
      accepted: null,
      synonyms: [],
      alternatives: []
    },
    methods: {
      search: function () {
        const escapedName = this.searchString.replaceAll(/\W+/g, '%20')
        const query = `species/match?name=${escapedName}`
        const data = this.fetchData(query)

        if (data.matchType === 'NONE') {
          this.message = data.note || 'No taxon matching your query could be found.'

          this.accepted = null
          this.synonyms = []
        } else {
          this.message = ''

          if (data.status === 'ACCEPTED') {
            this.accepted = data
            this.fetchSynonyms(data.usageKey)
          } else {
            this.fetchSynonyms(data.acceptedUsageKey)
            this.fetchAccepted(data.acceptedUsageKey)
          }
        }
        this.fetchAlternatives()
      },
      fetchAccepted: function (mainID) {
        const query = `species/${mainID}`
        const data = this.fetchData(query)
        this.accepted = data
      },
      fetchSynonyms: function (mainID) {
        const query = `species/${mainID}/synonyms`
        const data = this.fetchData(query)
        this.synonyms = data.results
      },
      fetchAlternatives: function () {
        const query = `species/suggest/?q=${this.searchString.replaceAll(/\W+/g, '%20')}&rank=genus`
        const data = this.fetchData(query)
        this.alternatives = data.filter(function (taxon) {
          return taxon.rank === 'GENUS'
        })
      },
      fetchData: function (query) {
        const gbifApiUrl = 'http://api.gbif.org/v1/'
        const url = `${gbifApiUrl}${query}`

        var xhr = new XMLHttpRequest()
        xhr.open('GET', url, false)
        xhr.setRequestHeader('origin', 'http://acceptedNamesTool.de')
        xhr.send(null)
        return JSON.parse(xhr.responseText)
      },
      loadAlternative: function (alternative) {
        this.searchString = alternative.scientificName
        this.search()
      },
      getRandomPlant: function () {
        const plants = [
          'Agave filifera',
          'Frithia pulchra',
          'Adromischus cooperi',
          'Oreocereus celsianus',
          'Crassula ovata'
        ]
        return plants[Math.floor(Math.random() * plants.length)]
      }
    }
  })
})
