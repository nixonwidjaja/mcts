const readline = require('readline');

const BigNumber = require('bignumber.js');
BigNumber.set({ ROUNDING_MODE: 1 })
const rl = readline.createInterface({
  input: process.stdin
});

let data = [];

rl.on('line', (line) => {
  const arr = line.split(' ');
  data.push(arr);
});

const solve = (arr, conv) => {
  let c;
  if (arr[2] == 'ETH') c = conv[1];
  else if (arr[2] == 'BTC') c = conv[0];
  else c = conv[2];
  const exp = BigNumber(10).exponentiatedBy(BigNumber(arr[1]));
  const ans = BigNumber(arr[3]).times(exp).times(BigNumber(arr[0])).times(c).dividedBy(conv[1]);
  console.log(ans.dividedBy(exp).toFixed(Number(arr[1])));
}

const getPrice = async () => {
  const btc = (await fetch('https://api.coincap.io/v2/rates/bitcoin')).json()
  const eth = (await fetch('https://api.coincap.io/v2/rates/ethereum')).json()
  const doge = (await fetch('https://api.coincap.io/v2/rates/dogecoin')).json()
  let conv = await Promise.all([btc, eth, doge])
  conv = conv.map(x => x.data.rateUsd)
  for (let i = 0; i < data.length; i++) {
    const arr = data[i];
    if (arr.length == 3) {
      for (let i = 0; i < arr.length; i++) {
        conv[i] = BigNumber(arr[i])
      }
    }
    if (arr.length == 4) solve(arr, conv);
  };
}

getPrice();