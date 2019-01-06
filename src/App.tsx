import React, { Component } from "react";
import axios, { AxiosError } from "axios";

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
  countryName: string;
  population: string;
  query: string;
}

interface Props {}

class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      countryName: "",
      population: "",
      query: ""
    } as State;
  }

  handleClick = (geo: any): void => {
    const countryName = geo.properties.formal_en;
    if (countryName !== this.state.countryName) {
      this.getPopData(countryName);
    }
  }

  getPopData(name: string): Promise<void> {
    const query = this.generateQuery(name);
    return axios.get("http://dbpedia.org/sparql", {
      headers: {
        "Content-Type": "application/sparql-query",
      },
      params: {
        query
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
    const query = `
    SELECT ?population WHERE {
      ?country dbo:longName|foaf:name "${name}"@en .
      ?country dbp:populationCensus|dbo:populationTotal ?population .
    }`;
    this.setState({ query });
    return query;
  }

  render() {
    const { countryName, loading, population, query } = this.state;
    return (
      <div className="App">
        <PopulationDisplay
          countryName={this.state.countryName}
          population={this.state.population}
        />
        <Query query={query} />
        <Map handleClick={this.handleClick} />
      </div>
    );
  }
}

export default App;
