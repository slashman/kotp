const EnglishBundle = new Map<string, string>([
	["cutscene1.1", "This is the story of my great- grandfather Antonio, a coffee farmer from Oporapa."],
	["cutscene1.2", "A rugged land of mountains and rivers, inhabited by hard-working people known as “the paisa”."],
	["cutscene1.3", "One day, when he was having a cup of coffee with his son, his life changed forever."],
	["cutscene1.4", "The Devil appeared, claiming Antonio\'s soul for him because of his sinful, degenerate life."],
	["cutscene1.5", "He extended his hand, drawing Antonio towards him, but then his eldest son, Aureliano, intervened."],
	["cutscene1.6", "He charged ahead, trying to protect his father, but he was no match for the prince of hell."],
	["cutscene1.7", "Guilt consumed Antonio as the innocent soul of his kid took his place as payment."],
	["cutscene1.8", "Satisfied, The Devil flew to the Farashon hills, his mad laughter filling the night."],
	["cutscene1.9", "My great- grandfather, with tears in his eyes and machete in hand, swore vengeance."],
	["cutscene1.10", "This is the story of how my great- grandfather, Antonio Zapata, beat The Devil."],
	["title.start", "Press %(mainButton)s"],
	["title.newGame", "New Game"],
	["title.continue", "Continue"],
	["ending.1", "With one last powerful and fast swing, he struck the devil down. And just as swiflty, he cut his tail."],
	["ending.2", "He demanded his son\'s soul to be freed from hell and allowed to rest in peace..."],
	["ending.3", "And afraid to lose a horn, the devil accepted."],
	["ending.4", "This tale would win him many bottles of aguardiente... and to all naysayers he would show the tail."],
	["ending.5", "Now, please... Go to sleep!"],

	["intro.1", "The cruel king of Quirkonia, Amandramon, has called for one who can make him laugh, in exchange for lands of dubious quality, and a royal title."],
	["intro.2", "The risk for wasting the monarch's time, however, is noxious. This was evidenced by what happened with the jester, Soliman, whose joke didn't land well."],
	["intro.3", "“Why did the emperor go to therapy? Because he had too many \"reigning\" issues!”"],
	["intro.4", "Soliman is survived by his wife and three kids."],
	["intro.5", "But you won't let this discourage you. You and your traveling party, the \"pun-ishers\" have arrived to Frownborough, the bustling capital city,"],
	["intro.6", "With a single goal in your mind: To earn these lands and establish a settlement: Chuckleburg."],
	["intro.7", "The ultimate test awaits, and you will only survive with your wits and the power of friendship."],


	["acacias.1", "The Devil thought he could mess with you..."],
	["acacias.2", "...but he doesn't know what Antonio Zapata is capable of."],
	["acacias.3", "Leave your farm behind, and journey to the Farashon hills."],
	["acacias.4", "Press %(helpButton)s at any time for help."],

	["oporapa.1", "You left your farm and traveled across the Oporapa,"],
	["oporapa.2", "A cave opening leads to the lair of the devil to the East."],
	["oporapa.3", "It may be a good idea to get supplies in the town down the road before diving in."],

	["help.desktop", "Commands\n---\nMovement: WASD,\n  Numpad or Arrows\n\nEnter/Space:\n  Pass Turn\n\nI: Show Inventory\nR: Save Game / Drop Item\nESC: Close Windows\n\nPress Space for Tips"],
	["help.mobile", "Commands\n---\nA: Pass Turn\nB: Close Windows\n\nStart: Inventory\nSelect: Save Game / Drop Item\n\n\nPress A for Tips"],
	["help.tips", "Find valuable goods in the caves to sell in the towns.\n\nUpgrade your equipment and stock on items to survive.\n\nUse Escape Prayers to escape to safety when needed."],
	["dialog.petDog", "You pet the dog."],
	["dialog.petRosita", "You see Rosita, your companion of many journeys. You trust no one else with your life."],
	["fainted.1", "The last thing you remember is you faded out because of your wounds."],
	["fainted.2", "It seems Rosita pulled your sorry arse into the town..."],
	["fainted.3", "Alas, your posessions except your machete, carriel and ruana, are gone."],
	["action.drop", "You drop the %0s."],
	["action.drop.not", "You want to keep this with you!"],
	["action.drop.cannot", "Cannot drop the %0s here."],

	["action.pick", "You pick up a %0s."],
	["action.pick.cant.mobile", "You can't pick up the %0s. Press Select to drop items from the Inventory screen."],
	["action.pick.cant.desktop", "You can't pick up the %0s. Press [R] to drop items from the [I]nventory screen."],

	["action.pick.first.1", "You just found a %0s."],
	["action.pick.first.2", "It's not directly useful to you, but it's a valuable item"],
	["action.pick.first.3", "Return to a town by praying to St. Benedict, to sell it."],
	["action.pick.first.4", "Then you can use the money to upgrade your equipment,"],
	["action.pick.first.5", "or to get useful items for your next journey."],
	
	["action.use.how", "But how?"],
	["action.use.machete", "You swing your machete, making a whooshing sound."],
	["action.use.ruana", "Justice, is for those that wear ruanas."],
	["action.use.carriel", "You wear the carriel proudly."],
	["action.use.money", "Let's not spend all of it in aguardiente."],
	["action.use.guaro.1", "Your throat burns."],
	["action.use.guaro.2", "You feel a bit dizzy."],
	["action.use.guaro.3", "You feel dizzy."],
	["action.use.guaro.4", "That one entered in reverse..."],
	["action.use.guaro.5", "Your heart aches!"],
	["action.use.guaro", "You feel bold!"],
	["action.use.coffee", "You feel like a new person!"],
	["action.use.aguapanela", "You feel reinvigorated!"],
	["action.use.chocolate", "You feel strong!"],
	["action.use.bandage.noWounds", "You have no wounds to cover."],
	["action.use.bandage", "Your wounds are covered now."],

	["action.use.prayer.unheard", "Your prayer is unheard."],
	["action.use.prayer", "You pray to Saint Benedict to take you to safety. Have faith and withstand."],
	["action.use.prayer.escaped", "You are covered in light. You are back to the valley."],
	["action.use.arepa", "Just like momma used to make. You feel better."],
	["action.use.dongo", "Tasty? You feel better."],

	["dialog.merchant", "May I interest you in some quality goods?."],
	["dialog.merchant.offer", "I'll give you %0s pesos for all your trade goods, do we have a deal?"],
	["dialog.merchant.sold", "Thank you for your business."],
	["dialog.merchant.noMoney", "You cannot afford it!"],
	["dialog.merchant.burdened", "Your inventory is full"],

	["dialog.blacksmith.offer", "I can upgrade your machete for %0s"],
	["dialog.blacksmith.noMoney", "I can upgrade your machete for %0s, let me know when you have the money!"],
	["dialog.blacksmith.upgraded", "It's done. Take good care of it and don't get in trouble."],
	["dialog.blacksmith.cancelled", "Come back when you are ready."],
	["dialog.blacksmith.cap", "Devil himself would fear your machete."],

	["dialog.artisan.offer", "I'm Adriana, I can trade-in your old carriel for a better one for %0s, what do you say?"],
	["dialog.artisan.noMoney", "I'm Adriana, I can trade-in your old carriel for a better one for %0s."],
	["dialog.artisan.upgraded", "Here you are, a beautiful work of craftmanship."],
	["dialog.artisan.cancelled", "So, what are you doing later today?"],
	["dialog.artisan.cap", "I would join you in your adventure, but..."],

	["dialog.tailor.offer", "I am Tiberio, the Tailor. I can make your ruana stronger for %0s. Do we have a deal?"],
	["dialog.tailor.noMoney", "I am Tiberio, the Tailor. I can make your ruana stronger for %0s."],
	["dialog.tailor.upgraded", "I'm happy how it turned out. I hope it serves you well."],
	["dialog.tailor.cancelled", "No problem!"],
	["dialog.tailor.cap", "Your ruana is a masterpiece, wear it proudly."],

	["dialog.distillery.offer", "I run the local distillery. I can offer you Aguardiente for %0s. Do we have a deal?"],
	["dialog.distillery.noMoney", "I run the local distillery. I can offer you Aguardiente for %0s."],
	["dialog.distillery.bought", "Drink responsibly!"],
	["dialog.distillery.cancelled", "No problem!"],
	["dialog.distillery.burdened", "I have a deal for you, but you seem pretty burdened."],

	["dialog.priest.blessed", "May God be with you in this holy mission."],
	["dialog.priest.prompt", "Bring me the Codex of Michael and holy water and I will turn your machete into heavenly punishment."],

	["dialog.priest.1", "Felipe sprinkles the Codex with holy water, and places it in the altar."],
	["dialog.priest.2", "\"Alright, let the interdiction begin. Kneel before the altar and let us pray.\""],
	["dialog.priest.3", "\"Our Lord creator, I beg of you: let this mundane tool become a weapon to vanquish evil from our lands,\""],
	["dialog.priest.4", "\"Let the sadness of this son of yours, Antonio, become the vessel of your power manifested on Earth\""],
	["dialog.priest.5", "\"Amen.\""],
	["dialog.priest.6", "For a moment, nothing happens..."],
	["dialog.priest.7", "But then, the machete starts glowing, and rays of light start emerging from it."],
	["dialog.priest.8", "The inscription, \"Joshua 1:9\", is magically engraved in the blade of the machete."],
	["dialog.priest.9", "\"For good or bad, it is done. Forgive me for placing this burden on you.\""],

	["dialog.guts.1", "You are running low on Guts. This is dangerous."],
	["dialog.guts.2", "Once your Guts are zero, you\'ll receive Wounds directly,"],
	["dialog.guts.3", "and your machetazos will be flimsy."],
	["dialog.guts.4", "Drink or eat something to power up,"],
	["dialog.guts.5", "and if things look grim, pray to St. Benedict to flee the caves."],
	["dialog.guts.6", "That way you will keep all the treasure you have found."],

	["dialog.combat.1", "It's time to face enemies in combat..."],
	["dialog.combat.2", "The lessons taught by Don Abelardo, your father, come to mind."],
	["dialog.combat.3", "Attack the enemies by moving into them."],
	["dialog.combat.4", "The outcomes of the attack are the numbers, representing damage."],
	["dialog.combat.5", "Next to the \"bolt\" icon, you can see your \"berraquera\", your guts."],
	["dialog.combat.6", "When you evade an attack, your guts will go down."],
	["dialog.combat.7", "If you run out of guts, subsequent attacks will cause a wound."],
	["dialog.combat.8", "You can see your vitality next to the \"heart\" icon,"],
	["dialog.combat.9", "Every wound will reduce it by one, if it reaches zero, you'll faint."],
	["dialog.combat.10", "You can restore your guts and wounds with certain items."],
	["dialog.combat.11.mobile", "Finally, remember you can press A to pass your turn."],
	["dialog.combat.11.desktop", "Finally, remember you can press Space to pass your turn."],

	["dialog.says", "%0s says:"],

	["dialog.npc.1", "What do you want?"],
	["dialog.king.1", "Show me what you got."],
	["dialog.npc.2", "A holy man used to live in a cave in the south of the valley."],
	["dialog.npc.3", "Upgrade your machete or you won't stand a chance."],
	["dialog.npc.4", "Laurels in your soup enhance its aroma."],
	["dialog.cat", "Meowwwww!"],
	["dialog.chicken", "Kokoooo!"],
	["dialog.chick", "Pio Pio!"],
	
	["key.space", "Space"],

	["items.machete", "Machete"],
	["items.ruana", "Ruana"],
	["items.carriel", "Carriel"],
	["items.money", "Money"],
	["items.aguardiente", "Aguardiente"],
	["items.coffee", "Coffee"],
	["items.aguapanela", "Aguapanela"],
	["items.chocolate", "Chocolate"],
	["items.bandage", "Bandage"],
	["items.escapePrayer", "Escape Prayer"],
	["items.arepa", "Arepa"],
	["items.dongo", "Dongo"],
	["items.shovel", "Shovel"],
	["items.axe", "Axe"],
	["items.holyWater", "Holy Water"],
	["items.knife", "Knife"],
	["items.crucifix", "Crucifix"],
	["items.tunjo", "Tunjo"],
	["items.codex", "Codex of Michael"],

	["items.machete.description", "Cuts almost anything! But not debts..."],
	["items.ruana.description", "Protects you from harm and cold."],
	["items.carriel.description", "Allows you to carry stuff."],
	["items.money.description", "Trade in towns for useful items."],
	["items.aguardiente.description", "Bolsters your courage, but don\'t take it lightly."],
	["items.coffee.description", "Fresh harvest from Red Minas"],
	["items.aguapanela.description", "Energizer made from sugarcane."],
	["items.chocolate.description", "Delicious drink, drop cheese in it!"],
	["items.bandage.description", "Covers wounds and keeps them clean."],
	["items.escapePrayer.description", "Holy stamp of Saint Benedict, patron of the explorers."],
	["items.arepa.description", "Is this a corn cake? No! It is an arepa!"],
	["items.dongo.description", "A savory healing mushroom."],
	["items.shovel.description", "Trade in towns for money."],
	["items.axe.description", "Trade in towns for money."],
	["items.holyWater.description", "Used in sacred rituals."],
	["items.knife.description", "Trade in towns for money."],
	["items.crucifix.description", "Trade in towns for money."],
	["items.tunjo.description", "Trade in towns for money."],
	["items.codex.description", "A book with depictions of Archangel Michael defeating the devil."],

	["items.aguardiente.effect", "+30 Guts"],
	["items.coffee.effect", "+15 Guts"],
	["items.aguapanela.effect", "+15 Guts"],
	["items.chocolate.effect", "+15 Guts"],
	["items.bandage.effect", "-4 wounds"],
	["items.arepa.effect", "-3 wounds"],
	["items.dongo.effect", "-1 wound"],

	["items.machete.blessedPrefix", "Blessed"],

	["items.level", "Level %0s"],
	["items.attack", "Attack %0s"],
	["items.evade", "Evade %0s%%"],
	["items.carry", "%0s items"],

	["items.currentMoney", "Money: %0s pesos"],
	["ui.buyPrompt.mobile", "A to buy"],
	["ui.buyPrompt.desktop", "Enter to buy"],

	["ui.prompt.desktop", "[Y/N]"],
	["ui.prompt.mobile", "[A to confirm]"],

	["save.prompt", "Save Game?"],
	["save.saving", "Saving Game"],
	["save.saved", "Game saved."],

	["save.notFound", "No savegame found"],
	["save.versionMismatch", "Sorry, your save game is from an older version. (#%0s)"],
	["save.loadError", "Error recovering game data."],

	["animal.mule", "mule"],
	["npc.townsman", "townsman"],
	["animal.dog", "dog"],
	["animal.cat", "cat"],
	["animal.chicken", "chicken"],
	["animal.chick", "chick"],
	["npc.merchant", "merchant"],

	["animal.mule.the", "The mule"],
	["npc.townsman.the", "The townsman"],
	["animal.dog.the", "The dog"],
	["animal.cat.the", "The cat"],
	["animal.chicken.the", "The chicken"],
	["animal.chick.the", "The chick"],
	["npc.merchant.the", "The merchant"],

	["monster.visage", "visage"],
	["monster.bat", "guacharo"],
	["monster.goblin", "goblin"],
	["monster.monkey", "monkey"],
	["monster.caiman", "caiman"],
	["monster.puma", "puma"],
	["monster.jaguar", "jaguar"],
	["monster.crocodile", "crocodile"],

	["dialog.daniel", "I come from the cold highlands of Santa Fé, I love this weather!"],
	["dialog.alejandro", "Dad! Dad! I want to know everything!"],
]);

export default EnglishBundle;