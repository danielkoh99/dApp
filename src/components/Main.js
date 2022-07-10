import React, { useState } from "react";
import dai from "../dai.png";
export default function Main({
  dappBalance,
  daiBalance,
  stakingBalance,
  stakeTokens,
  unstakeTokens,
}) {
  const [inputText, setInputText] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [errMsg, setErrMsg] = useState("");
  const handleInput = e => {
    if (isNaN(e.target.value)) {
      setIsValid(false);
      setErrMsg("Input value must be a number");
    } else {
      setInputText(e.target.value);
      setIsValid(true);
    }
    if (
      parseInt(e.target.value) >
      parseInt(window.web3.utils.fromWei(daiBalance, "Ether"))
    ) {
      setIsValid(false);
      setErrMsg("Entered amount exceeds balance");
    }
  };
  const handleSubmit = e => {
    e.preventDefault();
    let amount = inputText.toString();
    amount = window.web3.utils.toWei(amount, "Ether");
    stakeTokens(amount);
  };
  return (
    <div id="content" className="mt-3">
      <table className="table table-borderless text-muted text-center">
        <thead>
          <tr itemScope="col">
            <th>Staking balance</th>
            <th>Reward balance</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{window.web3.utils.fromWei(stakingBalance)}mDAI</td>
            <td>{window.web3.utils.fromWei(dappBalance)}DAPP</td>
          </tr>
        </tbody>
      </table>
      <div className="card mb-4">
        <div className="card-body">
          <form className="mb-3" onSubmit={handleSubmit}>
            <div>
              <label className="float-start">
                <b>Stake Tokens</b>
              </label>
              <span className="float-end text-muted">
                Balance: {window.web3.utils.fromWei(daiBalance, "Ether")}ETH
              </span>
            </div>
            <div className="input-group mb-4">
              <input
                type="text"
                className={
                  isValid
                    ? "form-control form-control-lg"
                    : "border border-danger form-control form-control-lg"
                }
                placeholder="0"
                onChange={handleInput}
                required
              />
              <div className="input-group-append">
                <div className="input-group-text">
                  <img src={dai} height="32" alt="" />
                  &nbsp;&nbsp;&nbsp; mDAI
                </div>
              </div>
            </div>
            <div>{!isValid ? <p className="text-danger">{errMsg}</p> : ""}</div>
            <div className="d-grid gap-2 d-md-block">
              <button
                disabled={isValid ? false : true}
                type="submit"
                className="btn btn-primary btn-lg btn-block"
              >
                STAKE!
              </button>
            </div>
          </form>
          <button
            type="submit"
            className="btn btn-link btn-block btn-sm"
            onClick={event => {
              event.preventDefault();
              unstakeTokens();
            }}
          >
            UN-STAKE...
          </button>
        </div>
        {inputText}
      </div>
    </div>
  );
}
