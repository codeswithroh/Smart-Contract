import React, { useState } from "react";
import "./App.css";
import NotFound from "./assets/notfound.svg";
import axios from "axios";
import { Circles } from "react-loader-spinner";
import { useMetaMask } from "metamask-react";

function App() {
  const { status, connect, account, chainId, ethereum } = useMetaMask();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [quantity, setQuantity] = useState(1);

  const checkWalletInDB = async (walletAddress) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:5002/api/wallet?address=${walletAddress}`
      );
      return response.data;
    } catch (error) {
      console.error("Error checking wallet in DB:", error);
      return false;
    }
  };

  const handleMint = async () => {
    try {
      setLoading(true);
      setMessage("Checking wallet in the database...");

      const walletPresent = await checkWalletInDB(account);

      if (walletPresent) {
        setMessage("Wallet found in the database!");
        setMessage("Performing private mint...");
        await privateMint(quantity);
      } else {
        setMessage("Wallet not found in the database!");
        setMessage("Performing mint...");
        await mint(quantity);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error handling mint:", error);
      setMessage("Failed to handle mint.");
      setLoading(false);
    }
  };

  const mint = async (quantity) => {
    try {
      const valueWei = (0.002 * 1e18 * quantity).toString();

      const response = await ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: account,
            to: "0xfb132d7fecfdc01771c6897f04b81f75a28737fb",
            data: "0xF2",
            gasPrice: "0x4A817C800",
            gas: "0x15F90",
            value: "0x" + parseInt(valueWei).toString(16),
          },
        ],
      });

      if (response) {
        setMessage("Mint successful!");
      } else {
        setMessage("Mint failed!");
      }

      setLoading(false);
    } catch (error) {
      console.error("Error during mint:", error);
      setMessage("Failed to mint.");
      setLoading(false);
    }
  };

  const privateMint = async (quantity) => {
    try {
      const valueWei = (0.001 * 1e18 * quantity).toString();

      const contractAddress = "0xfb132d7fecfdc01771c6897f04b81f75a28737fb";

      const response = await ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: ethereum.selectedAddress,
            to: contractAddress,
            data: `0xa9059cbb${ethereum.selectedAddress
              .slice(2)
              .padStart(64, "0")}${quantity.toString(16).padStart(64, "0")}`,
            gasPrice: "0x4A817C800",
            gas: "0x15F90",
            value: "0x" + parseInt(valueWei).toString(16),
          },
        ],
      });

      if (response) {
        setMessage("Private mint successful!");
      } else {
        setMessage("Private mint failed!");
      }

      setLoading(false);
    } catch (error) {
      console.error("Error during private mint:", error);
      setMessage("Failed to perform private mint.");
      setLoading(false);
    }
  };

  const renderStatusComponent = (status, connect) => {
    switch (status) {
      case "initializing":
        return (
          <div className="status-card">
            Synchronisation with MetaMask ongoing...
          </div>
        );
      case "unavailable":
        return <div className="status-card">MetaMask not available</div>;
      case "notConnected":
        return null;
      case "connecting":
        return <div className="status-card">Connecting...</div>;
      case "connected":
        return (
          <div className="status-card">
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: "green",
                marginRight: "1rem",
                animation: "throbbing 1s infinite alternate",
              }}
            ></div>
            <div>
              Connected account {account} on chain ID {chainId}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="App">
      <div className="App-header">
        <h2>Mint NFTs</h2>
        {renderStatusComponent(status, connect)}
        {loading && (
          <Circles
            height="80"
            width="80"
            color="#4fa94d"
            ariaLabel="circles-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        )}
        {!loading && message && (
          <div className="message-card">
            <p>{message}</p>
          </div>
        )}

        <>
          {status === "notConnected" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: "1em",
              }}
            >
              <img src={NotFound} alt="not found" />
              <button
                style={{
                  backgroundColor: "#FF8C00",
                  height: "2.5em",
                  width: "10em",
                  padding: "0.6rem",
                  fontSize: "1.5rem",
                }}
                onClick={connect}
              >
                Connect MetaMask
              </button>
            </div>
          )}
          {status === "connected" && !loading && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "2rem",
                gap: "1rem",
              }}
            >
              <input
                type="number"
                placeholder="Enter Quantity Here"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
              <button onClick={handleMint} disabled={quantity <= 0}>
                Mint
              </button>
            </div>
          )}
        </>
      </div>
    </div>
  );
}

export default App;
