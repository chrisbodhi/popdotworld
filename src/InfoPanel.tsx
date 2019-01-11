import React, { Component } from "react";

import { DataDisplay } from "./DataDisplay";
import { QueryPanel } from "./QueryPanel";
import { Slider } from "./Slider";
import { ObjectLiteral } from "./types";

import "./InfoPanel.css";
import "./panel.css";

interface Props {
  countryName: string;
  data: ObjectLiteral[];
  isLoading: boolean;
  onChange: (ev: React.FormEvent<HTMLInputElement>) => void;
  queries: ObjectLiteral;
  resetView: () => void;
  year: string;
}

interface State {
  query: string;
  queryName: string;
}

export class InfoPanel extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { query: "", queryName: "" };
  }

  toggleQueryPanel = (name: string): void => {
    if (name === this.state.queryName) {
      this.setState({ query: "", queryName: "" });
    } else {
      this.setState({ query: this.props.queries[name], queryName: name });
    }
  }

  render(): JSX.Element | null {
    const { countryName, data, isLoading, onChange, resetView, year } = this.props;
    return countryName ? (
      <React.Fragment>
        <QueryPanel query={this.state.query} resetView={resetView} />
        <div className="panel infoPanel">
          <span className="countryName">{countryName}</span>
          <DataDisplay
            key={new Date().toString()}
            data={data}
            isLoading={isLoading}
            panelName={this.state.queryName}
            toggleQueryPanel={this.toggleQueryPanel}
            />
          <Slider
            onChange={onChange}
            year={year}
            />
        </div>
    </React.Fragment>
    ) : null;
  }
}

export default InfoPanel;
