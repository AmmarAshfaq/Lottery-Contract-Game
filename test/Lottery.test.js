const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const { interface, bytecode } = require('../compile');

let lottery;
let accounts;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  lottery = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode })
    .send({ from: accounts[0], gas: '1000000' })
})


describe('Lottery Contract', () => {
  it('deploys a contract', () => {
    assert.ok(lottery.options.address);
  })

  it('allows one account to enter', async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('0.02', 'ether')//units of ether converted in some ammount of wei
    });
    const players = await lottery.methods.getPlayers().call({
      from: accounts[0]
    });
    assert.equal(accounts[0], players[0]);//  enter account is equal to players in array
    assert.equal(1, players.length);// atleast one account
  })
  it('allows multiple accounts to enter', async () => {// we write it bcs if one account is fail then another account is fail also

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('0.02', 'ether')//units of ether converted in some ammount of wei
    });
    await lottery.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei('0.02', 'ether')//units of ether converted in some ammount of wei
    });
    await lottery.methods.enter().send({
      from: accounts[2],
      value: web3.utils.toWei('0.02', 'ether')//units of ether converted in some ammount of wei
    });
    const players = await lottery.methods.getPlayers().call({
      from: accounts[0]
    });
    assert.equal(accounts[0], players[0]);//  enter account is equal to players in array
    assert.equal(accounts[1], players[1]);//  enter account is equal to players in array
    assert.equal(accounts[2], players[2]);//  enter account is equal to players in array

    assert.equal(3, players.length);// atleast one account
  })
  it('requires a minimum amount of ether to ether', async () => {// send some amount of ether
    try {
      await lottery.methods.enter().send({
        from: accounts[0],
        value: 0
      });
      assert(false);// 100% assure that test is fail we immidiately assert a failaing assertion agfter the await// this is going to fail no matter was
    } catch (err) {
      assert(err);// ok means some value is pass into the functions// not use ok we use assert for truthyness// unlike ok is check for existence
    }
  });
  it('only manager can call a pickWinner', async () => {
    try {
      await lottery.methods.pickWinner().send({
        from: accounts[1]
      })
      assert(false);// if we get this line of code it's automatically fail
    } catch (err) {
      assert(err);
    }
  });
  // if we are going to pick a winner than we see every person accounts of money it take lots of code
  // but in here we only enter one player to pick winner
  it('sent money to the winner and resets the players array', async () => {
    // enter one player in our contracts
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('2', 'ether')
    });

    //retrive  amount of contract before and after  // amount of ether that account of 0 control // before and ater calling a pick winner functions
    const initialBalance = await web3.eth.getBalance(accounts[0]);// this is the function that amount of ether in units of wei that given account control
    /// getBalanvce is used either our own account which we used to an external accounts
    // it can also used the retrive  balance of the contract
    // you can send any acoount of address in theri paarameter to get the balance of the account he have // you through any address you want into the function// return amount of address that you assign to that adress


    // know we pick a winner in our contract
    // make sure await key bcs all are async request
    await lottery.methods.pickWinner().send({ from: accounts[0] });


    // differnce btw initialBalance and finalBalance is not equal // bcs any time we have to transaction in our network we have to pay some amount of //slightly less than 2 ether
    const finalBalance = await web3.eth.getBalance(accounts[0]);

    const differnce = finalBalance - initialBalance;
    console.log(finalBalance - initialBalance);
    assert(differnce > web3.utils.toWei('1.8', 'ether'));

  })

})
