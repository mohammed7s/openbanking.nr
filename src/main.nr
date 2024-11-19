// use jwt::JWT;
use std::hash::sha256_var;
use bignum::{params::BigNumParams, RuntimeBigNum};
use rsa::{rsa::verify_sha256_pkcs1v15, types::RBN2048};
// // use string_search::{SubString, StringBody};
use base64::BASE64_URL_DECODER;
// use zkemail::partial_hash::partial_sha256_var_end;


pub global MAX_JWT_SIZE: u32 = 1536;
pub global KEY_LIMB_SIZE: u32 = 18;

fn main(
    data: [u8; MAX_JWT_SIZE],
    data_len: u64,
    pubkey_modulus_limbs: [Field; KEY_LIMB_SIZE],
    redc_params_limbs: [Field; KEY_LIMB_SIZE],
    signature_limbs: [Field; KEY_LIMB_SIZE],
) {
    let data_hash = sha256_var(data, data_len);
    let params: BigNumParams<18, 2048> =
            BigNumParams::new(false, pubkey_modulus_limbs, redc_params_limbs);

    let signature: RBN2048 = RuntimeBigNum::from_array(params, signature_limbs);
    // assert(verify_sha256_pkcs1v15(data_hash, signature, 65537));
    // let x = 0;
    // assert(x == 0);
    // jwt.verify();
}

// /**
//  * @brief Struct representing a JWT. Use the init functions to create an instance
//  *        Currently only supports RSA 2048/SHA256 signatures
//  **/
// pub struct JWT<let DATA_LENGTH: u32> {
//     data: BoundedVec<u8, DATA_LENGTH>,
//     pubkey_modulus_limbs: [Field; 18],
//     redc_params_limbs: [Field; 18],
//     signature_limbs: [Field; 18],
// }

// impl<let DATA_LENGTH: u32> JWT<DATA_LENGTH> {
//     /**
//     * @brief Initialize JWT struct
//     *
//     * @param data: Signed JWT data (base64 encoded `$header.$payload`) as byte array of ascii characters
//     * @param pubkey_modulus_limbs: RSA public key modulus limbs (2048-bit split into 18 limbs)
//     * @param redc_params_limbs: RSA reduction parameters limbs (2048-bit split into 18 limbs)
//     * @param signature_limbs: RSA signature limbs (2048-bit split into 18 limbs)
//     **/
//     pub fn init(
//         // data: BoundedVec<u8, DATA_LENGTH>,
//         data: [u8; DATA_LENGTH],
//         data_len: u32,
//         pubkey_modulus_limbs: [Field; 18],
//         redc_params_limbs: [Field; 18],
//         signature_limbs: [Field; 18],
//     ) -> JWT<DATA_LENGTH> {
//         // JWT {
//         //     data,
//         //     pubkey_modulus_limbs,
//         //     redc_params_limbs,
//         //     signature_limbs,
//         // }
//         let data_hash = sha256_var(self.data.storage(), self.data.len() as u64);
//         // let params 
//     }

//     /**
//     * @brief Verify JWT signature with RSA 2048/SHA256
//     **/
//     pub fn verify(self) {
//         // let data_hash = sha256_var(self.data.storage(), self.data.len() as u64);

//         // // Verify RSA signature
        // let params: BigNumParams<18, 2048> =
        //     BigNumParams::new(false, self.pubkey_modulus_limbs, self.redc_params_limbs);

        // let signature: RBN2048 = RuntimeBigNum::from_array(params, self.signature_limbs);

        // assert(verify_sha256_pkcs1v15(data_hash, signature, 65537));
//         let x = 0;
//         assert(x == 0);
//     }
// }