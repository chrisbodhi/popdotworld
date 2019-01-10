import React from "react";
import flatten from "lodash.flatten";

import "./DataDisplay.css";

interface ObjectLiteral {
  [key: string]: any;
}

interface Props {
  countryName: string;
  isLoading: boolean;
  data: ObjectLiteral[];
}

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

export const DataDisplay = (props: Props) => {
  if (props.isLoading) {
    return <div>...</div>;
  }
  const keys = flatten(props.data.map(data => Object.keys(data)));

  return props.data
    ? (<ul>
        {props.data.map((data, index) => {
          return (
            <li key={`${keys[index]}`}>
              {props.countryName}: {keys[index]} &mdash; {formatLongNumber(keys[index], data[keys[index]])}
            </li>
          );
        })}
      </ul>)
    : <div />;
};

export default DataDisplay;
