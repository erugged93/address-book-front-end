import React from "react";
import { render } from "react-dom";
import { ApolloProvider } from "@apollo/react-hooks";

import { client } from "./GetApolloClient";
import { App } from "./App";

render(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>,
    document.getElementById("root")
);
