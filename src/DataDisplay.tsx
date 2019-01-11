import React from "react";

import flatten from "lodash.flatten";

import { ObjectLiteral } from "./types";

import "./DataDisplay.css";

const formatIter = (input: string, output: string): string => {
  if (!input || !input.length) {
    return output.slice(0, -1);
  }
  const lastThree = input.slice(-3);
  const nextStep = `${lastThree},${output}`;
  const endIndex = input.length - 3 > 0 ? input.length - 3 : 0;
  const truncatedInput = input.slice(0, endIndex);
  return formatIter(truncatedInput, nextStep);
};

export const formatLongNumber = (key: "Population" | "CO2" | string, longNum: string): string => {
  const num = key === "Population" ? (parseFloat(longNum) * 1000000).toString() : longNum;
  const roundedNum = num.split(".")[0];
  return formatIter(roundedNum, "");
};

const selectLabel = (input: string): string => {
  switch(input) {
    case "Population":
      return "people";
    case "CO2":
      return "kt"
    default:
      return "";
  }
}

interface Props {
  isLoading: boolean;
  data: ObjectLiteral[];
  panelName: string;
  toggleQueryPanel: (name: string) => void;
}

export const DataDisplay = (props: Props): JSX.Element => {
  const { data, isLoading, panelName, toggleQueryPanel } = props;
  const keys = flatten(data.map(d => Object.keys(d)));
  return data
    ? (<ul>
        {data.map((d, index) => {
          return (
            <li key={`${keys[index]}`}>
              <span className="label">{keys[index]}</span>: {isLoading ? "🤔" : formatLongNumber(keys[index], d[keys[index]])} {selectLabel(keys[index])}
              <br /><span
                className="panelToggle"
                onClick={() => toggleQueryPanel(keys[index])}>
                  {keys[index] === panelName ? "hide" : "show"} query
              </span>
            </li>
          );
        })}
      </ul>)
    : <div />;
};

export default DataDisplay;
