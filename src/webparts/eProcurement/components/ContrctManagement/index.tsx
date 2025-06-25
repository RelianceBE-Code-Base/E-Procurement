import * as React from 'react';

interface IContractManagement{
    stages?: any;
    setSelectedStage?: any;
    sampleRequests?: any
}
const ContractManagement:React.FC<IContractManagement> = () =>{
    return(
        <>
        Hello Team!
        This is Contract Management
        </>
    )
}
export default ContractManagement