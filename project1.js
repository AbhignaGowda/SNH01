let scanner = null;

  if (typeof remixWeb3 !== 'undefined') {
      web3 = new Web3(remixWeb3);
      console.log('Connected to Remix provider.');
    } 

    // ABI and contract address of the Solidity smart contract (Replace with your contract)
    const contractABI = [
  {
   "inputs": [
    {
     "internalType": "string",
     "name": "productId",
     "type": "string"
    },
    {
     "internalType": "string",
     "name": "origin",
     "type": "string"
    },
    {
     "internalType": "string",
     "name": "productionDate",
     "type": "string"
    },
    {
     "internalType": "string",
     "name": "ingredients",
     "type": "string"
    }
   ],
   "name": "storeProductInfo",
   "outputs": [],
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "inputs": [
    {
     "internalType": "string",
     "name": "productId",
     "type": "string"
    },
    {
     "internalType": "string",
     "name": "location",
     "type": "string"
    },
    {
     "internalType": "uint256",
     "name": "timestamp",
     "type": "uint256"
    },
    {
     "internalType": "string",
     "name": "reason",
     "type": "string"
    }
   ],
   "name": "updateProductStatus",
   "outputs": [],
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "inputs": [],
   "name": "getCurrentTimeStamp",
   "outputs": [
    {
     "internalType": "uint256",
     "name": "",
     "type": "uint256"
    }
   ],
   "stateMutability": "view",
   "type": "function"
  },
  {
   "inputs": [
    {
     "internalType": "string",
     "name": "productId",
     "type": "string"
    }
   ],
   "name": "getProductInfo",
   "outputs": [
    {
     "internalType": "string",
     "name": "",
     "type": "string"
    },
    {
     "internalType": "string",
     "name": "",
     "type": "string"
    },
    {
     "internalType": "string",
     "name": "",
     "type": "string"
    },
    {
     "internalType": "string",
     "name": "",
     "type": "string"
    },
    {
     "internalType": "uint256",
     "name": "",
     "type": "uint256"
    },
    {
     "internalType": "string",
     "name": "",
     "type": "string"
    }
   ],
   "stateMutability": "view",
   "type": "function"
  }
];
    const contractAddress = '0xf8e81D47203A594245E36C48e151709F0C19fBe8'; // Replace with your contract address

    // Load the contract
    const contract = new web3.eth.Contract(contractABI, contractAddress);

    // Function to store product information on the blockchain
    async function storeProductInfo() {
    const productId = document.getElementById('productId').value;
      const origin = document.getElementById('origin').value;
      const productionDate = document.getElementById('productionDate').value;
      const ingredients = document.getElementById('ingredients').value;

      // Send transaction to the smart contract to store product information
      await contract.methods.storeProductInfo(productId, origin, productionDate, ingredients).send({ from: web3.eth.defaultAccount });
      alert('Product information stored on the blockchain!');
    }

    // Function to track product movement
    async function getProductInfo() {
        const productId = document.getElementById('trackProductId').value;

// Call the smart contract method to retrieve product information
const productInfo = await contract.methods.getProductInfo(productId).call();
if (productInfo) {
  const { origin, productionDate, ingredients, location, timestamp, reason } = productInfo;
  alert(`Product ID: ${productId}\nOrigin: ${origin}\nProduction Date: ${productionDate}\nIngredients: ${ingredients}\nLocation: ${location}\nTimestamp: ${timestamp}\nReason: ${reason}`);
} else {
  alert('Product information not found!');
}
    }

    // Function to start scanning
    function startScanning() {
      scanner = new Instascan.Scanner({ video: document.getElementById('preview') });

      Instascan.Camera.getCameras().then(cameras => {
        if (cameras.length > 0) {
          scanner.start(cameras[0]);
        } else {
          console.error('No cameras found');
        }
      }).catch(err => {
        console.error(err);
      });

      // Listen for scanned content
      scanner.addListener('scan', function(content) {
        document.getElementById('scannedContent').innerText = content;
        document.getElementById('productId').value = content; // Set scanned content as Product ID
      });
    }

    // Function to stop scanning
    function stopScanning() {
      if (scanner !== null) {
        scanner.stop();
      } else {
        console.error('Scanner not initialized');
      }
    }
    