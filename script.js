window.addEventListener('load', function () {
  const app = new Vue({
    el: '#app',
    data: {
      searchString: '',
      message: '',
      accepted: null,
      synonyms: []
    },
    methods: {
      search: function () {
        const query = `species/match?name=${this.searchString.replaceAll(/\W+/g, '%20')}`
        const data = this.fetchData(query)

        if (data.matchType === 'NONE') {
          this.message = data.note
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
      fetchData: function (query) {
        const gbifApiUrl = 'http://api.gbif.org/v1/'
        const url = `${gbifApiUrl}${query}`

        var xhr = new XMLHttpRequest()
        xhr.open('GET', url, false)
        xhr.setRequestHeader('origin', 'http://acceptedNamesTool.de')
        xhr.send(null)
        return JSON.parse(xhr.responseText)
      }
    }
  })
})
