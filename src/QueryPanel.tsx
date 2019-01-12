import React from "react";

import { Query } from "./Query";

import "./QueryPanel.css";
import "./panel.css";

interface Props {
  query: string;
}

export const QueryPanel = (props: Props) => {
  const { query } = props;
  return (
    query.length ? (
      <div className="panel queryPanel">
        <Query query={query} />
      </div>
    ) : null
  );
}

export default QueryPanel;
