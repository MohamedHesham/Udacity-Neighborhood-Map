import React from "react"

class LocationName extends React.Component {
  render() {
    return (
      <li
        className="location-name"
        role="button"
        onClick={this.props.openInfoWindow.bind(this, this.props.data.marker)}
        onKeyPress={this.props.openInfoWindow.bind(this, this.props.data.marker)}
        tabIndex="0">
        {this.props.data.longname}
      </li>
    )
  }
}

export default LocationName
