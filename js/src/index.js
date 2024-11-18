const crypto = require('crypto');
const fs = require('fs');
const { Noir } = require('@noir-lang/noir_js');
const circuit = require("../../target/jwt_test.json");
const paymentPayload = require("./data.json");
const privateKeyPEM = fs.readFileSync('./keys/private.key', 'utf-8');
const NoirBignum = require('@mach-34/noir-bignum-paramgen');
const MAX_JWT_SIZE = 1536;

/**
 * Given a claim (?) from a JWT, generate a JWS signature over the claim
 * @param {*} payload 
 * @returns 
 */
function generateJWSSignature(payload) {
    try {
        const header = {
            alg: "RS256",
            kid: "2kiXQyo0tedjW2somjSgH7",
            crit: ["http://openbanking.org.uk/tan"],
            "http://openbanking.org.uk/tan": process.env.JWKS_ROOT_DOMAIN
        };
        // Base64URL encode header and payload

        const encodedPayload = Buffer.from(JSON.stringify(payload))
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '');

        // Read private key

        // Create signature using PS256 (SHA-256 with PSS padding)
        const signature = BigInt(`0x${crypto.sign(
            'sha256',
            Buffer.from(encodedPayload, 'utf-8'),
            { key: privateKeyPEM }
        ).toString('hex')}`);

        // Return complete JWS
        return { data: toBoundedVec(encodedPayload), signature: NoirBignum.bnToLimbStrArray(signature) };
    } catch (error) {
        console.error('Error generating JWS signature:', error);
        throw error;
    }
}

function pubkeyFromCert() {
    const privateKey = crypto.createPrivateKey(privateKeyPEM);
    const publicKey = crypto.createPublicKey(privateKey);
    const publicKeyDer = publicKey.export({ type: 'spki', format: 'der' });
    const pubkeyBigint = BigInt(`0x${publicKeyDer.toString('hex')}`);
    console.log("p", pubkeyBigint.toString(2).length);
    return {
        modulus: NoirBignum.bnToLimbStrArray(pubkeyBigint).slice(0, 18),
        redc: NoirBignum.bnToRedcLimbStrArray(pubkeyBigint).slice(0, 18)
    }
}

function toBoundedVec(data, maxLength) {
    let length = maxLength === undefined
        ? MAX_JWT_SIZE
        : maxLength;
    if (data.length > length) {
        throw new Error(`Data exceeds maximum length of ${length} bytes`);
    }
    data = Array.from(Buffer.from(data, 'utf-8'));
    const storage = data.concat(Array(length - data.length).fill(0)).map(byte => byte.toString());
    return { storage, len: data.length.toString()}
    
}

function generateNoirInputs(payload) {
    const { data, signature } = generateJWSSignature(paymentPayload);
    const pubkey = pubkeyFromCert();
    const base64Offset = "0";
    return {
        data,
        b64_offset: base64Offset,
        pubkey_modulus_limbs: pubkey.modulus,
        redc_params_limbs: pubkey.redc,
        signature_limbs: signature,
        partial_hash: ["0", "0", "0", "0", "0", "0", "0", "0"],
        full_data_length: data.len,
        is_partial_hash: "0"
    }
}

async function execute(inputs) {
    const noir = new Noir(circuit);
    return await noir.execute(inputs);
}

// console.log(generateJWSSignature(paymentPayload));

async function main() {
    const inputs = generateNoirInputs(paymentPayload);
    const { witness, returnValue } = await execute({ jwt: inputs });
    console.log("inp len", inputs.redc_params_limbs.length)
    console.log("success :)")
}

main()