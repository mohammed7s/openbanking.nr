const crypto = require('crypto');
const fs = require('fs');
const { Noir } = require('@noir-lang/noir_js');
const circuit = require("../../target/jwt_test.json");
const paymentPayload = require("./data.json");
const NoirBignum = require('@mach-34/noir-bignum-paramgen');
const MAX_JWT_SIZE = 1536;

/**
 * Given a claim (?) from a JWT, generate a JWS signature over the claim
 * @param {*} payload 
 * @returns 
 */
async function generateJWSSignature(payload, privateKey) {
    try {
        // Base64URL encode header and payload
        const base64Data = (typeof payload === 'string' && isBase64(payload))
            ? data
            : Buffer.from(JSON.stringify(payload)).toString('base64');

        // Convert base64 to ArrayBuffer for signing
        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(base64Data);


        // Sign the data
        const signature = await crypto.subtle.sign(
            {
                name: "RSASSA-PKCS1-v1_5",
                saltLength: 32,
            },
            privateKey,
            dataBuffer
        );

        // Return complete JWS
        let sig = BigInt(`0x${Buffer.from(signature).toString('hex')}`);
        return { data: toBoundedVec(Buffer.from(dataBuffer)), signature: NoirBignum.bnToLimbStrArray(sig) };
    } catch (error) {
        console.error('Error generating JWS signature:', error);
        throw error;
    }
}

async function newRSAKey() {
    return await crypto.subtle.generateKey(
        {
            name: "RSASSA-PKCS1-v1_5",
            modulusLength: 2048,
            publicExponent: new Uint8Array([0x01, 0x00, 0x01]), // 65537
            hash: "SHA-256",
        },
        true, // extractable
        ["sign", "verify"]
    );
}

async function pubkeyFromKeypair(keyPair) {
    const pubkey = await crypto.subtle.exportKey("jwk", keyPair.publicKey)
    const modulus = bytesToBigInt(base64UrlToBytes(pubkey.n));
    return {
        modulus: NoirBignum.bnToLimbStrArray(modulus),
        redc: NoirBignum.bnToRedcLimbStrArray(modulus)
    }
}

function base64UrlToBytes(base64Url) {
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const padding = '='.repeat((4 - base64.length % 4) % 4);
    const base64Padded = base64 + padding;
    return Uint8Array.from(atob(base64Padded), c => c.charCodeAt(0));
}

function bytesToBigInt(bytes) {
    let hex = Array.from(bytes)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    return BigInt('0x' + hex);
}

function toBoundedVec(data, maxLength) {
    let length = maxLength === undefined
        ? MAX_JWT_SIZE
        : maxLength;
    if (data.length > length) {
        throw new Error(`Data exceeds maximum length of ${length} bytes`);
    }
    data = Array.from(data);
    const storage = data.concat(Array(length - data.length).fill(0)).map(byte => byte.toString());
    return { storage, len: data.length.toString() }

}

async function generateNoirInputs(payload, keypair) {
    const { data, signature } = await generateJWSSignature(payload, keypair.privateKey);
    const pubkey = await pubkeyFromKeypair(keypair);
    return {
        // data,
        data: data.storage,
        data_len: data.len,
        pubkey_modulus_limbs: pubkey.modulus,
        redc_params_limbs: pubkey.redc,
        signature_limbs: signature,
        // // partial_hash: ["0", "0", "0", "0", "0", "0", "0", "0"],
        // full_data_length: data.len,
        // is_partial_hash: "0"
    }
}

async function execute(inputs) {
    const noir = new Noir(circuit);
    return await noir.execute(inputs);
}

// console.log(generateJWSSignature(paymentPayload));

async function main() {
    // const inputs = generateNoirInputs(paymentPayload);
    // const { witness, returnValue } = await execute({ jwt: inputs });
    // console.log("inp len", inputs.redc_params_limbs.length)
    // console.log("success :)")

    const key = await newRSAKey();
    const inputs = await generateNoirInputs(paymentPayload, key);
    console.log()
    const { witness, returnValue } = await execute(inputs)
}

main()