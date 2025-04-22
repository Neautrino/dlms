import { PublicKey } from "@solana/web3.js";
import { program } from "../utils";
import { Request, Response } from "express";

export const fetchAllApplications = async (req: Request, res: Response) => {
    try {
        const applications = await program.account.application.all();
        res.status(200).json(applications);
    } catch (error) {
        console.error('Error fetching application state:', error);
        res.status(500).json({ error: 'Error in fetching application data' });
    }
}

export const fetchApplicationByLabour = async (req: Request, res: Response) => {
    const { labourAddress } = req.params;

    if(!labourAddress) {
        res.status(400).json({ error: 'Labour address parameter is required' });
    }

    const pubKey = new PublicKey(labourAddress);

    if(!pubKey) {
        res.status(400).json({ error: 'Invalid labour address' });
    }

    try {
        const applicationState = await program.account.application.all([
            {
                memcmp: {
                    offset: 8, 
                    bytes: pubKey.toBase58(),
                },
            },
        ]);
        res.status(200).json(applicationState);
    } catch (error) {
        console.error('Error fetching application state:', error);
        res.status(500).json({ error: 'Internal Server Error: PublicKey does not match' });
    }
}

export const fetchApplicationByProject = async (req: Request, res: Response) => {
    const { projectAddress } = req.params;

    if(!projectAddress) {
        res.status(400).json({ error: 'Project address parameter is required' });
    }

    const pubKey = new PublicKey(projectAddress);

    if(!pubKey) {
        res.status(400).json({ error: 'Invalid project address' });
    }

    try {
        const applicationState = await program.account.application.all([
            {
                memcmp: {
                    offset: 8 + 32, 
                    bytes: pubKey.toBase58(),
                },
            },
        ]);
        res.status(200).json(applicationState);
    } catch (error) {
        console.error('Error fetching application state:', error);
        res.status(500).json({ error: 'Internal Server Error: PublicKey does not match' });
    }
}