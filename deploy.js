const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');


const provider = new HDWalletProvider(
  'analyst upset yard cannon neither return rally idea kitten turtle kitten device',
  'https://rinkeby.infura.io/4GmvurAJpAXENhCclUpY'
);
const web3 = new Web3(provider);// completely access with rik// test network // send ether,deploy contarct,update contract

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0])

  const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode })// in lottery function constructore we donot have any any arguments so we remove arguments here
    .send({ gas: '1000000', from: accounts[0] })
  // result is instance of contract
  // we make sure to save the address of contract that we deploy
  console.log(interface)
  console.log('Contract deployed to: ', result.options.address)
}
deploy();
  