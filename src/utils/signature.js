import crypto from 'crypto';

export default class {
  constructor(publicKey, privateKey) {
    this.privateKey = publicKey;
    this.privateKey = privateKey;
  }

  verify = (input) => {
    const signer = crypto.createSign('sha256');
    signer.update(input);
    const sign = signer.sign(this.privateKey, 'base64');

    const verifier = crypto.createVerify('sha256');
    verifier.update(input);
    return verifier.verify(this.publicKey, sign, 'base64');
  };
}
