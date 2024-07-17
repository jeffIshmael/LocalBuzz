// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// Uncomment this line to use console.log
// import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// import { ERC20 } from "./Interface.sol";


contract LocalBuzz is ERC20{

    IERC20 public cUSDToken;
    address public owner;
       
    // address public cUSDTokenAddress = // 0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1 //testnet
    // 0x765DE816845861e75A25fCA122bb6898B8B1282a //mainnet
    constructor() ERC20("LocalBuzz", "BUZZ") {

    owner = msg.sender;
    cUSDToken = IERC20(0x765DE816845861e75A25fCA122bb6898B8B1282a);
    
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
    event amountWithdrawn(address _clientAddress, uint _amount);


    //function to register Client
    function registerClient(string memory _username, string memory _email) public {
        require(!registered(msg.sender), "Already registered"); 
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
        Package memory newPackage = Package(id, _name, _platform, _description, _duration, _price , msg.sender, new address[](0));
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
        packagenId[_id].price = _price;
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
        //get 5% of purchase amount as Buzz Token      
        rewardTokens(msg.sender, amount);
        //pay the creator for the purchase
        //cut 10% from the purchase amount as commission
        uint commission = amount / 10;
        require(cUSDToken.transfer(packagenId[_id].creator, amount - commission),"Failed to process payout");
        emit packagePurchased(_id, msg.sender, amount);

    }
    //function to reward tokens i.e Buzz
    function rewardTokens(address _clientAddress, uint _amount) internal {
        uint tokenAmount = _amount / 20; // i.e 5% of the purchase amount in tokens
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

    // Function to get packages from an array of IDs
    function getPackages(uint[] memory ids) public view returns (Package[] memory) {
        Package[] memory result = new Package[](ids.length);
        
        for (uint i = 0; i < ids.length; i++) {
            result[i] = packagenId[ids[i]];
        }
        
        return result;
    }

    //function to get clients from address array
    function getClients(address [] memory clientsAddresses) public view returns (Client[] memory) {
        Client[] memory result = new Client[](clientsAddresses.length);
        
        for (uint i = 0; i < clientsAddresses.length; i++) {
            result[i] = clientnAdd[clientsAddresses[i]];
        }
        
        return result;
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

    //function to withdraw from the contract
   function withdraw(address _address) public onlyOwner {
       cUSDToken.transfer(_address, cUSDToken.balanceOf(address(this)));
       emit amountWithdrawn(_address, cUSDToken.balanceOf(address(this)));
   }

   //modifier of only owner
   modifier onlyOwner() {
       require(msg.sender == owner, "Only owner");
       _;
   }

   
}
