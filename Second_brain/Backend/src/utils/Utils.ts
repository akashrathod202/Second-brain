import crypto from "crypto";

function generateHash(){
    return crypto.randomBytes(16).toString("hex")
}

export default generateHash