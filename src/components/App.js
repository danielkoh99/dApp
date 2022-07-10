import React, { useState, useEffect, useCallback } from "react";
import Navbar from "./Navbar";
import "./App.css";
import Web3 from "web3";
import DaiToken from "../abis/DaiToken.json";
import DappToken from "../abis/DappToken.json";
import TokenFarm from "../abis/TokenFarm.json";
import Main from "./Main";
const App = () => {
  const [account, setAccount] = useState("0x0");
  const [daiTokenData, setDaiTokenData] = useState({});
  const [dappTokenData, setDappTokenData] = useState({});
  const [tokenFarmData, setTokenFarmData] = useState({});
  const [stakingBalance, setStakingBalance] = useState("0");
  const [dappBalance, setDappBalance] = useState("0");
  const [daiBalance, setDaiBalance] = useState("0");
  const [loading, setloading] = useState(true);

  const ethEnabled = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else {
      alert("eth not available, download metamask or brave");
    }
  };
  const stakeTokens = amount => {
    setloading(true);
    daiTokenData.methods
      .approve(tokenFarmData._address, amount)
      .send({ from: account })
      .on("transactionHash", hash => {
        tokenFarmData.methods
          .stakeTokens(amount)
          .send({ from: account })
          .on("transactionHash", hash => {
            setloading(false);
            window.location.reload(false);
          });
      });
  };
  const unstakeTokens = amount => {
    setloading(true);
    tokenFarmData.methods
      .unstakeTokens()
      .send({ from: account })
      .on("transactionHash", hash => {
        setloading(false);
        window.location.reload(false);
      });
  };
  useEffect(() => {
    const loadBlockChainData = async () => {
      let web3 = window.web3;

      const userAccounts = await web3.eth.getAccounts();
      setAccount(userAccounts[0]);
      // Get network ID
      const networkID = await web3.eth.net.getId();
      // load daitoken
      const daiTokenData = DaiToken.networks[networkID];
      console.log(daiTokenData.address);
      if (daiTokenData) {
        const daiToken = await new web3.eth.Contract(
          DaiToken.abi,
          daiTokenData.address
        );
        setDaiTokenData(daiToken);
        let daiTokenBalance = await daiToken.methods.balanceOf(account).call();
        setDaiBalance(daiTokenBalance.toString());
      } else {
        alert("Daitoken contract not deployed to network");
      }

      // load dapptoken
      const dappTokenData = DappToken.networks[networkID];
      console.log(dappTokenData.address);

      if (dappTokenData) {
        const dappToken = await new web3.eth.Contract(
          DappToken.abi,
          dappTokenData.address
        );
        setDappTokenData(dappToken);
        let dappTokenBalance = await dappToken.methods
          .balanceOf(account)
          .call();
        setDappBalance(dappTokenBalance.toString());
      } else {
        alert("dappToken contract not deployed to network");
      }
      // load tokenfarm
      const tokenFarmData = TokenFarm.networks[networkID];
      if (tokenFarmData) {
        const tokenFarm = await new web3.eth.Contract(
          TokenFarm.abi,
          tokenFarmData.address
        );

        setTokenFarmData(tokenFarm);
        let stakingBalance = await tokenFarm.methods
          .stakingBalance(account)
          .call();
        setStakingBalance(stakingBalance.toString());
      } else {
        alert("tokenFarm contract not deployed to network");
      }
      setloading(false);
    };
    ethEnabled();
    loadBlockChainData();
  }, [account]);

  return (
    <div>
      {loading ? (
        <div className="d-flex justify-content-center">
          <div
            className="spinner-border"
            style={{ width: "3rem", height: "3rem" }}
            role="status"
          >
            <span className="sr-only"></span>
          </div>
        </div>
      ) : (
        <>
          <Navbar account={account} />
          <div className="container-fluid mt-5">
            <div className="row">
              <main
                role="main"
                className="col-lg-12 mx-auto"
                style={{ maxWidth: "600px" }}
              >
                <div className="content mr-auto ml-auto">
                  <Main
                    stakeTokens={stakeTokens}
                    unstakeTokens={unstakeTokens}
                    dappBalance={dappBalance}
                    daiBalance={daiBalance}
                    stakingBalance={stakingBalance}
                  />
                </div>
              </main>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
