import bcrypt from "bcrypt";

const saltRounds = 8

export const genHash = async (password: string) => {
    const hash = await bcrypt.hash(password, saltRounds)
    return hash
}

export const compareHash = async (hash: string, encrypted: string) => {
    const isCompare = await bcrypt.compare(hash, encrypted)
    return isCompare
}