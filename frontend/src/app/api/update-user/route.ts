import { NextResponse } from 'next/server';
import { PublicKey, Transaction } from '@solana/web3.js';
import { program } from '@/utils/program';
import { web3 } from '@coral-xyz/anchor';
import bs58 from 'bs58';

export async function POST(request: Request) {
  try {
    const { walletAddress, name, metadataUri, active } = await request.json();

    if (!walletAddress || !name || !metadataUri) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const [userAccount] = PublicKey.findProgramAddressSync(
      [
        Buffer.from('User'),
        new PublicKey(walletAddress).toBuffer(),
      ],
      program.programId
    );

    const blockhashResponse = await program.provider.connection.getLatestBlockhash();
    const tx = new Transaction();

    await program.methods
      .updateUser(
        name,
        metadataUri,
        active
      )
      .accounts({
        // @ts-ignore
        userAccount,
        authority: new PublicKey(walletAddress),
        systemProgram: web3.SystemProgram.programId,
      })
      .instruction()
      .then(ix => tx.add(ix));

    tx.recentBlockhash = blockhashResponse.blockhash;
    tx.feePayer = new PublicKey(walletAddress);

    const serializedTransaction = tx.serialize({ requireAllSignatures: false });
    const base58SerializedTx = bs58.encode(serializedTransaction);

    return NextResponse.json({
      success: true,
      serializedTransaction: base58SerializedTx,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update user' },
      { status: 500 }
    );
  }
} 