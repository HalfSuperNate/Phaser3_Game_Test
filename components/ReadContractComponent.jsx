// ReadContractComponent.jsx
import { useReadContract } from 'wagmi'; 
import { _abi, _abiAddress } from './abiGet';

export function ReadContractComponent() {
    const { data, isError, isLoading } = useReadContract({
        address: _abiAddress,
        abi: _abi,
        functionName: 'totalSupply',
        //functionName: 'tokenNextToMintInBatch',
        args: [],
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error fetching supply data</div>;
    }

    return <TestScene supplyData={data} />;
}
