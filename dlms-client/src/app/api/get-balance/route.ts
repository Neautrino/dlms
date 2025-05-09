import {
    PublicKey,
} from '@solana/web3.js';
import { getAssociatedTokenAddress } from '@solana/spl-token';
import { connection, program } from "@/utils/program";

export async function POST(req: Request) {
    try {
        const {userPubkey} = await req.json()
        
        if (!userPubkey) {
            return new Response(JSON.stringify({
                error: 'Missing userPubkey parameter'
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        // Validate public key
        let user: PublicKey;
        try {
            user = new PublicKey(userPubkey);
        } catch (error) {
            return new Response(JSON.stringify({
                error: 'Invalid public key format'
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Get the system state PDA to find the mint address
        const [systemStatePda] = PublicKey.findProgramAddressSync(
            [Buffer.from("System")],
            program.programId
        );
        
        // Get the system state account data
        const systemState = await program.account.systemState.fetch(systemStatePda);
        
        // Get the mint account from the system state
        const mint = systemState.mint;

        // Get the user's ATA (Associated Token Account)
        const userATA = await getAssociatedTokenAddress(
            new PublicKey(mint),
            user
        );

        // Check if the ATA exists
        let balance = 0;
        const tokenDecimals = Number(process.env.TOKEN_DECIMALS || '9');
        
        try {
            // Get token balance
            const tokenAccountInfo = await connection.getTokenAccountBalance(userATA);
            
            // Convert to readable format (based on decimals)
            const rawBalance = tokenAccountInfo.value.amount;
            balance = Number(rawBalance) / (10 ** tokenDecimals);
            
            return new Response(JSON.stringify({
                success: true,
                userPubkey: userPubkey,
                mint: mint.toString(),
                balance: balance,
                rawBalance: rawBalance,
                decimals: tokenDecimals
            }), {
                headers: { 'Content-Type': 'application/json' }
            });
        } catch (error) {
            // If the ATA doesn't exist or there's an error fetching the balance
            return new Response(JSON.stringify({
                success: true,
                userPubkey: userPubkey,
                mint: mint.toString(),
                balance: 0,
                rawBalance: "0",
                decimals: tokenDecimals,
                message: "Token account may not exist yet"
            }), {
                headers: { 'Content-Type': 'application/json' }
            });
        }
    } catch (error) {
        console.error('Error fetching token balance:', error);
        return new Response(JSON.stringify({
            error: 'Failed to fetch token balance',
            message: error instanceof Error ? error.message : 'Unknown error occurred'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}