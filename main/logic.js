/*** modules ***/
	var http     = require("http")
	var fs       = require("fs")
	module.exports = {}

/*** logs ***/
	/* logError */
		module.exports.logError = logError
		function logError(error) {
			console.log("\n*** ERROR @ " + new Date().toLocaleString() + " ***")
			console.log(" - " + error)
			console.dir(arguments)
		}

	/* logStatus */
		module.exports.logStatus = logStatus
		function logStatus(status) {
			console.log("\n--- STATUS @ " + new Date().toLocaleString() + " ---")
			console.log(" - " + status)
		}

	/* logMessage */
		module.exports.logMessage = logMessage
		function logMessage(message) {
			console.log(" - " + new Date().toLocaleString() + ": " + message)
		}

/*** maps ***/
	/* getEnvironment */
		module.exports.getEnvironment = getEnvironment
		function getEnvironment(index) {
			try {
				if (process.env.DOMAIN !== undefined) {
					var environment = {
						port:   process.env.PORT,
						domain: process.env.DOMAIN,
					}
				}
				else {
					var environment = {
						port:   3000,
						domain: "localhost",
					}
				}

				return environment[index]
			}
			catch (error) {
				logError(error)
				return false
			}
		}

	/* getAsset */
		module.exports.getAsset = getAsset
		function getAsset(index) {
			try {
				switch (index) {
					case "logo":
						return "logo.png"
					break
					
					case "google fonts":
						return '<link href="https://fonts.googleapis.com/css?family=Bungee" rel="stylesheet">'
					break

					case "meta":
						return '<meta charset="UTF-8"/>\
								<meta name="description" content="WordsBlockChain is a fast-paced party game of linking words in a blockchain."/>\
								<meta name="keywords" content="game,word,link,party,fun,chain,blockchain,play"/>\
								<meta name="author" content="James Mayr"/>\
								<meta property="og:title" content="WordsBlockChain: a game of linking words"/>\
								<meta property="og:url" content="http://www.wordsblockchain.com"/>\
								<meta property="og:description" content="WordsBlockChain is a fast-paced party game of linking words in a blockchain."/>\
								<meta property="og:image" content="http://www.wordsblockchain.com/banner.png"/>\
								<meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"/>'
					break

					case "colors":
						return ["red", "orange", "yellow", "green", "blue", "purple", "magenta", "cyan", "brown", "gray"]
					break

					case "words":
						return ["lifetime","elsewhere","upside","grandmother","cannot","baseball","fireworks","passport","together","become","became","sunflower","crosswalk","basketball","sweetmeat","superstructure","moonlight","football","railroad","rattlesnake","anybody","weatherman","throwback","skateboard","meantime","earthquake","everything","herein","sometimes","also","backward","schoolhouse","butterflies","upstream","nowhere","bypass","fireflies","because","somewhere","spearmint","something","another","somewhat","airport","anyone","today","himself","grasshopper","inside","themselves","playthings","footprints","therefore","uplift","homemade","without","backbone","scapegoat","peppermint","eyeballs","longhouse","forget","afternoon","southwest","northeast","alongside","meanwhile","keyboard","whatever","blacksmith","diskdrive","herself","nobody","seashore","nearby","silversmith","watchmaker","subway","horseback","itself","headquarters","sandstone","limestone","underground","glassmaking","riverbanks","touchdown","honeymoon","bootstrap","toothpick","toothpaste","dishwasher","household","township","popcorn","airplane","pickup","housekeeper","bookcase","babysitter","saucepan","lukewarm","hamburger","honeydew","raincheck","thunderstorm","spokesperson","widespread","weekend","hometown","commonplace","moreover","pacemaker","supermarket","supermen","supernatural","superpower","somebody","someday","somehow","someone","anymore","anyplace","anytime","anyway","backhand","watchdog","backlog","backpack","backstage","waterfall","backtrack","noisemaker","underage","underbelly","underbid","undercharge","bookworm","bookstore","bookshelf","bookend","superscript","supersonic","superstar","bookkeeper","bookmark","forgive","forklift","format","fortnight","honeycomb","honeysuckle","honeybee","keyhole","keynote","keyword","lifeblood","lifeboat","lifeguard","lifelike","lifeline","lifelong","forefather","forehead","onetime","supercharge","overabundance","backside","backslap","backspace","backspin","undercut","underdevelop","underdog","underestimate","superstrong","supertanker","superweapon","superwoman","underfoot","however","eyesight","airfield","sidekick","crossover","sunbathe","anywhere","anyhow","backache","backbite","backbreaker","backdrop","backfire","background","textbook","underachieve","underact","underarm","keypad","keystone","keystroke","upstairs","softball","uptight","upstate","superego","superhero","foreman","foresee","oneself","washroom","blackbird","blackboard","blackberries","upend","blacktop","whitecap","whitefish","whitewall","whitewash","friendship","pancake","daytime","upbringing","upbeat","upcoming","repairman","firefighter","standby","bedroom","blackjack","blacklist","blackmail","blackout","uphill","waterline","upkeep","upland","firehouse","teenager","carpool","bellbottom","ballroom","brainchild","pinstripe","bodywork","upward","upwind","upturn","storeroom","deadline","rainbow","watermelon","waterway","daybreak","daybook","daydream","daylight","update","upgrade","upheaval","upheld","upload","washstand","upon","upperclassman","lifesaver","forearm","forbearer","forbid","carhop","carload","carport","carpetbagger","wastepaper","upshot","uplink","upstage","newspaper","grandchild","grandparent","fishpond","fishtail","hookup","eyecatching","taxicab","taxpayer","teacup","teamwork","uppercut","uppercase","uppermost","uprising","newsreel","newsstand","newsworthy","granddaughter","grandfather","grandmaster","upright","uproar","uproot","upstart","grandson","grandstand","boldface","bankbook","bankroll","dishcloth","dishpan","dishwater","cardboard","carefree","caretaker","carsick","carfare","cargo","uptake","upthrust","newsroom","uptime","cartwheel","wheelbase","wheelbarrow","washcloth","fishlike","waterproof","fishnet","watershed","newsman","snowdrift","intake","courtyard","overflow","cornmeal","underclothes","overcoat","undercover","undercurrent","takeover","taleteller","tapeworm","superhuman","wasteland","superman","superhighway","afterlife","setback","overland","highway","mainland","caveman","drawbridge","lifework","firebomb","someplace","passbook","passkey","airtime","firecracker","sidewalk","fireball","notebook","throwaway","fireproof","buttermilk","footnote","moonbeam","Sunday","handmade","candlelight","firearm","airline","crossbow","sideshow","software","sunfish","moonstruck","rattletrap","weatherproof","earthworm","schoolboy","sweetheart","butternut","hereafter","playback","foothill","eyelid","southeast","horseplay","headache","blueprint","raindrop","weekday","hammerhead","foreclose","slowdown","skyscraper","motherhood","fatherland","forecast","highball","forebear","mainline","slumlord","snowball","snakeskin","soundproof","firebreak","aircraft","crosscut","railway","buttercup","allspice","noteworthy","playboy","footlocker","handgun","horsepower","rainstorm","bluegrass","cheeseburger","weeknight","headlight","bedrock","standoff","commonwealth","cancan","fireboat","airlift","Passover","crossbreed","sideburns","sunbaked","moonshine","schoolbook","hereby","playhouse","butterfingers","footlights","handbook","backslide","eyelash","steamship","headline","spillway","houseboat","longhand","horsehair","standpipe","whatsoever","foresight","soybean","bookseller","blueberry","cheesecake","raincoat","thunderbolt","standpoint","bedroll","cardsharp","bellboy","brainwash","bodyguard","pinhole","ponytail","newsboy","duckbill","hookworm","courthouse","afterimage","highchair","mothball","sixfold","skintight","skylight","slapstick","snowbank","standout","handout","eyeglasses","footrest","stepson","stockroom","stonewall","sailboat","watchword","timesaving","timeshare","salesclerk","showoff","sharecropper","sheepskin","candlestick","newsbreak","newscaster","newsprint","butterscotch","turnabout","turnaround","eyewitness","starfish","stagehand","spacewalk","shoemaker","turndown","turnkey","turnoff","horsefly","comedown","comeback","cabdriver","bluebird","tablespoon","tabletop","tableware","stoplight","sunlit","sandlot","snowbird","bluebell","wheelhouse","fishhook","fishbowl","stronghold","tailgate","taillight","pinup","tailspin","takeoff","takeout","bellhop","taproot","target","taskmaster","steamboat","teaspoon","pinwheel","telltale","tenderfoot","tenfold","timekeeper","shoelace","newfound","timetable","sharpshooter","turncoat","aboveboard","tablecloth","sundial","wheelchair","tagalong","tailpiece","taproom","teammate","milkmaid","daisychain","showplace","shortbread","teapot","firewater","airmen","moonscape","schoolwork","hereupon","weathercock","handcuff","headdress","housetop","forever","tailcoat","bedclothes","upstanding","fisheye","afterglow","highland","sisterhood","skylark","waistline","walkways","wallpaper","wardroom","warehouse","warlike","warmblooded","warpath","washbowl","fisherman","schoolbus","ashtray","washboard","washout","blackball","upmarket","washtub","wastebasket","sunroof","sundown","snowshovel","sunup","upset","wastewater","superimpose","watchband","jailbait","jetliner","dogwood","downbeat","backlash","watchman","below","jetport","boardwalk","jackpot","ballpark","watchtower","timepieces","watercolor","watercooler","gumball","goodbye","nevermore","coffeemaker","watercraft","backstroke","waterfront","waterlog","moonwalk","woodshop","jellyfish","waterfowl","uphold","watermark","waterpower","shipbottom","goodnight","nutcracker","racquetball","waterscape","newsletter","waterside","waterspout","scarecrow","toolbox","gearshift","tailbone","watertight","waterworks","waterwheel","wavelength","thunderbird","bugspray","overshoes","paycheck","wavelike","warfare","waxwork","waybill","bowtie","crewcut","typewriter","jumpshot","wayfarer","waylaid","wayward","wayside","deadend","eardrum","postcard","fruitcup","overboard","jellybean","centercut","rubberband","sunray","clockwise","downunder","earache","turntable","driveway","matchbox","motorcycle","nightfall","graveyard","carrack","doorstop","tadpole","eggshell","stopwatch","limelight","ironwork","cattail","nursemaid","sunglasses","wipeout","egghead","eardrop","earthbound","daybed","earring","housework","haircut","blowgun","forethought","upscale","forewarn","upstroke","uptown","foregone","washhouse","forefeet","foreshadow","washrag","forefoot","foretold","forego","foreword","foreground","grassland","butterball","horseman","forecastle","horseradish","foremost","moonlit","forepaws","catwalk","cardstock","newborn","foredoom","newsperson","forestall","rainwater"]
					break

					case "examples":
						var escape = 100
						var examples = []
						var bank = getAsset("words")
						
						while (escape && examples.length < 30) {
							do {
								var word = chooseRandom(bank)
								escape--
							}
							while (escape && examples.includes(word))

							examples.push(word)
						}
						
						return examples
					break

					default:
						return null
					break
				}
			}
			catch (error) {
				logError(error)
				return false
			}
		}

