// File: utils/config.ts - Server-only file
// "use server"

import { LaborMetadata, ManagerMetadata, UserMetadata } from "@/types/user";
import { PinataSDK } from "pinata";
import FormData from 'form-data';
import axios from 'axios';

export const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT,
  pinataGateway: process.env.NEXT_PUBLIC_GATEWAY_URL
});

export const pinataGateway = process.env.NEXT_PUBLIC_GATEWAY_URL;

/**
 * Uploads a file to Pinata and returns the IPFS URL
 */
export async function getUrl(cid: string) {
  return `https://${pinataGateway}/ipfs/${cid}`;
}

export async function uploadFileToPinata(file: File) {
  try {
    // Create a unique filename with timestamp and random string
    const uniqueFileName = `${file.name}-${Date.now()}`;

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Create form data
    const formData = new FormData();
    formData.append('file', buffer, {
      filename: uniqueFileName,
      contentType: file.type,
    });

    // Add metadata
    formData.append('pinataMetadata', JSON.stringify({
      name: uniqueFileName,
    }));

    // Upload to Pinata
    const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
      headers: {
        'Authorization': `Bearer ${process.env.PINATA_JWT}`,
        ...formData.getHeaders(),
      },
    });

    if (!response.data || !response.data.IpfsHash) {
      throw new Error("Upload failed - no IPFS hash returned");
    }

    return `https://${pinataGateway}/ipfs/${response.data.IpfsHash}`;
  } catch (error) {
    console.error("Error uploading file to Pinata:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to upload file: ${error.message}`);
    }
    throw new Error("Failed to upload file");
  }
}

/**
 * Uploads metadata as JSON to Pinata and returns the IPFS URL
 */
export async function uploadMetadataToPinata(metadata: any) {
  try {
    // Create a unique filename with timestamp
    const timestamp = Date.now();
    const uniqueFileName = `${timestamp}-${metadata.name}-metadata.json`;

    // Upload to Pinata
    const response = await axios.post('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      pinataMetadata: {
        name: uniqueFileName,
      },
      pinataContent: metadata,
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.PINATA_JWT}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.data || !response.data.IpfsHash) {
      throw new Error("Upload failed - no IPFS hash returned");
    }

    return `https://${pinataGateway}/ipfs/${response.data.IpfsHash}`;
  } catch (error) {
    console.error("Error uploading metadata to Pinata:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to upload metadata: ${error.message}`);
    }
    throw new Error("Failed to upload metadata");
  }
}