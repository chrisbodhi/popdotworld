import React, { Component } from "react";
import axios, { AxiosResponse } from "axios";
import { geoPath } from "d3-geo";
import { geoTimes } from "d3-geo-projection";

import { InfoPanel } from "./InfoPanel";
import { Map } from './Map';
import { QueryPanel } from "./QueryPanel";

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
  year: string;
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
      year: "1980",
      zoom: 1
    } as State;
  }

  handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    this.setState({ year: event.currentTarget.value });
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

  generateQuery(name: string = "United States"): string {
    const year = 2000;
    const query = `PREFIX dw: <https://fmerchant.linked.data.world/d/world-bank-co2/>
      PREFIX pop: <https://doe.linked.data.world/d/population-bycountry-1980-2010/>
      PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

      SELECT ?year ?tons ?num
      FROM NAMED <https://data.world/fmerchant/world-bank-co2>
      WHERE {
          ?country dw:col-co2_data_cleaned-country_name "${name}" .
          ?country dw:col-co2_data_cleaned-year ?year .
          ?country dw:col-co2_data_cleaned-co2_kt ?tons .
          FILTER (xsd:integer(?year) = ${year})
          GRAPH <https://data.world/doe/population-bycountry-1980-2010/> {
            ?info pop:col-populationbycountry19802010millions-column_a "${name}" .
            ?info pop:col-populationbycountry19802010millions-${year} ?num .
          }
      }`;
    this.setState({ query });
    return query;
  }

  sendRequest(query: string): Promise<AxiosResponse> {
    return axios.get("https://query.data.world/sparql/fmerchant/world-bank-co2", {
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_TOKEN}`,
        "Content-Type": "application/sparql-query"
      },
      params: { query }
    });
  }

  resetView = (): void => {
    this.setState({ center: [0, 20], countryName: "", population: "", query: "", zoom: 1 });
  }

  render() {
    const {
      center,
      countryName,
      loading,
      population,
      query,
      year,
      zoom
    } = this.state;

    return (
      <div className="App">
        <QueryPanel
          query={query}
          resetView={this.resetView}
        />
        <InfoPanel
          countryName={countryName}
          isLoading={loading}
          onChange={this.handleChange}
          population={population}
          year={year}
        />
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
