import React, { Component } from "react";

import axios, { AxiosResponse } from "axios";
import { geoPath } from "d3-geo";
import { geoTimes } from "d3-geo-projection";
import debounce from "lodash.debounce";
import flatten from "lodash.flatten";

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

interface ObjectLiteral {
  [key: string]: any;
}

interface State {
  center: number[];
  co2Query: string;
  countryName: string;
  data: ObjectLiteral[];
  geo: any;
  loading: boolean;
  popQuery: string;
  year: string;
  zoom: number;
}

interface Props {}

class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      center: [0, 20],
      co2Query: "",
      countryName: "",
      data: [],
      loading: false,
      geo: "",
      popQuery: "",
      year: "1980",
      zoom: 1
    } as State;
  }

  // todo: lol where tf to debounce?

  handleChange = async (event: React.FormEvent<HTMLInputElement>) => {
    this.setState({ year: event.currentTarget.value });
    await this.collectData(this.state.countryName);
  }

  handleClick = async (geo: any): Promise<void> => {
    const countryName = geo.properties.brk_name;
    if (countryName !== this.state.countryName) {
      this.setState({ geo, countryName });
      await this.collectData(countryName);
    }
  };

  collectData = async (countryName: string): Promise<void> => {
    this.setState({ co2Query: "", loading: true, popQuery: "" });
    const { center, zoom } = this.getZoomProperties(this.state.geo);
    const queries = [
      {
        query: this.generatePopQuery(countryName, this.state.year),
        slug: "doe/population-bycountry-1980-2010"
      }, {
        query: this.generateCO2Query(countryName, this.state.year),
        slug: "fmerchant/world-bank-co2"
      }];
    this.setState({ popQuery: queries[0].query });
    this.setState({ co2Query: queries[1].query });
    const responseData = await this.executeQueries(queries);
    const data = this.formatData(responseData);
    this.setState({ center, data, loading: false, zoom });
  };

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

  async executeQueries(queries: ObjectLiteral[]): Promise<SparqlResponse[]> {
    const requestPromises = queries.map(({query, slug}) => this.sendRequest(query, slug));
    try {
      const responses: AxiosResponse[] = await Promise.all(requestPromises);
      return responses.map(({ data }: { data: SparqlResponse }) => data);
    } catch (err) {
      console.error(err.message);
      return [];
    }
  }

  formatData(data: SparqlResponse[]): ObjectLiteral[] {
      return flatten(data.map((d) => {
        const dataInfo = d.results.bindings;
        const vars = d.head.vars;
        return vars.map(v => {
          return { [v]: dataInfo.length ? dataInfo[0][v].value : "¯\\_(ツ)_/¯" };
        });
      }));
  }

  generatePopQuery(name: string, year: string): string {
    const query = `PREFIX : <https://doe.linked.data.world/d/population-bycountry-1980-2010/>
SELECT ?Population
WHERE {
    ?country :col-populationbycountry19802010millions-column_a "${name}" .
    ?country :col-populationbycountry19802010millions-${year} ?Population .
}`;
    return query;
  }

  generateCO2Query(name:string, year: string): string {
    const query = `PREFIX dw: <https://fmerchant.linked.data.world/d/world-bank-co2/>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
SELECT ?CO2
WHERE {
  ?country dw:col-co2_data_cleaned-country_name "${name}" .
  ?country dw:col-co2_data_cleaned-year ?year .
  ?country dw:col-co2_data_cleaned-co2_kt ?CO2 .
  FILTER (xsd:integer(?year) = ${year})
}`;
    return query;
  }

  sendRequest(query: string, slug: string): Promise<AxiosResponse> {
    return axios.get(`https://query.data.world/sparql/${slug}`, {
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_TOKEN}`,
        "Content-Type": "application/sparql-query"
      },
      params: { query }
    });
  }

  resetView = (): void => {
    this.setState({ center: [0, 20], co2Query: "", countryName: "", data: [], popQuery: "", zoom: 1 });
  }

  render() {
    const {
      center,
      co2Query,
      countryName,
      data,
      loading,
      popQuery,
      year,
      zoom
    } = this.state;

    return (
      <div className="App">
        <InfoPanel
          key={new Date().toString()}
          countryName={countryName}
          data={data}
          isLoading={loading}
          onChange={this.handleChange}
          queries={({ Population: popQuery, CO2: co2Query })}
          resetView={this.resetView}
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
