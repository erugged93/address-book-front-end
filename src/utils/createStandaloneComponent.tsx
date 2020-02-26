import React, { ComponentType } from "react";
import { ApolloProvider } from "@apollo/react-hooks";
import { ThemeProvider, Converge, initIcons } from "@gather/ui";
import { client } from "../GetApolloClient";

export function createStandaloneComponent<P>(Component: ComponentType<P>) {
    return (props: P) => {
        initIcons();
        return (
            <ApolloProvider client={client}>
                <ThemeProvider theme={Converge}>
                    <Component {...props} />
                </ThemeProvider>
            </ApolloProvider>
        );
    };
}
