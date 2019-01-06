import React, { Component } from "react"
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import { scaleLinear } from "d3-scale";

import geo from "./static/world-50m-with-population.json";

const popScale = scaleLinear()
  .domain([0, 100000000, 1400000000])
  .range(["#CFD8DC", "#607D8B", "#37474F"] as any[])

interface Props {
  center: number[];
  handleClick: (geo: any) => void;
  selected: string;
  zoom: number;
}

export class Map extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  shouldComponentUpdate(nextProps: Props): boolean {
    return this.props.center !== nextProps.center
     || this.props.selected !== nextProps.selected
     || this.props.zoom !== nextProps.zoom
  }

  render() {
    const { center, handleClick, selected, zoom } = this.props;
    if (selected.length) { console.log("selected", selected); }
    return (
      <ComposableMap
        projection="miller"
        projectionConfig={{
          scale: 175,
          rotation: [-11,0,0],
        }}
        width={1440}
        height={780}
        style={{
          width: "100%",
          height: "auto",
        }}
        >
        <ZoomableGroup center={center} zoom={zoom}>
          <Geographies geography={geo}>
            {(geographies: any, projection: any) => geographies.map((geography: any, i: number) => {
              const isSelected: boolean = selected.length ? selected === geography.properties.formal_en : false;
              if (selected.length) { console.log("selected in Geos", selected); }
              console.log("geography.properties.formal_en", geography.properties.formal_en);
              return (
                <Geography
                  key={i}
                  geography={geography}
                  projection={projection}
                  onClick={handleClick}
                  style={{
                    default: {
                      fill: popScale(geography.properties.pop_est),
                      stroke: isSelected ? "#FFFF00" : "#607D8B",
                      strokeWidth: 0.75,
                      outline: "none",
                    },
                    hover: {
                      cursor: "pointer",
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
              )
            })}
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
    );
  }
}

export default Map;
