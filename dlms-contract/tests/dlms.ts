import * as anchor from '@coral-xyz/anchor'
import {DLMS_PROGRAM_ID, DlmsContract, getDLMSProgram} from '../src';
import { PublicKey } from '@solana/web3.js';
import { expect } from 'chai';

describe('dlms', () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const dlmsProgram = getDLMSProgram(provider, DLMS_PROGRAM_ID) as anchor.Program<DlmsContract>;

  const [system_state_pda] = PublicKey.findProgramAddressSync(
    [Buffer.from("System")],
    DLMS_PROGRAM_ID
  )

  it("Initialize Poll", async() => {
    const mint = new PublicKey("11111111111111111111111111111111"); // Replace with actual mint address

    await dlmsProgram.methods.initializeSystem( 
      mint,
    )
    .accounts({
        // @ts-ignore
      systemState: system_state_pda,
      authority: provider.wallet.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .rpc();

    const system = await dlmsProgram.account.systemState.fetch(system_state_pda);
    console.log(system);

    expect(system.mint.equals(mint)).to.be.true;
    expect(system.labourCount).to.equal(0);
    expect(system.managerCount).to.equal(0);
    expect(system.projectCount).to.equal(0);
  })

})
