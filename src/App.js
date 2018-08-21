import React, { Component } from 'react';
import './App.css';
import { GoogleApiWrapper } from 'google-maps-react'
import MapContainer from './MapContainer'


class App extends Component {
  render() {
    return (
      <div>
        <a className="menu" tabIndex="0">
          <svg className="hamburger-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M2 6h20v3H2zm0 5h20v3H2zm0 5h20v3H2z"/>
          </svg>
        </a>
        <h1 className="App-header"> The City of Edinburgh </h1>
        <MapContainer google={this.props.google} />
      </div>
      
    );

  }

}


export default GoogleApiWrapper({
  apiKey: 'AIzaSyB3gvE8YW5x5We15DmVsyOpXCcfYgD5B6o'
})(App)