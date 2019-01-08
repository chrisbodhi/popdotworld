import React from "react";

import './Query.css';

interface Props {
  query: string;
}

export const Query = (props: Props) => {
  return (
    <pre>
      <span>
        <span className="title">SPARQL Query</span> [<a href="https://docs.data.world/tutorials/sparql/index.html" title="Link to SPARQL Tutorial" target="_blank">learn more</a>]
      </span>
      <hr />
      <code>
        {props.query}
      </code>
    </pre>
  );
}

export default Query;
