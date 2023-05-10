const readline = require('readline');

const BigNumber = require('bignumber.js');
BigNumber.set({ ROUNDING_MODE: 1 })
const rl = readline.createInterface({
  input: process.stdin
});

const unirest = require('unirest');

let conv = [0, 0, 0]
let curr = false;
const data = [];

rl.on('line', (line) => {
  const arr = line.split(' ');
  if (arr.length == 1) {
    curr = true;
  }
  if (arr.length == 3) {
    for (let i = 0; i < arr.length; i++) {
      conv[i] = BigNumber(arr[i])
    }
  }
  if (arr.length == 4) {
    if (curr) data.push(arr);
    else solve(arr);
  }
});

const solve = (arr) => {
  let c;
  if (arr[2] == 'ETH') c = conv[1];
  else if (arr[2] == 'BTC') c = conv[0];
  else c = conv[2];
  const exp = BigNumber(10).exponentiatedBy(BigNumber(arr[1]));
  const ans = BigNumber(arr[3]).times(exp).times(BigNumber(arr[0])).times(c).dividedBy(conv[1]);
  console.log(ans.dividedBy(exp).toFixed(Number(arr[1])));
}

const getPrice = async () => {
  const btc = await unirest.get('https://api.coincap.io/v2/rates/bitcoin')
    .end(function (res) { 
      if (res.error) throw new Error(res.error); 
      a =  Number(JSON.parse(res.raw_body).data.rateUsd);
      console.log(a)
    });
  const eth = await unirest.get('https://api.coincap.io/v2/rates/ethereum')
    .end(function (res) { 
      if (res.error) throw new Error(res.error); 
      b = Number(JSON.parse(res.raw_body).data.rateUsd);
    });
  const doge = await unirest.get('https://api.coincap.io/v2/rates/dogecoin')
    .end(function (res) { 
      if (res.error) throw new Error(res.error); 
      c = Number(JSON.parse(res.raw_body).data.rateUsd);
    });
  console.log(a,b,c)
}

if (curr) getPrice();