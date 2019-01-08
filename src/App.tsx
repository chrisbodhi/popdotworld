import React, { Component } from "react";
import axios, { AxiosResponse } from "axios";
import { geoPath } from "d3-geo";
import { geoTimes } from "d3-geo-projection";

import { Map } from './Map';
import { PopulationDisplay } from "./PopulationDisplay";
import { Query } from "./Query";

import './App.css';

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

interface State {
  center: number[];
  countryName: string;
  loading: boolean;
  population: string;
  query: string;
  zoom: number;
}

interface Props {}

class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      center: [0, 20],
      countryName: "",
      loading: false,
      population: "",
      query: "",
      zoom: 1
    } as State;
  }

  handleClick = async (geo: any): Promise<void> => {
    const countryName = geo.properties.brk_name;
    if (countryName !== this.state.countryName) {
      this.setState({ loading: true });
      const { center, zoom } = this.getZoomProperties(geo);
      const population = await this.getPopData(countryName);
      this.setState({ center, countryName, population, loading: false, zoom });
    }
  }

  projection() {
    return geoTimes()
      .translate([1440 / 2, 780 / 2])
      .scale(160)
  }

  getZoomProperties(geo: any): { center: number[]; zoom: number; } {
    const path = geoPath().projection(this.projection())
    const center = this.projection().invert(path.centroid(geo))
    return { center, zoom: 3 };
  }

  async getPopData(name: string): Promise<string> {
    const query = this.generateQuery(name);
    try {
      const { data }: { data: SparqlResponse } = await this.sendRequest(query);
      const dataInfo = data.results.bindings;
      const population = dataInfo.length ?
        dataInfo[0].population.value :
        "¯\\_(ツ)_/¯";
      return population;
    } catch (err) {
        console.error(err.message);
        return "";
    }
  }

  generateQuery(name: string): string {
    const query = `SELECT ?population WHERE {\n\t?country rdfs:label "${name}"@en .\n\t?country dbp:populationCensus|dbo:populationTotal ?population .\n}`;
    this.setState({ query });
    return query;
  }

  sendRequest(query: string): Promise<AxiosResponse> {
    return axios.get("http://dbpedia.org/sparql", {
      headers: { "Content-Type": "application/sparql-query" },
      params: { query }
    });
  }

  resetView = (): void => {
    this.setState({ center: [0, 20], query: "", zoom: 1 });
  }

  render() {
    const {
      center,
      countryName,
      loading,
      population,
      query,
      zoom
    } = this.state;

    return (
      <div className="App">
        <PopulationDisplay
          countryName={countryName}
          population={population}
          isLoading={loading}
        />
        <Query query={query} />
        {query.length ? <button onClick={this.resetView}>
          Reset view
        </button> : null}
        <Map
          center={center}
          handleClick={this.handleClick}
          selected={countryName}
          zoom={zoom}
        />
      </div>
    );
  }
}

export default App;
