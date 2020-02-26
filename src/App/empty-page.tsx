import React from "react";
import { ActivityLog, LastLoggedActivity, AccountList } from "../components";
import { RouteComponentProps } from "@reach/router";

export const EmptyPage = (props: RouteComponentProps) => {
    return (
        <div>
            {/* <ActivityLog collection="bookings" id="test" timezone="US/Eastern"></ActivityLog> */}
            <AccountList></AccountList>
        </div>
    );
};
