# Openbanking.nr 

A library for proving Open Banking payment flows (v.3.1.2)

## Overview
Payments in the openbanking standard are signed by the bank using JWS format. A proof of computation over the private payment data can prove to a smart contract verifier an offchain bank-bank payment with selective disclosure of the raw private data. For more detaails about openbanking check [openbanking.md](openbanking.md)


## Donate
Openbanking.nr is an open-source library. Current maintainers are [Jack](https://x.com/jp4g_), [Ian](https://github.com/Ian-Bright) and [Mohammed](https://x.com/m38mah). 

The donation address is 0xFa37AcfC5b72e2E825c6e2201224b86E496424D3 on Ethereum
This address is 2 of 3 multisig [wallet](https://app.safe.global/home?safe=eth:0xFa37AcfC5b72e2E825c6e2201224b86E496424D3) with keys held by the maintainers. Funds received will go towards funding maintenance and development of the library based on roadmap. 

Thank you for donating and supporting the project!

## Roadmap 

### Technical components 

[ ] Integrate PS256 signatures   
[ ] Test signature verification with OB data  
[ ] Certificate chain verification to OB root CA   
[ ] Example Escrow contract on Aztec network   

### Payment types implementation v3.1.2

##### Domestic Payments 
- [ ] Single immediate payments  
- [ ] Scheduled payments
- [ ] Standing orders
- [ ] Bulk payments

##### International Payments
 - [ ] Single immediate payments
 - [ ] FX rate validation
 - [ ] Cross-border rules compliance
 - [ ] Charge bearer verification


## License

OpenBanking.nr is released under the MIT License. See [LICENSE](LICENSE) for the full license text.