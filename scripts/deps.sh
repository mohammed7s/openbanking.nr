#!/bin/bash


cd ..

rm -rf noir-jwt noir_string_search

git clone https://github.com/olehmisar/noir_string_search.git --single-branch

git clone https://github.com/zkemail/noir-jwt.git --single-branch

# if ur on mac get fuked (update dep manually in ../noir-jwt/Nargo.toml)

sed -i 's|git = "https://github.com/olehmisar/noir_string_search", tag = "v0.3.0"|path = "../noir_string_search"|g' \
    ./noir-jwt/Nargo.toml
