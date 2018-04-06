# WordsBlockChain

a fast-paced party game of linking words in a blockchain: http://www.wordsblockchain.com

<pre style='line-height: 0.5; text-align: center'>
                           
 /-----------------\       
 |                 |       
 |                 |       
 |  /--------------|--\    
 |  |              |  |    
 |  |              |  |    
 \-----/-----------/--|--\ 
    |  |              |  | 
    |  |              |  | 
    \--|--------------/  | 
       |                 | 
       |                 | 
       \-----------------/ 
                           
</pre>
<hr>

# Rules


## Requirements

• 2-10 players

• 1 smartphone/computer each

• 10-20 minutes



## Setup

• Each player inputs a name.

• One player creates a game using the "new" button.

• All other players join using the 4-letter gamecode and the "join" button.



## Gameplay

• Touch a + to build a new branch on the tree of words.

• When 3 words are built on yours, your word locks in as a block in the chain.

• The game ends when a player completes the circle - locking in the word that started the chain.

• All remaining words on the tree earn points too. The player with the most points wins!



## Words

• What words qualify? Well, that's up to the players - but we recommend:

• 1 syllable of overlapping sound

• or 1 syllable of similar letters



<hr>

# App Structure

<pre>
|- package.json
|- index.js (handleRequest, parseRequest, routeRequest; _302, _403, _404; handleSocket, parseSocket, routeSocket; _400)
|
|- /node-modules/
|   |- websocket
|
|- /main/
|   |- logic.js (logError, logStatus, logMessage; getEnvironment, getAsset; isNumLet, isBot; renderHTML; generateRandom, chooseRandom, sortRandom; sanitizeString, sanitizeObject; determineSession, cleanDatabase)
|   |- stylesheet.css
|   |- script.js (isNumLet, isEmail, sanitizeString, chooseRandom; displayError, buildWords, animateWords; sendPost, createSocket)
|   |
|   |- banner.png
|   |- logo.png
|   |- _404.html
|
|- / (home)
|   |- logic.js (createGame, createPlayer; joinGame)
|   |- index.html
|   |- stylesheet.css
|   |- script.js (createGame, joinGame)
|
|- /about/
|   |- index.html
|   |- stylesheet.css
|   |- script.js (submitFeedback)
|
|- /game/
    |- logic.js (submitBegin, submitWord; addPlayer, removePlayer; createBranch, createBlock; sendMessages, findBranch, pruneTree, lockBlock, endGame)
    |- index.html
    |- stylesheet.css
    |- script.js (submitBegin, submitBranch, submitClose, submitWord; receivePost; buildPlayer, buildPlayers, buildChain, buildTree, buildEnd; findBranchIds, findBranch; fadeElement)
</pre>
