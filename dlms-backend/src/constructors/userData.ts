import { PublicKey } from "@solana/web3.js";
import { program } from "../utils";
import { Request, Response } from "express";

export const fetchUserState = async (req: Request, res: Response) => {
    try {
        const userState = await program.account.userAccount.all();
        res.status(200).json(userState);
    } catch (error) {
        console.error('Error fetching user state:', error);
        res.status(500).json({ error: 'Error in fetching data' });
    }
}

export const fetchUserStateByPublicKey = async (req: Request, res: Response) => {
    const { userAddress } = req.params;

    if(!userAddress) {
        res.status(400).json({ error: 'User address parameter is required' });
    }

    const pubKey = new PublicKey(userAddress);

    if(!pubKey) {
        res.status(400).json({ error: 'Invalid user address' });
    }

    try {
        const userState = await program.account.userAccount.fetch(userAddress);
        res.status(200).json(userState);
    } catch (error) {
        console.error('Error fetching user state:', error);
        res.status(500).json({ error: 'Internal Server Error: PublicKey does not match' });
    }
}

export const fetchUserStateByAuthority = async (req: Request, res: Response) => {
    const { authority } = req.params;

    if(!authority) {
        res.status(400).json({ error: 'Authority parameter is required' });
    }

    const pubKey = new PublicKey(authority);

    if(!pubKey) {
        res.status(400).json({ error: 'Invalid authority address' });
    }
    try {
        const userState = await program.account.userAccount.all([
            {
                memcmp: {
                    offset: 8, 
                    bytes: pubKey.toBase58(),
                },
            },
        ]);
        res.status(200).json(userState);
    }
    catch (error) {
        console.error('Error fetching user state by authorrity:', error);
        res.status(500).json({ error: 'Internal Server Error: Authority does not match' });
    }
}