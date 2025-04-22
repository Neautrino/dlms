import { program } from "../utils";
import { Request, Response } from "express";

export const fetchSystemState = async (req: Request, res: Response) => {

  try {
    const systemState = await program.account.systemState.all();
  
    res.status(200).json(systemState[0])
  } catch (error) {
    console.error('Error fetching system state:', error)
    res.status(500).json({ error: 'Internal Server Error' })
    
  }
}
