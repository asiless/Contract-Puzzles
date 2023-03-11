const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { assert } = require('chai');

describe('Game5', function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory('Game5');
    const game = await Game.deploy();
    return { game };
  }
  async function getAddress(){
    const threshold = 0x00FfFFfFFFfFFFFFfFfFfffFFFfffFfFffFfFFFf;
    const signer = ethers.provider.getSigner(0);

    while(true){
      const wallet = ethers.Wallet.createRandom().connect(ethers.provider);
      const address = await wallet.getAddress();

      if(address<threshold){
        await signer.sendTransaction({
          to: address,
          value: ethers.utils.parseEther("1.0"), // Sends exactly 1.0 ether
        });
        return wallet
      }
    }
  }
  it('should be a winner', async function () {
    const { game } = await loadFixture(deployContractAndSetVariables);
    const wallet = await getAddress();

    await game.connect(wallet).win();
    // leave this assertion as-is
    assert(await game.isWon(), 'You did not win the game');
  });
});
