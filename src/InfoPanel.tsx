import React from "react";

import { DataDisplay } from "./DataDisplay";
import { Slider } from "./Slider";

import "./InfoPanel.css";
import "./panel.css";

interface ObjectLiteral {
  [key: string]: any;
}

interface Props {
  countryName: string;
  data: ObjectLiteral[];
  isLoading: boolean;
  onChange: (ev: React.FormEvent<HTMLInputElement>) => void;
  year: string;
}

export const InfoPanel = (props: Props) => {
  const { countryName, data, isLoading, onChange, year } = props;
  return countryName ?
    (<div className="panel infoPanel">
      <DataDisplay
        countryName={countryName}
        data={data}
        isLoading={isLoading}
      />
      <Slider
        onChange={onChange}
        year={year}
      />
    </div>) :
    null;
}

export default InfoPanel;
