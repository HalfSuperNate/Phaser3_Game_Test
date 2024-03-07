// use this a a template for other read contract functionality
import { readContract } from '@wagmi/core';
import { _abi, _abiAddress } from './abiGet';
import { config } from './config'
import EventManager from '../components/EventManager';

export default class TotalSupplyFetcher {
    static async fetchTotalSupply(): Promise<number> {
        try {
            const result = await readContract(config, {
                abi: _abi,
                address: `0x${_abiAddress}`,
                functionName: 'totalSupply',
                args: [],
            });

            let totalSupply = 0;
            if (result) {
                totalSupply = parseInt(result.toString());
                EventManager.getInstance().emitEvent('totalSupplyFetched', totalSupply);
                //console.log('Total supply:', totalSupply);
            }

            return totalSupply;
        } catch (error) {
            console.error('Error fetching total supply:', error);
            throw error;
        }
    }
}