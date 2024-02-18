import { WalletEntryPosition } from '@particle-network/auth';
import {
    Ethereum,
    EthereumGoerli,
} from '@particle-network/chains';
import { evmWallets, solanaWallets } from '@particle-network/connect';
import { ModalProvider } from '@particle-network/connect-react-ui';
import '@particle-network/connect-react-ui/esm/index.css';
import '../styles/globals.css';
import { ThirdwebProvider, useContract } from "@thirdweb-dev/react";
import { Chain } from '@particle-network/connect-react-ui';

const Avalanche: Chain = {
    id: 43113, // Ganti dengan ID yang diinginkan
    name: 'Avalanche',
};
function MyApp({ Component, pageProps }: any) {
    return (
        <ModalProvider
            walletSort={['Particle Auth', 'Wallet']}
            particleAuthSort={[
                'email',
            ]}
            options={{
                projectId: process.env.NEXT_PUBLIC_PROJECT_ID as string,
                clientKey: process.env.NEXT_PUBLIC_CLIENT_KEY as string,
                appId: process.env.NEXT_PUBLIC_APP_ID as string,
                chains: [
                    Avalanche,
                ],
                wallets: [
                    ...evmWallets({
                        projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID as string,
                        showQrModal: false,
                    }),
                ],
            }}
            language="en"
            theme={'light'}
        >
            <Component {...pageProps} />
        </ModalProvider>
    );
}

export default MyApp;
