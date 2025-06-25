import * as React from 'react';

interface ITenderManagement{
    stages?: any;
    setSelectedStage?: any;
    sampleRequests?: any
}
const TenderManagement:React.FC<ITenderManagement> = () =>{
    return(
        <>
        Hello Team!
        This is Tender Management
        </>
    )
}
export default TenderManagement