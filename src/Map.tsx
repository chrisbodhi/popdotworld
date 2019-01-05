import React, { Component } from "react"
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
} from "react-simple-maps";
import { scaleLinear } from "d3-scale";

import geo from "./static/world-50m-with-population.json";

const wrapperStyles = {
  width: "100%",
  maxWidth: 980,
  margin: "0 auto",
}

const popScale = scaleLinear()
  .domain([0,100000000,1400000000])
  .range(["#CFD8DC", "#607D8B", "#37474F"] as any[])

export class Map extends Component {
  handleClick = (geo: any) => {
    console.log(geo.properties.formal_en);
  }

  render() {
    return (
      <div style={wrapperStyles}>
        <ComposableMap
          projection="mercator"
          projectionConfig={{
            scale: 175,
            rotation: [-11,0,0],
          }}
          width={1440}
          height={899}
          style={{
            width: "100%",
            height: "auto",
          }}
          >
          <ZoomableGroup center={[0,20]}>
            <Geographies geography={geo}>
              {(geographies: any, projection: any) => geographies.map((geography: any, i: number) => (
                <Geography
                  key={ i }
                  geography={ geography }
                  projection={ projection }
                  onClick={this.handleClick}
                  style={{
                    default: {
                      fill: popScale(geography.properties.pop_est),
                      stroke: "#607D8B",
                      strokeWidth: 0.75,
                      outline: "none",
                    },
                    hover: {
                      fill: "#263238",
                      stroke: "#607D8B",
                      strokeWidth: 0.75,
                      outline: "none",
                    },
                    pressed: {
                      fill: "#263238",
                      stroke: "#607D8B",
                      strokeWidth: 0.75,
                      outline: "none",
                    }
                  }}
                />
              ))}
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
      </div>
    )
  }
}

export default Map;
