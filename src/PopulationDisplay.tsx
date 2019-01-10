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

export const formatLongNumber = (longNum: string): string => {
  return formatIter(longNum, "");
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
              {props.countryName}: {keys[index]} &mdash; {formatLongNumber(data[keys[index]].split(".")[0])}
            </li>
          );
        })}
      </ul>)
    : <div />;
};

export default DataDisplay;
