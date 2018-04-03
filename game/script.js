/*** onload ***/
	/* game variables */
		window.plus   = null
		window.game   = window.game || {}

	/* buildGame */
		if (window.game.end) {
			// victory section
				buildVictory(window.game.victory, window.game.players)
		}
		else {
			// socket
				var socket = null
				createSocket()

				var checkLoop = setInterval(function() {
					if (!socket) {
						try {
							createSocket()
						}
						catch (error) {
							console.log(error)
						}
					}
				}, 5000)

			// begin button & players
				if (!window.game.start) {
					document.getElementById("begin").setAttribute("active", true)
					document.getElementById("begin").addEventListener("click", submitBegin)
					document.getElementById("players").setAttribute("active", true)

					buildPlayers(window.game.players)
				}

			// build page
				else {
					document.getElementById("submission").addEventListener("submit", submitWord)
					buildChain(window.game.chain)
					buildTree( window.game.tree )
				}
		}

/*** submits ***/
	/* submitBegin */
		function submitBegin(event) {
			if (event.target.id !== "begin") {
				//
			}
			else if (window.game.start) {
				displayError("Game already started...")
			}
			else {
				var post = {
					action: "submitBegin"
				}
				socket.send(JSON.stringify(post))
			}
		}

	/* submitBranch */
		function submitBranch(event) {
			// error
				if (event.target.className !== "branch-plus") {
					//
				}
				else if (window.game.end) {
					displayError("Game already ended...")
				}

			// unselect
				else if (window.plus) {
					window.plus.removeAttribute("active")
					window.plus = null
					document.getElementById("submission").removeAttribute("active")
				}

			// select
				else {
					window.plus = event.target
					window.plus.setAttribute("active", true)
					document.getElementById("submission").setAttribute("active", true).focus()
				}
		}

	/* submitWord */
		function submitWord(event) {
			// errors
				if (window.game.end) {
					displayError("Game already ended...")
				}
				else if (!window.plus || !document.getElementById("submission").getAttribute("active")) {
					displayError("No active branch...")
				}
				else if (!(/^[a-zA-Z]+$/).test(document.getElementById("submission-word").value)) {
					displayError("Letters only...")
				}

			// submit
				else {
					// send data
						var post = {
							action: "submitWord",
							word: document.getElementById("submission-word").value.trim().toLowerCase(),
							parent: window.plus.parentNode.id
						}
						socket.send(JSON.stringify(post))

					// unselect
						window.plus.removeAttribute("active")
						window.plus = null
						event.target.removeAttribute("active")
						event.target.value = ""
				}
		}

/*** receives ***/
	/* receivePost */
		function receivePost(post) {
			// redirect
				if (post.location !== undefined) {
					window.location = post.location
				}

			// player
				if (post.players !== undefined) {
					buildPlayers(post.players)
				}

			// begin
				if (post.begin !== undefined) {
					document.getElementById("begin").removeAttribute("active")
					document.getElementById("players").removeAttribute("active")
					document.getElementById("submission").addEventListener("submit", submitWord)
				}

			// message
				if (post.message !== undefined) {
					displayError(post.message)
				}

			// chain
				if (post.chain !== undefined) {
					buildChain(post.chain)
				}
			
			// tree
				if (post.tree !== undefined) {
					buildTree(post.tree)
				}

			// victory
				if (post.victory !== undefined) {
					buildVictory(post.victory, post.players)
				}
		}

