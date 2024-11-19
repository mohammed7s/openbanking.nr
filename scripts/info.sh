#!/bin/bash

cd ../target

bb gates -b jwt_test.json | grep "circuit"