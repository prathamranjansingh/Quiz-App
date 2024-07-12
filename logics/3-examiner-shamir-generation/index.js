const sss = require("shamirs-secret-sharing");

const secret = Buffer.from("Encryption key");
const shares = sss.split(secret, { shares: 10, threshold: 7 });
console.log(shares[0].toString("hex"));
const smallerShares = shares.slice(0, 9);

const recovered = sss.combine(smallerShares);

console.log(shares.map((x) => x.toString("hex")));
console.log(recovered.toString()); // 'Encryption key'
