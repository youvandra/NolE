import { useEffect, useState } from 'react';
import { ConnectButton, useAccount } from '@particle-network/connect-react-ui';
import ABI_Token from './ABI_Token.json'; // Import ABI contract
import ABI_Staking from './ABI_Staking.json'; // Import ABI contract
import Web3 from 'web3';

export default function Home() {
    const account = useAccount();
    const [loading, setLoading] = useState(false);
    const [mintAmount, setMintAmount] = useState('');
    const [stakeAmount, setStakeAmount] = useState('');
    const [unstakeAmount, setUnstakeAmount] = useState('');
	const [claimReward, setClaimReward] = useState('');
	const [tokenBalance, setTokenBalance] = useState<number | null>(null);
	// Inisialisasi provider MetaMask
	const [web3, setWeb3] = useState(null);
    // Your contract addresses
    const tokenContractAddress = '0xA3990083595c4ae186d36C43ed2f45d83F59E8Df'; // Replace with your token contract address
    const stakingContractAddress = '0xF673760076c023C86Cb694619E626863341926d8'; // Replace with your staking contract address

	useEffect(() => {
        // Check if window object is available (client-side)
        if (typeof window !== 'undefined') {
            // Initialize web3 only on the client-side
            const provider = window.ethereum;
            const newWeb3 = new Web3(provider);
            setWeb3(newWeb3);
        }
    }, []);
	if (!web3) return;
	const mintAmountNumber = parseFloat(mintAmount);
	const MINT_PRICE_ETH = '0.1'; // MINT_PRICE in ether as a string
	const MINT_PRICE_WEI: number = Number(web3.utils.toWei(MINT_PRICE_ETH, 'ether'));


	// Calculate the value in wei
	const valueInWei = mintAmountNumber * MINT_PRICE_WEI;


    // Initialize token contract
    const tokenContract = new web3.eth.Contract(ABI_Token, tokenContractAddress);

    // Initialize staking contract
    const stakingContract = new web3.eth.Contract(ABI_Staking, stakingContractAddress);
	const getTokenBalance = async () => {
		try {
			// Panggil fungsi balanceOf pada kontrak token
			const balance = await tokenContract.methods.balanceOf(account).call();
			if (typeof balance === 'string') {
				setTokenBalance(parseInt(balance)); // Parse string ke integer sebelum disimpan
			} else {
				console.error("Invalid token balance:", balance);
			}
		} catch (error) {
			console.error("Error getting token balance:", error);
		}
	};
    // Handle minting function
    const handleMint = async () => {
        setLoading(true);
        try {
            // Call the 'mint' function in the staking contract
            await tokenContract.methods.mint(mintAmountNumber).send({ from: account, value: valueInWei.toString() });
            alert('Minting successful!');
			getTokenBalance();
        } catch (error) {
            alert('Error minting tokens: ' + error.message);
        }
        setLoading(false);
    };

    // Handle staking function
    const handleStake = async () => {
        setLoading(true);
        try {
            // Call the 'stake' function in the staking contract
            await stakingContract.methods.stake(stakeAmount).send({ from: account });
            alert('Staking successful!');
        } catch (error) {
            alert('Error staking tokens: ' + error.message);
        }
        setLoading(false);
    };

    // Handle withdrawal function
    const handleWithdraw = async () => {
        setLoading(true);
        try {
            // Call the 'withdraw' function in the staking contract
            await stakingContract.methods.withdraw().send({ from: account });
            alert('Withdrawal successful!');
        } catch (error) {
            alert('Error withdrawing tokens: ' + error.message);
        }
        setLoading(false);
    };

    // Handle claiming reward function
    const handleClaimReward = async () => {
        setLoading(true);
        try {
            // Call the 'claimReward' function in the staking contract
            await stakingContract.methods.claimReward(account, claimReward).send({ from: account });
            alert('Reward claimed successfully!');
        } catch (error) {
            alert('Error claiming reward: ' + error.message);
        }
        setLoading(false);
    };

    return (
        <div>
            <div style={{ marginTop: 100 }}>
                <ConnectButton />
            </div>
            <div className="flex h-[60vh] mt-[50px] gap-[80px] p-[50px]">
                <div className="border-2 bg-white flex-1 flex justify-center items-center rounded-lg">
                    <div className="flex flex-col gap-[15px]">
                        <h2 className="text-center font-bold text-black">
                            Mint tokens to buy trees
                        </h2>
                        <h2 className="text-center font-bold text-black">
                            1 NOL-E = 1 Tree
                        </h2>
                        <div>
                            <input
                                type="number"
                                value={mintAmount}
                                onChange={(e) => setMintAmount(e.target.value)}
                                placeholder="Enter amount"
                                className="h-[40px] text-center bg-white border-[1px] border-black rounded-md text-black"
                            />
                        </div>
                        <button
                            onClick={handleMint}
                            disabled={loading}
                            className="border-2 w-full bg-black text-white h-[40px] rounded-md">
                            {loading ? 'Minting...' : 'Mint'}
                        </button>
                    </div>
                </div>
                <div className="flex-1 flex flex-col gap-[20px] justify-center items-center bg-white rounded-lg">
                    <div className="flex items-end gap-[100px]">
                        <div className="flex flex-col gap-[15px]">
                            <h2 className="text-center font-bold text-black">
                                Stake NOL-E
                            </h2>
                            <div>
                                <input
                                    type="number"
                                    value={stakeAmount}
                                    onChange={(e) => setStakeAmount(e.target.value)}
                                    placeholder="Enter amount"
                                    className="h-[40px] text-center bg-white border-[1px] border-black rounded-md text-black"
                                />
                            </div>
                            <button
                                onClick={handleStake}
                                disabled={loading}
                                className="border-2 w-full bg-black text-white h-[40px] rounded-md">
                                {loading ? 'Staking...' : 'Stake'}
                            </button>
                        </div>
                        <div className="flex flex-col gap-[15px]">
                            <h2 className="text-center font-bold text-black">
                                Unstake NOL-E
                            </h2>
                            <div>
                                <input
                                    type="number"
                                    value={unstakeAmount}
                                    onChange={(e) => setUnstakeAmount(e.target.value)}
                                    placeholder="Enter amount"
                                    className="h-[40px] text-center bg-white border-[1px] border-black rounded-md text-black"
                                />
                            </div>
                            <button
                                onClick={handleWithdraw}
                                disabled={loading}
                                className="border-2 w-full bg-black text-white h-[40px] rounded-md">
                                {loading ? 'Unstaking...' : 'Unstake'}
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-col gap-[15px]">
                        <h2 className="text-center font-bold text-black">Claim Reward</h2>
						<div>
                                <input
                                    type="number"
                                    value={claimReward}
                                    onChange={(e) => setClaimReward(e.target.value)}
                                    placeholder="Enter amount"
                                    className="h-[40px] text-center bg-white border-[1px] border-black rounded-md text-black"
                                />
                        </div>
                        <button
                            onClick={handleClaimReward}
                            disabled={loading}
                            className="border-2 w-full bg-black text-white h-[40px] rounded-md">
                            {loading ? 'Claiming Reward...' : 'Claim Reward'}
                        </button>
                    </div>
                    <h2 className="text-center font-bold text-black">
                        Your NOL-E's removed 0 ton of CO2 since 02/2023
                    </h2>
                </div>
            </div>
        </div>
    );
}
