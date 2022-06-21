
// https://github.com/uzyn/ERC20-TST
const abi = JSON.parse('[{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"unpause","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"account","type":"address"}],"name":"isPauser","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"paused","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"renouncePauser","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"account","type":"address"}],"name":"addPauser","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"pause","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"owner","type":"address"},{"name":"spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"name","type":"string"},{"name":"symbol","type":"string"},{"name":"decimals","type":"uint8"},{"name":"totalSupply","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"account","type":"address"}],"name":"Paused","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"account","type":"address"}],"name":"Unpaused","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"account","type":"address"}],"name":"PauserAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"account","type":"address"}],"name":"PauserRemoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"}]')
const decimals = 18
const tokenSymbol = 'MATIC'
contractInstance = web3.eth.contract(abi).at('0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0');

function displayProviderInfo() {
    document.getElementById("main").innerHTML = 'No compatible wallet provider found. Please install <a target="_blank" href="https://metamask.io/">Metamask</a>.';
}

function startApp() {
    document.getElementById("tokenSymbol").innerHTML = tokenSymbol;
    var account = '';
    var accountInterval = setInterval(function() {
        if (typeof web3.eth.accounts[0] == 'undefined') {
            account = '';
            document.getElementById("address").innerHTML = '';
            document.getElementById("ethBalance").innerHTML = '';
            document.getElementById("tokenBalance").innerHTML = '';
            document.getElementById("transferResult").innerHTML = '';
        } else if (web3.eth.accounts[0] !== account) {
            account = web3.eth.accounts[0];
            document.getElementById("address").innerHTML = account;

            web3.eth.getBalance(account, function (error, result) {
                if (error) {
                    document.getElementById("ethBalance").innerHTML = 'getBalance error: ${err}';
                } else {
                    document.getElementById("ethBalance").innerHTML = web3.fromWei(result);
                }
            });

            contractInstance.balanceOf.call(account, function (error, result) {
                if (error) {
                    document.getElementById("tokenBalance").innerHTML = 'balanceOf error: ${err}';
                } else {
                    document.getElementById("tokenBalance").innerHTML = (result * 10**-decimals) + ' ' + tokenSymbol;
                }
            });
        }
    }, 100);  
}

function transferTokens() {
    document.getElementById("transferResult").innerHTML = '';
    
    var transferValue = document.getElementById("transferValue").value;
    var regex = /[0-9]|\./;
    if(!isNumeric(transferValue)) {
        document.getElementById("transferResult").innerHTML = 'Invalid transfer value';
        return;
    }

    var recipientAddress = document.getElementById("recipientAddress").value;
    if (!recipientAddress.startsWith("0x")) {
        recipientAddress = '0x' + recipientAddress;
    }
    if (!recipientAddress || !web3.isAddress(recipientAddress)) {
        document.getElementById("transferResult").innerHTML = 'Invalid ethereum address';
        return;        
    }

    transferValue = transferValue * 10**decimals;
    contractInstance.transfer(recipientAddress, transferValue, function (error, result) {
        if (error) {
            document.getElementById("transferResult").innerHTML = error;
        } else {
            document.getElementById("transferResult").innerHTML = '<a target="_blank" href="https://etherscan.io/tx/' + result + '">Click to view transaction on etherscan.io</a>';
        }
    });
}

function isNumeric(value) {
    var regex = /[0-9]|\./;
    return regex.test(value);
}
