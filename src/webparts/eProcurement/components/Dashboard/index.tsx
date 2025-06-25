import * as React from 'react';

interface IDashboard{
    stages?: any;
    setSelectedStage?: any;
    sampleRequests?: any
}
const Dashboard:React.FC<IDashboard> = () =>{
    return(
        <>
        Hello Team!
        This is dashboard
        </>
    )
}
export default Dashboard