/*** modules ***/
	var main = require("../main/logic")
	module.exports = {}

/*** creates ***/
	/* createGame */
		module.exports.createGame = createGame
		function createGame(request, callback) {
			try {
				if (!request.game || !request.game.id) {
					callback({success: false, message: "no game"})
				}
				else {
					// create game
						request.game.created = new Date().getTime()
						request.game.updated = new Date().getTime()
						request.game.start   = false
						request.game.end     = false
						request.game.players = {}
						request.game.chain   = []
						request.game.tree    = {}

					// create player
						var player = createPlayer(request)
						request.game.players[request.session.id] = player
					
					callback({success: true, message: "game created", location: "../../game/" + request.game.id})
				}
			}
			catch (error) {
				main.logError(error + " unable to create game")
				callback({success: false, message: "unable to create game"})
			}
		}
	
	/* createPlayer */
		module.exports.createPlayer = createPlayer
		function createPlayer(request) {
			try {
				// get color
					var colors = main.getAsset("colors") || []
					var players = Object.keys(request.game.players)
					for (var p in players) {
						colors = colors.filter(function(c) {
							return c !== request.game.players[players[p]].color
						})
					}

				// get name
					var opponents = Object.keys(request.game.players) || []
					var name = main.sanitizeString(request.post.name) || null
						name = name || "player " + (Object.keys(request.game.players).length + 1)
					if (name.length > 10) {
						name = name.slice(0,10)
					}

				// create player
					var player = {id: request.session.id}
						player.name   = name
						player.color  = main.chooseRandom(colors)
						player.points = 0
						player.connected = false
						player.connection = null

				// return value
					return player || {}
			}
			catch (error) {
				main.logError(error + " unable to create player")
				return false
			}
		}	

/*** joins ***/
	/* joinGame */
		module.exports.joinGame = joinGame
		function joinGame(request, callback) {
			try {
				if (request.game.end) {
					callback({success: false, message: "game already ended"})
				}
				else if (!request.game.players[request.session.id] && (Object.keys(request.game.players).length >= 10)) {
					callback({success: false, message: "game is at capacity"})
				}
				else if (!request.game.players[request.session.id] && request.game.start) {
					callback({success: false, message: "game already started"})
				}
				else if (request.game.players[request.session.id]) {
					callback({success: true, message: "rejoining game", location: "../../game/" + request.game.id})
				}
				else {
					// create player
						request.game.players[request.session.id] = createPlayer(request)

					callback({success: true, message: "game joined", location: "../../game/" + request.game.id})
				}
			}
			catch (error) {
				main.logError(error + " unable to join game")
				callback({success: false, message: "unable to join game"})
			}
		}
