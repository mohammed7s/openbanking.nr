use jwt::JWT;

pub global MAX_JWT_SIZE: u32 = 1536;

fn main(jwt: JWT<MAX_JWT_SIZE>) {
    jwt.verify();
}

