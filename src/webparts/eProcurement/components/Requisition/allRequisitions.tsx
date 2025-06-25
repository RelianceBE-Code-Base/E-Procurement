import * as React from 'react';

interface IAllRequisitions{
    stages?: any;
    setSelectedStage?: any;
    sampleRequests?: any
}
const AllRequisitions:React.FC<IAllRequisitions> = () =>{
    return(
        <>
        Hello Team!
        This is All Requisitions
        </>
    )
}
export default AllRequisitions