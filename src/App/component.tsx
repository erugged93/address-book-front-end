import React from "react";
import { Router } from "@reach/router";
import { Global } from "@emotion/core";
import styled from "@emotion/styled";

import { EmptyPage } from "./empty-page";
import { styles } from "./globalStyles";

export const App = () => {
    return (
        <>
            <Global styles={styles} />
            <StyledRouter>
                {/* <EventDetails path="/events/:eventId/:tab" />
                <EventDetails path="/events/:eventId/" />
                <EventsPage path="/events/reservations" />
                <EventsPage path="/events/groups" />
                <EventsPage path="/events/" default /> */}
                <EmptyPage path="/empty-page" />
            </StyledRouter>
        </>
    );
};

const StyledRouter = styled(Router)`
    height: 100%;
`;
