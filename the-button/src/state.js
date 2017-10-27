// web3 is the library used to interact with Ethereum.
import Web3 from 'web3';

const THE_BUTTON_CONTRACT_ABI = [{"constant":true,"inputs":[],"name":"lastPress","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"pressTimes","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"expectLastPress","type":"uint256"}],"name":"press","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"timeLimit","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"timeLimit_","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"pressedBy","type":"address"},{"indexed":false,"name":"time","type":"uint256"}],"name":"ButtonPress","type":"event"}];

function web3Connected(setState) {
  return new Promise((resolve) => {
    let intervalID;

    const checkForConnected = () => {
      if (!web3.isConnected()) {
        setState({error: 'Not connected to Ethereum network'});
      } else {
        setState({error: null});
        clearInterval(intervalID);
        resolve();
      }
    };

    intervalID = setInterval(checkForConnected, 500);
  });;
}

function calculateRemainingTime(lastPress, totalTime) {
  const now = Math.floor(Date.now() / 1000);
  let remainingTime = lastPress + totalTime - now;
  if (remainingTime < 0) {
    remainingTime = 0;
  }
  return remainingTime;
}

function startCountdown(setState) {
  const updateRemainingTime = () => {
    setState(({lastPress, totalTime}) => {
      return {remainingTime: calculateRemainingTime(lastPress, totalTime)};
    });
  };
  setInterval(updateRemainingTime, 100);
}

function watchPresses(setState) {
  const theButton = theButtonContract();
  theButton.ButtonPress({}, {fromBlock: 0}, (err, {args: {time}}) => {
    if (err) {
      console.error(err);
      return;
    }

    setState({lastPress: time.toNumber()});
  });
}

function theButtonContract() {
  const TheButton = web3.eth.contract(THE_BUTTON_CONTRACT_ABI);
  return TheButton.at(window.contractAddress);
}

function transactionConfirmed(txID) {
  return new Promise((resolve, reject) => {
    const filter = web3.eth.filter('latest');
    let returned = false;

    filter.watch((err, blockHash) => {
      if (returned) {
        return;
      }

      if (err) {
        reject(err);
        filter.stopWatching();
        returned = true;
        return;
      }

      web3.eth.getTransactionReceipt(txID, (err, receipt) => {
        if (returned) {
          return;
        }

        if (err) {
          reject(err);
          filter.stopWatching();
          returned = true;
          return;
        }

        if (receipt) {
          resolve();
          filter.stopWatching();
          returned = true;
          return;
        }
      });
    });
  });
}

export async function initialize(setState) {
  // Metamask Chrome extension injects a web3 object into the global data.
  if (typeof window.web3 === 'undefined') {
    setState({error: 'You need to install Metamask, then reload the page'});
    return;
  }

  // Even though there is a global web3 instance, we don't know what version it
  // so we wrap it in our updated web3 library installed with npm.
  window.web3 = new Web3(window.web3.currentProvider);

  await web3Connected(setState);

  try {
    const account = web3.eth.accounts[0];
    if (!account) {
      throw "No Ethereum account connected. You may have to unlock Metamask and reload the page.";
    }

    const theButton = theButtonContract();

    const totalTimePromise = new Promise((resolve, reject) => {
      theButton.timeLimit((err, totalTime) => {
        if (err) return reject(err);
        resolve(totalTime.toNumber());
      });
    });

    const lastPressPromise = new Promise((resolve, reject) => {
      theButton.lastPress((err, lastPress) => {
        if (err) return reject(err);
        resolve(lastPress.toNumber());
      });
    });

    const pressTimePromise = new Promise((resolve, reject) => {
      theButton.pressTimes.call(account, (err, pressTime) => {
        if (err) return reject(err);
        resolve(pressTime.toNumber());
      });
    });

    const [totalTime, lastPress, pressTime] = await Promise.all([
      totalTimePromise, lastPressPromise, pressTimePromise
    ]);

    setState({
      initialized: true,
      contract: theButton,
      account: account,
      pressTime: pressTime,
      lastPress: lastPress,
      totalTime: totalTime,
      remainingTime: calculateRemainingTime(lastPress, totalTime)
    });

    startCountdown(setState);
    watchPresses(setState);
  }
  catch (err) {
    if (err instanceof Error) {
      console.error(err);
      err = `Unexpected error: ${err.message}`;
    }
    setState({error: err});
  }
}

export async function onPress(setState, account, lastPress) {
  const theButton = theButtonContract();

  const txID = await new Promise((resolve, reject) => {
    theButton.press(lastPress, {from: account}, (err, txID) => {
      if (err) return reject(err);
      resolve(txID);
    });
  });

  setState({waiting: true});
  await transactionConfirmed(txID);

  const pressTime = await new Promise((resolve, reject) => {
    theButton.pressTimes.call(account, (err, pressTime) => {
      if (err) return reject(err);
      resolve(pressTime.toNumber());
    });
  });

  if (pressTime === 0) {
    alert("Someone else beat you to it. You can try again when you are ready.");
  }

  setState({pressTime: pressTime, waiting: false});
}