/*** checks ***/
	/* isNumLet */
		module.exports.isNumLet = isNumLet
		function isNumLet(string) {
			try {
				return (/^[a-z0-9A-Z_\s]+$/).test(string)
			}
			catch (error) {
				logError(error)
				return false
			}
		}

	/* isBot */
		module.exports.isBot = isBot
		function isBot(agent) {
			try {
				switch (true) {
					case (agent.indexOf("Googlebot") !== -1):
						return "Googlebot"
					break
				
					case (agent.indexOf("Google Domains") !== -1):
						return "Google Domains"
					break
				
					case (agent.indexOf("Google Favicon") !== -1):
						return "Google Favicon"
					break
				
					case (agent.indexOf("https://developers.google.com/+/web/snippet/") !== -1):
						return "Google+ Snippet"
					break
				
					case (agent.indexOf("IDBot") !== -1):
						return "IDBot"
					break
				
					case (agent.indexOf("Baiduspider") !== -1):
						return "Baiduspider"
					break
				
					case (agent.indexOf("facebook") !== -1):
						return "Facebook"
					break

					case (agent.indexOf("bingbot") !== -1):
						return "BingBot"
					break

					case (agent.indexOf("YandexBot") !== -1):
						return "YandexBot"
					break

					default:
						return null
					break
				}
			}
			catch (error) {
				logError(error)
				return false
			}
		}

