import React, { Component } from "react"
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
} from "react-simple-maps";
import { scaleLinear } from "d3-scale";
import axios, { AxiosError } from "axios";

import { PopulationDisplay } from "./PopulationDisplay";
import geo from "./static/world-50m-with-population.json";

interface State {
  countryName: string;
  population: string;
}

interface Props {}

interface SparqlResponse {
  head: SparqlHead;
  results: SparqlResults;
}

interface SparqlHead {
  link: any[];
  vars: string[];
}

interface SparqlResults {
  distinct: boolean;
  ordered: boolean;
  bindings: any[];
}

const wrapperStyles = {
  width: "100%",
  maxWidth: "100%",
  margin: "0 auto",
}

const popScale = scaleLinear()
  .domain([0, 100000000, 1400000000])
  .range(["#CFD8DC", "#607D8B", "#37474F"] as any[])

export class Map extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { countryName: "", population: "" } as State;
  }

  handleClick = (geo: any): void => {
    const countryName = geo.properties.formal_en;
    if (countryName !== this.state.countryName) {
      this.getPopData(countryName);
    }
  }

  getPopData(name: string): Promise<void> {
    return axios.get("http://dbpedia.org/sparql", {
      headers: {
        "Content-Type": "application/sparql-query",
      },
      params: {
        query: this.generateQuery(name)
      }
    }).then(({ data }: { data: SparqlResponse }): void => {
      const dataInfo = data.results.bindings;
      if (dataInfo.length) {
        const population = dataInfo[0].population.value;
        this.setState({ countryName: name, population });
      } else {
        this.setState({ countryName: name, population: "¯\\_(ツ)_/¯" });
      }
    }).catch((err: AxiosError) => {
      console.log(`\n\n\nerererer\n\n\n${err.message}`);
    });
  }

  generateQuery(name: string): string {
    return `SELECT ?population WHERE {
      ?country foaf:name|dbo:longName "${name}"@en .
      ?country dbp:populationCensus|dbo:populationTotal ?population .
    }`;
  }

  render() {
    return (
      <div style={wrapperStyles}>
        <PopulationDisplay
          countryName={this.state.countryName}
          population={this.state.population}
        />
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
          <ZoomableGroup center={[0,20]}>
            <Geographies geography={geo}>
              {(geographies: any, projection: any) => geographies.map((geography: any, i: number) => (
                <Geography
                  key={i}
                  geography={geography}
                  projection={projection}
                  onClick={this.handleClick}
                  style={{
                    default: {
                      fill: popScale(geography.properties.pop_est),
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
