import React, { useState, useEffect } from "react";
// import { AccountTest, useGetAccountTestsQuery } from "../../Graphql";

export const AccountList = () => {
    // const { data, loading, error, refetch } = useGetAccountTestsQuery({
    //     variables: {
    //         companyId: "y91rcjs0"
    //     }
    // });

    // const accountTests = (data && data.AccountTests) || [];
    return (
        // <Card title={`Showing accounts`} subtitle="" size={CardSize.Full}>
        //     <ContentWrapper>
        //         <Table
        //             header={<ComfortableHeader columns={columns} />}
        //             columns={columns}
        //             loading={loading}
        //             error={!!error}
        //             getRow={(account: AccountTest) => {
        //                 return (
        //                     <div>
        //                         <RowCell>
        //                             <MainText>{account.name}</MainText>
        //                             <SubText>{account.accountId}</SubText>
        //                         </RowCell>
        //                         <RowCell>
        //                             <MainText>{account.address1}</MainText>
        //                             <SubText>{account.address2}</SubText>
        //                             <SubText>{`${account.city}, ${account.state} ${account.zip}`}</SubText>
        //                         </RowCell>
        //                         <RowCell>
        //                             <MainText>{account.localePreset}</MainText>
        //                             <SubText>{account.website}</SubText>
        //                         </RowCell>
        //                     </div>
        //                 );
        //             }}
        //             data={accountTests}
        //         />
        //     </ContentWrapper>
        // </Card>
    );
};
