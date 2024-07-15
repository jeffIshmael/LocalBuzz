const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("LocalBuzz", function () {
    let LocalBuzz;
    let localBuzz;
    let cUSDToken;
    let owner;
    let addr1;
    let addr2;

    before(async function () {
        [owner, addr1, addr2] = await ethers.getSigners();

        LocalBuzz = await ethers.getContractFactory("LocalBuzz");
        localBuzz = await LocalBuzz.deploy();
        await localBuzz.deployed();
    });

    it("Should register a client", async function () {
        await expect(localBuzz.connect(addr1).registerClient("ClientUser", "client@example.com"))
            .to.emit(localBuzz, "clientRegistered")
            .withArgs(0, "ClientUser", "client@example.com", addr1.address, [], 0);
        
        const client = await localBuzz.getClient(addr1.address);
        expect(client.username).to.equal("ClientUser");
    });

    it("Should register a content creator", async function () {
        await expect(localBuzz.connect(addr2).registerContentCreator(
            "FullName", "CreatorUser", "Bio", "instaLink", "fbLink", "liLink", "twLink", "tkLink", "creator@example.com"))
            .to.emit(localBuzz, "contentCreatorRegistered")
            .withArgs(0, "FullName", "CreatorUser", "Bio", "instaLink", "fbLink", "liLink", "twLink", "tkLink", [], addr2.address, "creator@example.com");
        
        const creator = await localBuzz.getContentCreator(addr2.address);
        expect(creator.username).to.equal("CreatorUser");
    });

    it("Should create a package", async function () {
        await localBuzz.connect(addr2).registerContentCreator(
            "FullName", "CreatorUser2", "Bio", "instaLink", "fbLink", "liLink", "twLink", "tkLink", "creator2@example.com");
        
        await expect(localBuzz.connect(addr2).createPackage("Package1", "Instagram", "Description1", 24, 100))
            .to.emit(localBuzz, "packageCreated")
            .withArgs(0, "Package1", "Instagram", "Description1", 24, 100, addr2.address, []);
        
        const package = await localBuzz.getPackages([0]);
        expect(package[0].name).to.equal("Package1");
    });

    it("Should purchase a package", async function () {
        // Transfer some cUSD to addr1
        await cUSDToken.transfer(addr1.address, ethers.utils.parseUnits("1000", 18));

        // Approve LocalBuzz contract to spend cUSD
        await cUSDToken.connect(addr1).approve(localBuzz.address, ethers.utils.parseUnits("100", 18));

        await expect(localBuzz.connect(addr1).purchasePackage(0))
            .to.emit(localBuzz, "packagePurchased")
            .withArgs(0, addr1.address, 100);

        const client = await localBuzz.getClient(addr1.address);
        expect(client.purchasedIds[0]).to.equal(0);

        const package = await localBuzz.getPackages([0]);
        expect(package[0].buyers[0]).to.equal(addr1.address);
    });

    it("Should reward tokens upon purchase", async function () {
        const clientBalance = await localBuzz.balanceOf(addr1.address);
        expect(clientBalance).to.be.above(0);
    });

    it("Should redeem tokens for cUSD", async function () {
        const clientBalance = await localBuzz.balanceOf(addr1.address);

        // Approve LocalBuzz contract to spend cUSD for redemption
        await cUSDToken.connect(owner).approve(localBuzz.address, clientBalance);

        await expect(localBuzz.connect(addr1).redeemTokens(clientBalance))
            .to.emit(localBuzz, "TokensRedeemed")
            .withArgs(addr1.address, clientBalance);
    });

    it("Should edit a package", async function () {
        await expect(localBuzz.connect(addr2).editPackage(0, "EditedPackage", "Twitter", "EditedDescription", 48, 200))
            .to.emit(localBuzz, "packageEdited")
            .withArgs(0, "EditedPackage", "Twitter", "EditedDescription", 48, 200, addr2.address);

        const package = await localBuzz.getPackages([0]);
        expect(package[0].name).to.equal("EditedPackage");
    });

    it("Should delete a package", async function () {
        await expect(localBuzz.connect(addr2).deletePackage(0))
            .to.emit(localBuzz, "packageDeleted")
            .withArgs(0);

        const package = await localBuzz.getPackages([0]);
        expect(package[0].creator).to.equal(ethers.constants.AddressZero);
    });
});
