import { css } from "@emotion/core";

export const styles: any = css`
    html,
    body,
    #root {
        height: 100%;
    }

    body {
        margin: 0;
    }

    html,
    body,
    input,
    select,
    textarea,
    button,
    input[type="text"],
    input[type="password"],
    input[type="date"],
    input[type="number"] {
        font-family: "Source Sans Pro", "PT Sans", Calibri !important;
        font-size: 100%;
        color: #020203;
    }

    h1,
    h2,
    h3,
    h4,
    h5 {
        margin: 0;
        font-family: "Source Sans Pro", "PT Sans", Calibri !important;
        font-size: 100%;
        font-weight: 400;
    }

    a {
        color: #00adef;
        text-decoration: underline;
    }
    * {
        box-sizing: border-box;
    }
`;
