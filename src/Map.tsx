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

// min from Bhutan; max from China
const co2TonScale = scaleLinear()
  .domain([8256969, 3.667])
  .range(["#407742", "#0aff12", "#94ff97"] as any[]);

interface Props {
  center: number[];
  handleClick: (geo: any) => void;
  selected: string;
  tons: number;
  zoom: number;
}

export class Map extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const { center, handleClick, selected, tons, zoom } = this.props;
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
          <Geographies geography={geo} disableOptimization>
            {(geographies: any, projection: any) => geographies.map((geography: any, i: number) => {
              const isSelected: boolean = selected.length ?
                selected === geography.properties.brk_name :
                false;

              return (
                <Geography
                  key={i}
                  geography={geography}
                  projection={projection}
                  onClick={handleClick}
                  style={{
                    default: {
                      fill: isSelected ?
                        co2TonScale(tons) :
                        popScale(geography.properties.pop_est),
                      stroke: "#607D8B",
                      strokeWidth: 0.75,
                      outline: "none",
                    },
                    hover: {
                      cursor: "pointer",
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
