import { PublicKey } from "@solana/web3.js";
import { program } from "../utils";
import { Request, Response } from "express";


export const fetchAllProjects = async (req: Request, res: Response) => {
    try {
        const projects = await program.account.project.all();
        res.status(200).json(projects);
    } catch (error) {
        console.error('Error fetching project state:', error);
        res.status(500).json({ error: 'Error in fetching project data' });
    }
}
    
export const fetchProjectByPublicKey = async (req: Request, res: Response) => {
    const { projectAddress } = req.params;

    if(!projectAddress) {
        res.status(400).json({ error: 'Project address parameter is required' });
    }

    const pubKey = new PublicKey(projectAddress);

    if(!pubKey) {
        res.status(400).json({ error: 'Invalid project address' });
    }

    try {
        const projectState = await program.account.project.fetch(projectAddress);
        res.status(200).json(projectState);
    } catch (error) {
        console.error('Error fetching project state:', error);
        res.status(500).json({ error: 'Internal Server Error: PublicKey does not match' });
    }
}

export const fetchProjectByManagerAddress = async (req: Request, res: Response) => {
    const { managerAddress } = req.params;

    if(!managerAddress) {
        res.status(400).json({ error: 'Authority parameter is required' });
    }

    const pubKey = new PublicKey(managerAddress);

    if(!pubKey) {
        res.status(400).json({ error: 'Invalid authority address' });
    }
    try {
        const projectState = await program.account.project.all([
            {
                memcmp: {
                    offset: 8, 
                    bytes: pubKey.toBase58(),
                },
            },
        ]);
        res.status(200).json(projectState);
    }
    catch (error) {
        console.error('Error fetching project state:', error);
        res.status(500).json({ error: 'Internal Server Error: Address does not match' });
    }
}