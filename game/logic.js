/*** modules ***/
	var main = require("../main/logic")
	module.exports = {}

/*** submits ***/
	/* submitBegin */
		module.exports.submitBegin = submitBegin
		function submitBegin(request, callback) {
			try {
				// errors
					if (request.game.start) {
						callback([request.session.id], {success: false, message: "game already started"})
					}
					else if (Object.keys(request.game.players).length < 2) {
						callback([request.session.id], {success: false, message: "game requires 2 players"})
					}
					else if (Object.keys(request.game.players).length > 10) {
						callback([request.session.id], {success: false, message: "game cannot exceed 10 players"})
					}

				// begin
					else {
						// start game
							request.game.updated = request.game.start = new Date().getTime()

						// get players
							var players = Object.keys(request.game.players)

						// get a word --> create and append branch
							for (var x = 0; x < 3; x++) {
								request.post.word = main.chooseRandom(main.getAsset("words"))
						
								var branch = createBranch(request)
									branch.player = false

								request.game.tree[branch.id] = branch
							}

						// messages & content
							sendMessages(request, callback, [
								[players, {success: true, message: "3...", start: request.game.start}, 0],
								[players, {success: true, message: "2..."}, 1000],
								[players, {success: true, message: "1..."}, 2000],
								[players, {success: true, message: "this game is all about compound words"}, 3000],
								[players, {success: true, message: "build new words by overlapping with old words"}, 7000],
								[players, {success: true, message: "ex: [flashlight] connects to [lighthouse] - they share [light]"}, 11000],
								[players, {success: true, message: "compete with other players by building trees of word connections"}, 16000],
								[players, {success: true, message: "when 5 words are built on yours, it locks in"}, 21000],
								[players, {success: true, message: "but you can't build on your own word - make it good so other people will!"}, 26000],
								[players, {success: true, message: "words should have an overlapping syllable - by letters or by sound"}, 31000],
								[players, {success: true, message: "complete the circle to end the game - what will the starting word be?"}, 36000],
								[players, {success: true, message: "3..."}, 41000],
								[players, {success: true, message: "2..."}, 42000],
								[players, {success: true, message: "1..."}, 43000],
								[players, {success: true, chain: request.game.chain, tree: request.game.tree}, 45000]
							])
					}
			}
			catch (error) {
				main.logError(error)
				callback([request.session.id], {success: false, message: "unable to submit begin"})
			}
		}

	/* submitWord */
		module.exports.submitWord = submitWord
		function submitWord(request, callback) {
			try {
				request.game.updated = new Date().getTime()

				// errors
					if (!request.game.start || request.game.end) {
						callback([request.session.id], {success: false, message: "game not in play"})
					}
					else if (!request.post.word || !request.post.word.length) {
						callback([request.session.id], {success: false, message: "no word submitted"})
					}
					else if (!(/^[a-zA-Z]+$/).test(request.post.word)) {
						callback([request.session.id], {success: false, message: "letters only"})	
					}
					else if (!request.post.parent || (request.post.parent.length !== 8) || !main.isNumLet(request.post.parent)) {
						callback([request.session.id], {success: false, message: "invalid parent"})
					}

				// find parent
					else {
						var blocks  = request.game.chain.map(function (block) { return block.word })
						var siblings = []
						var parent = findBranch(request.game.tree, request.post.parent)
							for (var parameter in parent) {
								if (typeof parent[parameter] == "object") {
									siblings.push(parent[parameter].word)
								}
							}

						// more errors
							if (!parent || typeof parent !== "object") {
								callback([request.session.id], {success: false, message: "parent not found"})
							}
							else if ((parent.player == request.session.id) && (Object.keys(request.game.players).length > 2)) {
								callback([request.session.id], {success: false, message: "cannot build on your own word"})
							}
							else if (siblings.includes(request.post.word.toLowerCase())) {
								callback([request.session.id], {success: false, message: "word already present on this branch"})
							}
							else if (blocks.includes(request.post.word.toLowerCase())) {
								callback([request.session.id], {success: false, message: "word already part of the chain"})
							}

						// add to tree
							else {
								// build and append
									var branch = createBranch(request)
										branch.parent = parent.id
									parent[branch.id] = branch

								// loop through ancestors
									var end = false

									while (parent) {
										// add points
											parent.points++

										// find next ancestor
											if (parent.points < 5) {
												parent = findBranch(request.game.tree, parent.parent) || null
											}

										// lock block in & test for game end
											else {
												end = lockBlock(request, parent) || false
												parent = null
											}
									}

								// send results
									var players = Object.keys(request.game.players)
									callback(players, {success: true, chain: request.game.chain, tree: request.game.tree})

								// end game ?
									if (end) {
										endGame(request, callback)
									}
							}
					}
			}
			catch (error) {
				main.logError(error)
				callback([request.session.id], {success: false, message: "unable to submit word"})
			}
		}


