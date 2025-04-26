// File: utils/config.ts - Server-only file
// "use server"

import { LaborMetadata, ManagerMetadata, UserMetadata } from "@/types/user";
import { PinataSDK } from "pinata";

export const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT,
  pinataGateway: process.env.NEXT_PUBLIC_GATEWAY_URL
});

export const pinataGateway = process.env.NEXT_PUBLIC_GATEWAY_URL;

/**
 * Uploads a file to Pinata and returns the IPFS URL
 */
export async function uploadFileToPinata(file: File) {
  try {
    const groups = await pinata.groups.public
      .list()
      .name("DLMS Files");

    let group = groups.groups.find((g) => g.name === "DLMS Files");

    if (!group) {
      group = await pinata.groups.public.create({
        name: "DLMS Files",
      });
    }

    const upload = await pinata.upload.public
      .file(file)
      .name(file.name)
      .group(group.id);

    return `https://${pinataGateway}/ipfs/${upload.cid}`;
  } catch (error) {
    console.error("Error uploading file to Pinata:", error);
    throw new Error("Failed to upload file");
  }
}

/**
 * Uploads metadata as JSON to Pinata and returns the IPFS URL
 */
export async function uploadMetadataToPinata(metadata: UserMetadata) {
  try {
    const groups = await pinata.groups.public
      .list()
      .name("DLMS Metadata");

    let group = groups.groups.find((g) => g.name === "DLMS Metadata");

    if (!group) {
      group = await pinata.groups.public.create({
        name: "DLMS Metadata",
      });
    }

    const upload = await pinata.upload.public
      .json(metadata)
      .name(metadata.name)
      .group(group.id);

    return `https://${pinataGateway}/ipfs/${upload.cid}`;
  } catch (error) {
    console.error("Error uploading metadata to Pinata:", error);
    throw new Error("Failed to upload metadata");
  }
}