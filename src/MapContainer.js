import React, { Component } from 'react'
import ReactDOM from 'react-dom'

export default class MapContainer extends Component {

    state = {
      locations: [
        {name: "Edinburgh Castle", location: {lat: 55.949468, lng: -3.200512}},
        {name: "Prince's St Garden", location: {lat: 55.949468, lng: -3.200512}},
        {name: "Holyrood Palace", location: {lat: 55.953519 , lng: -3.172272}},
        {name: "Arthur's Seat", location: {lat: 55.944347, lng: -3.207018}},
        {name: "The Bailie Bar", location: {lat: 55.957998, lng: -3.191176}},
        {name: "The Meadows", location: {lat: 55.941238, lng: -3.191176}}
      ],
      query: '',
      markers: [],
      infowindow: new this.props.google.maps.InfoWindow(),
      highlightedIcon: null
    }
  
    componentDidMount() {
      this.loadMap()
      this.onclickLocation()
      // Create a "highlighted location" marker 
      this.setState({highlightedIcon: this.makeMarkerIcon('FFFF33')})
    }
  
    loadMap() {
      if (this.props && this.props.google) {
        const {google} = this.props
        const maps = google.maps
  
        const mapRef = this.refs.map
        const node = ReactDOM.findDOMNode(mapRef)
  
        const mapConfig = Object.assign({}, {
          center: {lat: 55.9533 , lng: -3.1883},
          zoom: 14,
          mapTypeId: 'roadmap'
        })
  
        this.map = new maps.Map(node, mapConfig)
        this.addMarkers()
      }
  
    }
  
    onclickLocation = () => {
      const that = this
      const {infowindow} = this.state
  
      const displayInfowindow = (e) => {
        const {markers} = this.state
        const markerInd =
          markers.findIndex(m => m.title.toLowerCase() === e.target.innerText.toLowerCase())
        that.populateInfoWindow(markers[markerInd], infowindow)
      }
      document.querySelector('.locations-list').addEventListener('click', function (e) {
        if (e.target && e.target.nodeName === "LI") {
          displayInfowindow(e)
        }
      })
    }
  
    handleValueChange = (e) => {
      this.setState({query: e.target.value})
    }
  
    addMarkers = () => {
      const {google} = this.props
      let {infowindow} = this.state
      const bounds = new google.maps.LatLngBounds()
  
      this.state.locations.forEach((location, ind) => {
        const marker = new google.maps.Marker({
          position: {lat: location.location.lat, lng: location.location.lng},
          map: this.map,
          title: location.name
        })
  
        marker.addListener('click', () => {
          this.populateInfoWindow(marker, infowindow)
        })
        this.setState((state) => ({
          markers: [...state.markers, marker]
        }))
        bounds.extend(marker.position)
      })
      this.map.fitBounds(bounds)
    }
  
    populateInfoWindow = (marker, infowindow) => {
      const defaultIcon = marker.getIcon()
      const {highlightedIcon, markers} = this.state
      // Check to make sure the infowindow is not already opened on this marker.
      if (infowindow.marker !== marker) {
        // reset the color of previous marker
        if (infowindow.marker) {
          const ind = markers.findIndex(m => m.title === infowindow.marker.title)
          markers[ind].setIcon(defaultIcon)
        }
        // change marker icon color of clicked marker
        marker.setIcon(highlightedIcon)
        infowindow.marker = marker
        infowindow.setContent(`<h3>${marker.title}</h3>`)
        infowindow.open(this.map, marker)
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function () {
          infowindow.marker = null
        })
      }
    }
  
    makeMarkerIcon = (markerColor) => {
      const {google} = this.props
      let markerImage = new google.maps.MarkerImage(
        'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
        '|40|_|%E2%80%A2',
        new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34),
        new google.maps.Size(21, 34));
      return markerImage;
    }
  
    render() {
      const {locations, query, markers, infowindow} = this.state
      if (query) {
        locations.forEach((l, i) => {
          if (l.name.toLowerCase().includes(query.toLowerCase())) {
            markers[i].setVisible(true)
          } else {
            if (infowindow.marker === markers[i]) {
              // close the info window if marker removed
              infowindow.close()
            }
            markers[i].setVisible(false)
          }
        })
      } else {
        locations.forEach((l, i) => {
          if (markers.length && markers[i]) {
            markers[i].setVisible(true)
          }
        })
      }
      return (
        <div>
          <div className="container">
            <div className="text-input">
              <input role="search" type='text'
                     placeholder="Search Locations..."
                     value={this.state.value}
                     onChange={this.handleValueChange}/>
              <ul className="locations-list">{
                markers.filter(m => m.getVisible()).map((m, i) =>
                  (<li key={i}>{m.title}</li>))
              }</ul>
            </div>
            <div role="application" className="map" ref="map">
              loading map...
            </div>
          </div>
        </div>
      )
    }
  }