/*** players ***/
	/* addPlayer */
		module.exports.addPlayer = addPlayer
		function addPlayer(request, callback) {
			try {
				if (!request.game) {
					callback([request.session.id], {success: false, message: "unable to find game"})
				}
				else if (!request.game.players[request.session.id]) {
					callback([request.session.id], {success: false, message: "unable to find player in game"})
				}
				else {
					// save connection
						request.game.players[request.session.id].connected  = true
						request.game.players[request.session.id].connection = request.connection

					// new player
						var player = {
							id: request.session.id,
							name: request.game.players[request.session.id].name,
							color: request.game.players[request.session.id].color
						}

					// send
						var opponents = Object.keys(request.game.players).filter(function (p) {
							return p !== request.session.id
						})
						callback(opponents, {success: true, players: main.sanitizeObject(request.game.players)})
				}
			}
			catch (error) {
				main.logError(error)
				callback([request.session.id], {success: false, message: "unable to add player"})
			}
		}

	/* removePlayer */
		module.exports.removePlayer = removePlayer
		function removePlayer(request, callback) {
			try {
				main.logStatus("[CLOSED]: " + request.path.join("/") + " @ " + (request.ip || "?"))
				if (request.game) {

					// remove player or connection?
						if (request.game.start) {
							request.game.players[request.session.id].connected = false
						}
						else {
							delete request.game.players[request.session.id]
						}

					// delete game ?
						var opponents = Object.keys(request.game.players).filter(function (p) {
							return request.game.players[p].connected
						}) || []

						if (!opponents.length) {
							callback([], {success: true, delete: true})
						}
					
					// still players
						else {
							var player = {
								id: request.session.id,
								remove: true
							}

							callback(opponents, {success: true, players: main.sanitizeObject(request.game.players)})
						}
				}
			}
			catch (error) {
				main.logError(error)
				callback([request.session.id], {success: false, message: "unable to remove player"})
			}
		}

/*** creates ***/
	/* createBranch */
		module.exports.createBranch = createBranch
		function createBranch(request) {
			try {
				var branch = {
					id:     main.generateRandom(null, 8),
					word:   request.post.word.toLowerCase(),
					player: request.session.id,
					points: 0
				}

				return branch || null
			}
			catch (error) {
				main.logError(error + " unable to create branch")
			}
		}

	/* createBlock */
		module.exports.createBlock = createBlock
		function createBlock(request, branch) {
			try {
				var block = {
					id:     branch.id,
					word:   branch.word,
					player: branch.player || null,
					points: branch.points || 0,
					color:  (branch.player ? request.game.players[branch.player].color : "black")
				}

				return block || null
			}
			catch (error) {
				main.logError(error + " unable to create block")
			}
		}

/*** helpers ***/
	/* sendMessages */
		module.exports.sendMessages = sendMessages
		function sendMessages(request, callback, messages) {
			try {
				// callback each recipient & object at the time
					for (var m in messages) {
						var message = messages[m]
						setTimeout(callback, message[2], message[0], message[1])
					}
			}
			catch (error) {
				main.logError(error)
			}
		}

	/* findBranch */
		module.exports.findBranch = findBranch
		function findBranch(tree, id) {
			try {
				// errors
					if (!tree || typeof tree !== "object") {
						main.logError("invalid tree")
					}
					else if (!id || !id.length) {
						main.logError("no branch id")
					}

				// find the branch
					else {
						// data
							var branch = null
							var ids = Object.keys(tree)

						// at this level?
							if (ids.includes(id)) {
								branch = tree[id]
							}

						// dig deeper (recursion)
							else {
								for (var t in tree) {
									branch = findBranch(tree[t], id) || null

									if (branch) {
										return branch
									}
								}
							}

						// return branch, if found
							return branch || null
					}
			}
			catch (error) {
				main.logError(error + " unable to find branch")
			}
		}

	/* pruneTree */
		module.exports.pruneTree = pruneTree
		function pruneTree(tree, branch, remove) {
			try {
				// remove competing branches
					if (remove) {
						for (var t in tree) {
							if (t !== branch.id) {
								delete tree[t]
							}
						}
					}

				// move children to main tree
					for (var b in branch) {
						if (typeof branch[b] == "object") {
							tree[b] = branch[b]
						}
					}

				// remove parent branch
					delete tree[branch.id]
			}
			catch (error) {
				main.logError(error + " unable to prune tree")
			}
		}

	/* lockBlock */
		module.exports.lockBlock = lockBlock
		function lockBlock(request, branch) {
			try {
				// errors
					if (!branch || typeof branch !== "object") {
						main.logError("invalid branch")
					}
					else if (request.game.chain.map(function (block) { return block.id }).includes(branch.id)) {
						main.logError("already added")
					}

				// lock it in
					else {
						// create & append block
							var block = createBlock(request, branch)
							request.game.chain.push(block)

						// update points
							if (block.player) {
								request.game.players[block.player].points += block.points
							}

						// prune tree
							pruneTree(request.game.tree, branch, true)

						// end game ?
							if (block.word == request.game.chain[0].word) {
								return true
							}
							else {
								return false
							}
					}
			}
			catch (error) {
				main.logError(error + " unable to lock block")
			}
		}

	/* endGame */
		module.exports.endGame = endGame
		function endGame(request, callback) {
			try {
				// errors
					if (!request.game.start || request.game.end) {
						callback([request.session.id], {success: false, message: "game not in play"})
					}

				// award points
					else {
						while (Object.keys(request.game.tree).length) {
							for (var t in request.game.tree) {
								request.game.players[request.game.tree[t].player].points += request.game.tree[t].points

								pruneTree(request.game.tree, request.game.tree[t], false)
							}
						}
					}

				// set end
					request.game.end = new Date().getTime()

				// send messages
					sendMessages(request, callback, [
						[players, {success: true, message: "that completes the loop!"}, 0],
						[players, {success: true, message: "the final scores?"}, 4000],
						[players, {success: true, message: "3..."}, 7000],
						[players, {success: true, message: "2..."}, 8000],
						[players, {success: true, message: "1..."}, 9000],
						[players, {success: true, end: request.game.end, players: request.game.players}, 10000]
					])

			}
			catch (error) {
				main.logError(error + " unable to end game")
			}
		}