/*** tools ***/		
	/* renderHTML */
		module.exports.renderHTML = renderHTML
		function renderHTML(request, path, callback) {
			try {
				var html = {}
				fs.readFile(path, "utf8", function (error, file) {
					if (error) {
						logError(error)
						callback("")
					}
					else {
						html.original = file
						html.array = html.original.split(/<script\snode>|<\/script>node>/gi)

						for (html.count = 1; html.count < html.array.length; html.count += 2) {
							try {
								html.temp = eval(html.array[html.count])
							}
							catch (error) {
								html.temp = ""
								logError("<sn>" + Math.ceil(html.count / 2) + "</sn>\n" + error)
							}
							html.array[html.count] = html.temp
						}

						callback(html.array.join(""))
					}
				})
			}
			catch (error) {
				logError(error)
				callback("")
			}
		}

	/* generateRandom */
		module.exports.generateRandom = generateRandom
		function generateRandom(set, length) {
			try {
				set = set || "0123456789abcdefghijklmnopqrstuvwxyz"
				length = length || 32
				
				var output = ""
				for (var i = 0; i < length; i++) {
					output += (set[Math.floor(Math.random() * set.length)])
				}

				if ((/[a-zA-Z]/).test(set)) {
					while (!(/[a-zA-Z]/).test(output[0])) {
						output = (set[Math.floor(Math.random() * set.length)]) + output.substring(1)
					}
				}

				return output
			}
			catch (error) {
				logError(error)
				return null
			}
		}

	/* chooseRandom */
		module.exports.chooseRandom = chooseRandom
		function chooseRandom(options) {
			try {
				if (!Array.isArray(options)) {
					return false
				}
				else {
					return options[Math.floor(Math.random() * options.length)]
				}
			}
			catch (error) {
				logError(error)
				return false
			}
		}

	/* sortRandom */
		module.exports.sortRandom = sortRandom
		function sortRandom(input) {
			try {
				// duplicate array
					var array = []
					for (var i in input) {
						array[i] = input[i]
					}

				// fisher-yates shuffle
					var x = array.length
					while (x > 0) {
						var y = Math.floor(Math.random() * x)
						x = x - 1
						var temp = array[x]
						array[x] = array[y]
						array[y] = temp
					}

				return array
			}
			catch (error) {
				logError(error)
				return false
			}
		}

	/* sanitizeString */
		module.exports.sanitizeString = sanitizeString
		function sanitizeString(string) {
			try {
				return string.replace(/[^a-zA-Z0-9_\s\!\@\#\$\%\^\&\*\(\)\+\=\-\[\]\\\{\}\|\;\'\:\"\,\.\/\<\>\?]/gi, "")
			}
			catch (error) {
				logError(error)
				return ""
			}
		}

	/* sanitizeObject */
		module.exports.sanitizeObject = sanitizeObject
		function sanitizeObject(object) {
			try {
				var newObject = {}
				for (var p in object) {
					if (typeof object[p] !== "object") {
						newObject[p] = object[p]
					}
					else if (p == "connection") {
						newObject[p] = null
					}
					else {
						newObject[p] = sanitizeObject(object[p])
					}
				}
				return newObject || null
			}
			catch (error) {
				logError(error)
				return null
			}
		}

/*** database ***/
	/* determineSession */
		module.exports.determineSession = determineSession
		function determineSession(request, callback) {
			try {
				if (isBot(request.headers["user-agent"])) {
					request.session = null
				}
				else if (!request.cookie.session || request.cookie.session == null || request.cookie.session == 0) {
					request.session = {
						id: generateRandom(),
						updated: new Date().getTime(),
						info: {
							"ip":         request.ip,
				 			"user-agent": request.headers["user-agent"],
				 			"language":   request.headers["accept-language"],
						}
					}
				}
				else {
					request.session = {
						id: request.cookie.session,
						updated: new Date().getTime(),
						info: {
							"ip":         request.ip,
				 			"user-agent": request.headers["user-agent"],
				 			"language":   request.headers["accept-language"],
						}
					}
				}

				callback()
			}
			catch (error) {
				logError(error)
				callback(false)
			}
		}

	/* cleanDatabase */
		module.exports.cleanDatabase = cleanDatabase
		function cleanDatabase(db) {
			try {
				var games = Object.keys(db)
				var time = new Date().getTime() - (1000 * 60 * 60 * 6)

				for (var g in games) {
					if (games[g].updated < time) {
						delete db[games[g]]
					}
				}
			}
			catch (error) {
				logError(error)
			}
		}
