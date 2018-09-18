import React, { Component } from "react"
import LocationName from "./LocationName"

class LocationList extends Component {

  componentWillMount() {
    this.setState({
      locations: this.props.locations
    });
  }

  constructor(props) {
    super(props)

    this.state = {
      locations: "",
      query: "",
      suggestions: true
    }

    this.filterLocations = this.filterLocations.bind(this)
  }

  // filter place based on input query
  filterLocations(event) {
    this.props.closeInfoWindow()

    const { value } = event.target

    let locations = []

    this.props.locations.forEach(function(location) {
      if (location.longname.toLowerCase().indexOf(value.toLowerCase()) >= 0) {

        location.marker.setVisible(true)

        locations.push(location)

      } else {

        location.marker.setVisible(false)

      }
    })

    this.setState(
      {
        locations: locations,
        query: value
      }
    )
  }

  render() {
    let locationList = this.state.locations.map(function(listItem, index) {
      return (
        <LocationName
          key={index}
          openInfoWindow={this.props.openInfoWindow.bind(this)}
          data={listItem}
        />
      )
    }, this)

    return (
      <div className="filter-panel">
        <input
          aria-labelledby="Input filter location"
          className="filter-input"
          onChange={this.filterLocations}
          placeholder="Filter location..."
          role="search"
          type="text"
          value={this.state.query}/>
        <ul
          aria-labelledby="list of locations"
          className="location-list">
          {this.state.suggestions && locationList}
        </ul>
      </div>
    )
  }
}

export default LocationList
