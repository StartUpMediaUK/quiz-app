import { v4 as uuidv4 } from "uuid";

export function isUUID(str: string) {
  return /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/.test(str);
}
export function GenerateUUID() {
  const uuid = uuidv4()
  return uuid
}