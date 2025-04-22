import { PublicKey } from "@solana/web3.js";
import { program } from "../utils";
import { Request, Response } from "express";

export const getAllReviews = async (req: Request, res: Response) => {
    try {
        const reviews = await program.account.review.all();
        res.status(200).json(reviews);
    } catch (error) {
        console.error('Error fetching review state:', error);
        res.status(500).json({ error: 'Error in fetching review data' });
    }
}

export const getReviewOfUser = async (req: Request, res: Response) => {
    const { userAddress } = req.params;

    if(!userAddress) {
        res.status(400).json({ error: 'User address parameter is required' });
    }

    const pubKey = new PublicKey(userAddress);

    if(!pubKey) {
        res.status(400).json({ error: 'Invalid user address' });
    }

    try {
        const reviews = await program.account.review.all([
            {
                memcmp: {
                    offset: 8 + 32, 
                    bytes: pubKey.toBase58(),
                },
            },
        ]);
        res.status(200).json(reviews);
    } catch (error) {
        console.error('Error fetching review state:', error);
        res.status(500).json({ error: 'Internal Server Error: PublicKey does not match' });
    }
}
