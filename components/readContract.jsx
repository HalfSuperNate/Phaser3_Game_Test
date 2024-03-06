import { useReadContract } from 'wagmi'; 
import { _abi, _abiAddress } from './abiGet';

export function GetSupply() {
    const { data, isError, isLoading } = useReadContract({
        address: _abiAddress,
        abi: _abi,
        functionName: 'totalSupply',
        //functionName: 'tokenNextToMintInBatch',
        args: [],
    });

    return data;
}

// export async function GetMetadata(_id) {
//     const { data: uri, isError, isLoading } = useReadContract({
//         address: _abiAddress,
//         abi: _abi,
//         functionName: 'uri',
//         args: [_id],
//     });

//     if (isError || isLoading) {
//         return null;
//     }

//     try {
//         const response = await fetch(uri);
//         const json = await response.json();

//         if (json.image) {
//             return json.image; // Return the image URI from the JSON
//         } else {
//             return null; // JSON does not contain image key
//         }
//     } catch (error) {
//         console.error('Error fetching JSON metadata:', error);
//         return null;
//     }
// }