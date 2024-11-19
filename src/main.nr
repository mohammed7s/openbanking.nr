use jwt::JWT;

pub global MAX_JWT_SIZE: u32 = 1536;
pub global KEY_LIMB_SIZE: u32 = 18;

fn main(
    data: BoundedVec<u8, MAX_JWT_SIZE>,
    pubkey_modulus_limbs: [Field; KEY_LIMB_SIZE],
    redc_params_limbs: [Field; KEY_LIMB_SIZE],
    signature_limbs: [Field; KEY_LIMB_SIZE],
) {
    let json_web_token: JWT<MAX_JWT_SIZE> = JWT::init(
        data,
        0, // offset is 0 for no partial hash probably?
        pubkey_modulus_limbs,
        redc_params_limbs,
        signature_limbs
    );
    // let x = 0;
    // assert(x == 0);
    jwt.verify();
}

