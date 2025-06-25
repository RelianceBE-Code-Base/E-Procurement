import * as React from 'react';

interface IApprovals{
    stages?: any;
    setSelectedStage?: any;
    sampleRequests?: any
}
const Approvals:React.FC<IApprovals> = () =>{
    return(
        <>
        Hello Team!
        This is Approvals
        </>
    )
}
export default Approvals