/*** builds ***/
	/* buildPlayer */
		function buildPlayer(player) {
			// construct HTML
				var content = "\
					<div class='player' id='" + player.id + "' color='" + player.color + "'>\
						<span class='player-name'>" + player.name + "</span>\
						<span class='player-score'>" + (player.score || "") + "</span>\
					</div>\
				"

			// append to page
				document.getElementById("players-info").innerHTML += content
		}

	/* buildPlayers */
		function buildPlayers(players) {
			window.game.players = players || {}
				
			// add new
				for (var p in window.game.players) {
					if (!document.getElementById(p)) {
						buildPlayer(window.game.players[p])
					}
				}

			// remove old
				var playerElements = Array.from(document.querySelectorAll(".player"))
				for (var p in playerElements) {
					if (!window.game.players[playerElements[p].id]) {
						playerElements[p].remove()
					}
				}
		}

	/* buildChain */
		function buildChain(chain) {
			// same
				var oldBlocks = window.game.chain.length ? window.game.chain.map(function (block) { return block.id }) :  []
				var newBlocks =                                        chain.map(function (block) { return block.id }) || []
				if (oldBlocks.join(",") == newBlocks.join(",")) {
					//
				}

			// different
				else {
					// find difference
						newBlocks = newBlocks.filter(function (block) {
							return oldBlocks.indexOf(block) == -1
						}) || []

					// construct HTML
						var content = ""
						for (var n in newBlocks) {
							var block = chain.find(function (block) { return block.id == newBlocks[n] }) || {}

							content += "\
								<div class='block' id='" + block.id + "' color='" + block.color + "'>\
									<div class='block-word'>" + block.word + "</div>\
									<div class='block-player'>" + block.player + "</div>\
								</div>\
							"
						}

						document.getElementById("chain").innerHTML = content + document.getElementById("chain").innerHTML

					// update chain
						window.game.chain = chain
				}
		}

	/* buildTree */
		function buildTree(tree) {
			// same
				var oldBranches = findBranchIds((window.game.tree || {}), []) || []
				var newBranches = findBranchIds((            tree || {}), []) || []
				if (oldBranches.join(",") == newBranches.join(",")) {
					//
				}

			// different
				else {
					// find differences
						newBranches = newBranches.filter(function (branch) {
							return oldBranches.indexOf(branch) == -1
						}) || []

						var deadBranches = oldBranches.filter(function (branch) {
							return newBranches.indexOf(branch) == -1
						}) || []

					// eliminate old branches
						for (var d in deadBranches) {
							var branch = findBranch(window.tree, deadBranches[d]) || null

							// parent exists in blockchain
								if (window.game.chain.find(function(block) { return block.id == branch.parent })) {
									document.getElementById(branch.parent).append(document.getElementById(deadBranches[d]))
								}

							// parent doesn't exist
								else {
									document.getElementById(deadBranches[d]).remove()
								}
						}

					// add new branches
						for (var n in newBranches) {
							var branch = findBranch(tree, newBranches[n]) || null
							var parent = branch.parent ? (document.getElementById(branch.parent) || null) : document.getElementById("root")

							// construct HTML
								var content = "\
									<div class='branch' id='" + branch.id + "'>\
										<div class='branch-word'>" + block.word + "</div>\
										<div class='branch-player'>" + block.player + "</div>\
										<button class='branch-plus'>+</button>\
									</div>\
								"

							// append to parent
								parent.innerHTML += content
								Array.from(document.querySelectorAll("#" + branch.id + " .branch-plus"))[0].addEventListener("click", submitBranch)
						}

					// update tree
						window.game.tree = tree
				}
		}

	/* buildVictory */
		function buildVictory(victory, players) {
			// hide submission
				if (window.plus) {
					window.plus.removeAttribute("active")
					window.plus = null
					document.getElementById("submission").removeAttribute("active")
				}

			// display victors & play-again link
				document.getElementById("players").setAttribute("active", true)
				document.getElementById("players-victory").setAttribute("active", true).innerHTML = victory.join(" & ")
				document.getElementById("players-link").setAttribute("active", true).focus()
				window.game.victory = victory || []

			// display players
				document.getElementById("players-info").innerHTML = ""
				buildPlayers(players)

			// disconnect socket
				if (socket) {
					socket.close()
				}
		}

/*** helpers ***/
	/* findBranchIds */
		function findBranchIds(obj, ids) {
			try {
				// ids ?
					if (typeof ids == "undefined" || !ids) {
						var ids = []
					}

				// loop through parameters
					for (var parameter in obj) {
						// ids
							if (parameter == "id") {
								ids.push(obj[parameter])
							}

						// child objects --> recursion
							else if (typeof parameter == "object") {
								ids = findBranchIds(obj[parameter], ids)
							}
					}

				// output ids
					return ids || []
			}
			catch (error) {
				console.log(error)
			}
		}

	/* findBranch */
		function findBranch(tree, id) {
			try {
				// errors
					if (!tree || typeof tree !== "object") {
						console.log("invalid tree")
					}
					else if (!id || !id.length) {
						console.log("no branch id")
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
				console.log(error)
			}
		}
