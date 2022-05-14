const main = async () => {
    const [owner, randomPerson1,randomPerson2] = await hre.ethers.getSigners();
    const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
    const waveContract = await waveContractFactory.deploy({
      value: hre.ethers.utils.parseEther("0.1"),
    });
    await waveContract.deployed();
  
    console.log("Contract deployed to:", waveContract.address);
    console.log("Contract deployed by:", owner.address);
  
    let contractBalance = await hre.ethers.provider.getBalance(
      waveContract.address
    );
    console.log(
      "Contract balance:",
      hre.ethers.utils.formatEther(contractBalance)
    );

    let waveCount;
  
    let waveTxn = await waveContract.wave("This is wave 1");
    await waveTxn.wait();    

    waveTxn = await waveContract.connect(randomPerson1).wave("This is wave 2");
    await waveTxn.wait();
  
    waveCount = await waveContract.getTotalWaves();

    contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
    console.log(
      "Contract balance:",
      hre.ethers.utils.formatEther(contractBalance)
    );

    let allWaves = await waveContract.getAllWaves();
    console.log(allWaves);

  };
  
  const runMain = async () => {
    try {
      await main();
      process.exit(0);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  };
  
  runMain();