import { PublicKey } from "@solana/web3.js";
import { program } from "../utils";
import { Request, Response } from "express";

export const fetchAllAssignments = async (req: Request, res: Response) => {
    try {
        const assignments = await program.account.assignment.all();
        res.status(200).json(assignments);
    } catch (error) {
        console.error('Error fetching assignment state:', error);
        res.status(500).json({ error: 'Error in fetching assignment data' });
    }
}

export const fetchAssignmentByLabour = async (req: Request, res: Response) => {
    const { labourAddress } = req.params;

    if(!labourAddress) {
        res.status(400).json({ error: 'Labour address parameter is required' });
    }

    const pubKey = new PublicKey(labourAddress);

    if(!pubKey) {
        res.status(400).json({ error: 'Invalid labour address' });
    }

    try {
        const assignmentState = await program.account.assignment.all([
            {
                memcmp: {
                    offset: 8, 
                    bytes: pubKey.toBase58(),
                },
            },
        ]);
        res.status(200).json(assignmentState);
    } catch (error) {
        console.error('Error fetching assignment state:', error);
        res.status(500).json({ error: 'Internal Server Error: PublicKey does not match' });
    }
}

export const fetchAssignmentByProject = async (req: Request, res: Response) => {
    const { projectAddress } = req.params;

    if(!projectAddress) {
        res.status(400).json({ error: 'Project address parameter is required' });
    }

    const pubKey = new PublicKey(projectAddress);

    if(!pubKey) {
        res.status(400).json({ error: 'Invalid project address' });
    }

    try {
        const assignmentState = await program.account.assignment.all([
            {
                memcmp: {
                    offset: 8, 
                    bytes: pubKey.toBase58(),
                },
            },
        ]);
        res.status(200).json(assignmentState);
    } catch (error) {
        console.error('Error fetching assignment state:', error);
        res.status(500).json({ error: 'Internal Server Error: PublicKey does not match' });
    }
}