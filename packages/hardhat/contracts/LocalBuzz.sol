// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// Uncomment this line to use console.log
// import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// import { ERC20 } from "./Interface.sol";


contract LocalBuzz is ERC20{

    IERC20 public cUSDToken;
       
    // address public cUSDTokenAddress = // 0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1
    constructor() ERC20("LocalBuzz", "BUZZ") {
    
    cUSDToken = IERC20(0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1);
    
    }

    uint  totalClients;
    uint totalCreators;
    uint totalPackages;

    struct Client {
        uint id;
        string username;
        string email;
        address walletAddress;
        uint [] purchasedIds;
        uint tokenBalance;
    }
    //array of clients
    Client[] clients;

    struct ContentCreator{
        uint id;
        string fullname;
        string username;
        string bio;
        string instagramLink;
        string facebookLink;
        string linkedinLink;
        string twitterLink;
        string tiktokLink;
        uint [] packagesCreated;
        address walletAddress;
        string email;
        
    }

    //array of content creators
    ContentCreator[] creators;

    struct Package {
        uint id;
        string name;
        string platform;
        string description;
        uint duration;
        uint price;
        address creator;
        address [] buyers;
    }
    //array of packages
    Package[] packages;


    //mapping of clients
    mapping (address => Client) clientnAdd;
    mapping (uint => Client) clientnId;

    //mapping of content creators
    mapping (address => ContentCreator) creatornAdd;
    mapping (uint => ContentCreator) creatornId;

    //mapping of packages
    mapping (address => Package) packagenAdd;
    mapping (uint => Package) packagenId;

    //events
    event clientRegistered(uint id, string username, string email, address walletAddress, uint[] purchasedIds, uint tokenBalance);
    event contentCreatorRegistered (uint id, string fullname, string username, string bio, string instagramLink, string facebookLink, string linkedinLink, string twitterLink, string tiktokLink,uint [] packagesCreated,  address walletAddress, string email);
    event packageCreated (uint id, string name, string platform, string description, uint duration, uint price, address creator, address [] buyers);
    event packagePurchased (uint id, address buyer, uint amount);
    event TokensRewarded(address clientAddress, uint tokenAmount);
    event TokensRedeemed(address , uint TokenAmount);
    event packageDeleted(uint id);
    event packageEdited(uint id, string name, string platform, string description, uint duration, uint price, address creator);

    //function to register Client
    function registerClient(string memory _username, string memory _email) public {
        require(!registered(msg.sender), "Already registered");
        require(!isClient(msg.sender), "Already registered as content creator");
        uint id = totalClients;
        Client memory newClient = Client(id, _username, _email, msg.sender, new uint[](0) , 0);
        clientnId[id] = newClient;
        clientnAdd[msg.sender] = newClient;
        clients.push(newClient);
        totalClients++;
        emit clientRegistered(id, _username, _email, msg.sender, new uint[](0) , 0);
    }

    //function to register content creator
    function registerContentCreator(
        string memory _fullname,
        string memory _username,
        string memory _bio,
        string memory _instagramLink,
        string memory _facebookLink,
        string memory _linkedinLink,
        string memory _twitterLink,
        
        string memory _tiktokLink,
        string memory _email
    ) public {
        require(!registered(msg.sender), "Already registered");
        require(!isContentCreator(msg.sender), "Already registered as client");
        uint id = totalCreators;
        ContentCreator memory newCreator = ContentCreator(id, _fullname, _username, _bio, _instagramLink, _facebookLink, _linkedinLink, _twitterLink, _tiktokLink, new uint[](0) ,  msg.sender, _email);
        creatornId[id] = newCreator;
        creatornAdd[msg.sender] = newCreator;
        creators.push(newCreator);
        totalCreators++;
        emit contentCreatorRegistered(id, _fullname, _username, _bio, _instagramLink, _facebookLink, _linkedinLink, _twitterLink, _tiktokLink, new uint[](0),  msg.sender, _email);
    }

    //function to create package
    function createPackage(
        string memory _name,
        string memory _platform,
        string memory _description,
        uint _duration,
        uint _price
    ) public onlyCreator {
        uint id = totalPackages;
        Package memory newPackage = Package(id, _name, _platform, _description, _duration, _price * 10 ** 18 , msg.sender, new address[](0));
        packagenId[id] = newPackage;
        packagenAdd[msg.sender] = newPackage;
        creatornAdd[msg.sender].packagesCreated.push(id);
        packages.push(newPackage);
        totalPackages++;
        emit packageCreated(id, _name, _platform, _description, _duration, _price, msg.sender, new address[](0));
    }

    //function to edit package
    function editPackage(uint _id, string memory _name, string memory _platform, string memory _description, uint _duration, uint _price) public onlyCreator {
        require(packagenId[_id].creator == msg.sender, "Only the creator can edit the package");
        packagenId[_id].name = _name;
        packagenId[_id].platform = _platform;
        packagenId[_id].description = _description;
        packagenId[_id].duration = _duration;
        packagenId[_id].price = _price * 10 ** 18;
        emit packageEdited(_id, _name, _platform, _description, _duration, _price, msg.sender);
    }

    //function to delete package
    function deletePackage(uint _id) public onlyCreator {
        require(packagenId[_id].creator == msg.sender, "Only the creator can delete the package");
        delete packagenId[_id];
        emit packageDeleted(_id);
    }

    //function to purchase package
    function purchasePackage(uint _id) public  { 
        uint amount = packagenId[_id].price ;        
        clientnAdd[msg.sender].purchasedIds.push(_id);
        packagenId[_id].buyers.push(msg.sender); 
        //get the BUZZ token of 10% on amount spent       
        rewardTokens(msg.sender, amount);
        emit packagePurchased(_id, msg.sender, amount);

    }
    //function to reward tokens i.e Buzz
    function rewardTokens(address _clientAddress, uint _amount) internal {
        uint tokenAmount = _amount / 10; // i.e 10% of the purchase amount in tokens
        _mint(_clientAddress , tokenAmount);
        emit TokensRewarded(_clientAddress, tokenAmount);
    }

    //function to redeem tokens
    function redeemTokens ( uint256 _tokenAmount) public {
        uint cUSDAmount = _tokenAmount;
        _burn(msg.sender, _tokenAmount);
        require(cUSDToken.transfer(msg.sender, cUSDAmount),"Failed to process payout");
        emit TokensRedeemed(msg.sender, cUSDAmount);
    }

    //function to check balance of Buzz tokens
    function balanceOf(address _client) public view override returns (uint256) {
        return super.balanceOf(_client);
    }

    //function to process purchase
    function processPurchase(uint256 _id) public returns (bool) {
        uint payout = packagenId[_id].price;
        address receiver = packagenId[_id].creator;
        require(cUSDToken.transfer(receiver, payout),"Failed to process payout");
        return true;
    }

    //funcion to get all creators packages
    function getCreatorPackages(address _creatorAddress) public view returns (uint[] memory) {
        return creatornAdd[_creatorAddress].packagesCreated;
    }

    //function to get client from address
    function getClient(address _clientAddress) public view returns (Client memory) {
        return clientnAdd[_clientAddress];
    }

    //function to get content creator from address
    function getContentCreator(address _creatorAddress) public view returns (ContentCreator memory) {
        return creatornAdd[_creatorAddress];
    }

    //function to get content creator from uint
    function getCreator(uint _id) public view returns (ContentCreator memory){
        return creatornId[_id];
    }

    //function to get all content creators
    function getAllCreators() public view returns (ContentCreator[] memory) {
        return creators;
    }

    //function to get package from id
    function getPackage(uint _id) public view returns (Package memory) {
        return packagenId[_id];
    }  


    //function to check if an address is registered
    function registered(address _address) public view returns (bool) {
        if(clientnAdd[_address].walletAddress != address(0) || creatornAdd[_address].walletAddress != address(0)){
            return true;
        }else{
            return false;       
        }
    }


    //function to check if an address is a client
    function isClient(address _address) public view returns (bool) {
        if(clientnAdd[_address].walletAddress == address(0)){
            return false;
        }else{
            return true;
        }
    }

    //function to check if an address is a content creator
    function isContentCreator(address _address) public view returns (bool) {
        if(creatornAdd[_address].walletAddress == address(0)){
            return false;
        }else{
            return true;
        }
    }

    //modifier for only Creator
    modifier onlyCreator() {
        require(isContentCreator(msg.sender), "Only Creator");
        _;
    }

   
}
