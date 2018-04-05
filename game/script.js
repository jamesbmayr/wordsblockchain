/*** onload ***/
	/* game variables */
		window.plus   = null
		window.game   = window.game || {}

	/* buildGame */
		if (window.game.end) {
			// end section
				buildEnd(window.game.players)
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
					document.getElementById("header-begin").setAttribute("active", true)
					document.getElementById("header-begin").addEventListener("click", submitBegin)
					document.getElementById("players").setAttribute("active", true)

					buildPlayers(window.game.players)
				}

			// build page
				else {
					document.getElementById("header-submission").addEventListener("submit", submitWord)
					document.getElementById("header-submission-close").addEventListener("click", submitClose)
					document.getElementById("game").setAttribute("active", true)
					buildChain(window.game.chain, true)
					buildTree( window.game.tree,  true)
				}
		}

/*** submits ***/
	/* submitBegin */
		function submitBegin(event) {
			if (window.game.start) {
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
				if (event.target.className !== "plus") {
					//
				}
				else if (window.game.end) {
					displayError("Game already ended...")
				}

			// unselect
				else if (window.plus && (window.plus.parentNode.parentNode.id == event.target.parentNode.parentNode.id)) {
					window.plus.removeAttribute("active")
					window.plus = null
					document.getElementById("header-submission").removeAttribute("active")
				}

			// select
				else {
					if (window.plus) {
						window.plus.removeAttribute("active")
					}

					window.plus = event.target
					window.plus.setAttribute("active", true)
					document.getElementById("header-submission").setAttribute("active", true)
					document.getElementById("header-submission").focus()
				}
		}

	/* submitClose */
		function submitClose(event) {
			// unselect
				window.plus.removeAttribute("active")
				window.plus = null
				document.getElementById("header-submission").removeAttribute("active")
				document.getElementById("header-submission-word").value = ""
		}

	/* submitWord */
		function submitWord(event) {
			// errors
				if (window.game.end) {
					displayError("Game already ended...")
				}
				else if (!window.plus || !document.getElementById("header-submission").getAttribute("active")) {
					displayError("No active branch...")
				}
				else if (!(/^[a-zA-Z\s]+$/).test(document.getElementById("header-submission-word").value)) {
					displayError("Letters only...")
				}

			// submit
				else {
					// send data
						var post = {
							action: "submitWord",
							word: document.getElementById("header-submission-word").value.trim().toLowerCase(),
							parent: window.plus.parentNode.parentNode.id
						}
						socket.send(JSON.stringify(post))

					// unselect
						window.plus.removeAttribute("active")
						window.plus = null
						document.getElementById("header-submission").removeAttribute("active")
						document.getElementById("header-submission-word").value = ""
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

			// start
				if (post.start !== undefined) {
					document.getElementById("header-begin").removeAttribute("active")
					document.getElementById("header-submission").addEventListener("submit", submitWord)
					document.getElementById("players").removeAttribute("active")
					document.getElementById("game").setAttribute("active", true)
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

			// end
				if (post.end !== undefined) {
					buildEnd(post.players)
				}
		}

/*** builds ***/
	/* buildPlayer */
		function buildPlayer(player) {
			// construct HTML
				var outer = document.createElement("div")
					outer.className = "player"
					outer.id = player.id
					outer.setAttribute("color", player.color)
				document.getElementById("players").prepend(outer)

				var inner = document.createElement("span")
					inner.className = "player-name"
					inner.innerText = player.name
				outer.append(inner)

				var inner = document.createElement("span")
					inner.className = "player-score"
					inner.innerText = player.points || ""
				outer.append(inner)
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
		function buildChain(chain, reset) {
			// same
				var oldBlocks = reset ? [] : (window.game.chain.length ? window.game.chain.map(function (block) { return block.id }) : [])
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

					// loop through
						for (var n in newBlocks) {
							var block = chain.find(function (block) { return block.id == newBlocks[n] }) || {}
							var possibility = document.getElementById(block.id)

							// already exists
								if (possibility) {
									possibility.className = "block"
									possibility.firstChild.remove()
									possibility.lastChild.setAttribute("color", block.color)
								}

							// construct HTML
								else {
									var topBlock = Array.from(document.querySelectorAll(".block"))[0]

									var outer = document.createElement("div")
										outer.className = "block"
										outer.id = block.id
									document.getElementById("game").insertBefore(outer, topBlock)

									var inner = document.createElement("div")
										inner.className = "word"
										inner.innerText = block.word
										inner.setAttribute("color", block.color)
									outer.append(inner)
								}							
						}

					// update chain
						window.game.chain = chain || []
				}
		}

	/* buildTree */
		function buildTree(tree, reset) {
			// same
				var oldBranches = reset ? [] : (findBranchIds((window.game.tree || {}), []) || [])
				var newBranches = findBranchIds((            tree || {}), []) || []
				if (oldBranches.join(",") == newBranches.join(",")) {
					//
				}

			// different
				else {
					// find differences
						var deadBranches = oldBranches.filter(function (branch) {
							return newBranches.indexOf(branch) == -1
						}) || []

						newBranches = newBranches.filter(function (branch) {
							return oldBranches.indexOf(branch) == -1
						}) || []

					// eliminate old branches
						for (var d in deadBranches) {
							var branch = findBranch(window.game.tree, deadBranches[d]) || null
							var possibility = document.getElementById(deadBranches[d])

							if (possibility && (possibility.className !== "block")) {
								possibility.remove()
							}
						}

					// add new branches
						for (var n in newBranches) {
							var branch = findBranch(tree, newBranches[n]) || null
							var parent = branch.parent ? (document.getElementById(branch.parent) || null) : document.getElementById("base")

							// construct word
								var outer = document.createElement("div")
									outer.className = "branch"
									outer.id = branch.id
								parent.insertBefore(outer, parent.lastChild)

								var inner = document.createElement("div")
									inner.className = "word"
									inner.innerText = branch.word
								outer.append(inner)

							// construct plus
								var child = document.createElement("div")
									child.className = "branch"
								outer.prepend(child)

								var button = document.createElement("button")
									button.className = "plus"
									button.innerText = "+"
									button.addEventListener("click", submitBranch)
								child.append(button)
						}

					// update tree
						window.game.tree = tree || {}
				}
		}

	/* buildEnd */
		function buildEnd(players) {
			// hide submission
				if (window.plus) {
					window.plus.removeAttribute("active")
					window.plus = null
					document.getElementById("header-submission").removeAttribute("active")
				}

			// hide game
				document.getElementById("game").removeAttribute("active")

			// display play-again link
				document.getElementById("header-again").setAttribute("active", true)
				document.getElementById("header-again").focus()

			// display players
				document.getElementById("players").setAttribute("active", true).innerHTML = ""
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
							else if (typeof obj[parameter] == "object") {
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
						return null
					}
					else if (!id || !id.length) {
						return null
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
