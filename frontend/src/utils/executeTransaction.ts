import { bs58 } from '@coral-xyz/anchor/dist/cjs/utils/bytes';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Transaction } from '@solana/web3.js';

export const executeTransaction = async (response: {
    success: boolean;
    lastValidBlockHeight: number;
    serializedTransaction: string;
}) => {
    try {
        const { publicKey, signTransaction } = useWallet();
        const { connection } = useConnection();

        if (!publicKey || !signTransaction) {
            throw new Error('Wallet not connected');
        }

        const { success, lastValidBlockHeight, serializedTransaction } = response;

        if (!success) {
            throw new Error('Transaction creation failed');
        }
        const transaction = Transaction.from(bs58.decode(serializedTransaction));

        // Get latest blockhash
        const { blockhash } = await connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = publicKey;

        // Sign and send
        const signedTx = await signTransaction(transaction);
        const signature = await connection.sendRawTransaction(signedTx.serialize());

        // Confirm transaction
        await connection.confirmTransaction(signature);

        return {
            success: true,
            signature
        }

    } catch (error) {
        console.error('Transaction failed:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }
    }
};