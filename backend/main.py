import json
import pymongo
from datetime import datetime
import pytz
import requests
from PIL import Image

env = json.load(open("env.json", "r"))
# champ_data = json.load(open("champions.json", "r"))

version = requests.get("https://ddragon.leagueoflegends.com/api/versions.json").json()[0]

myclient = pymongo.MongoClient(env["mongo_url"])
comp_db = myclient["comps"]
wr_db = myclient["winrates"]
comp_col = comp_db[version]
wr_col = wr_db[version]
set_data = myclient["set_data"]
set_traits = set_data["set_traits"]
set_champions = set_data["set_champions"]


indices = {"bronze": 2, "silver": 3, "gold": 4, "chromatic": 5}


def update_comps():
	now = datetime.utcnow()
	now = now.replace(tzinfo=pytz.utc)
	local_now = now.astimezone(pytz.timezone('America/Toronto'))
	jsonobject = {"last_update": local_now.timestamp(), "last_update_human": local_now.strftime("%m/%d/%Y, %H:%M:%S"), "updating": True}
	wr_col.update_one({}, {'$set': jsonobject}, upsert=True)
	places = {}
	weighted_places = {}
	winrates = {}
	weighted_winrates = {}
	champs = {}
	trait_totals = {}
	for trait in set_traits.find():
		trait_totals[trait["key"]] = trait["sets"][-1]["min"]
	comps = comp_col.find({})
	print("Got comps")
	n = 0
	for comp in comps:
		n += 1

		traits = []
		for trait in comp["traits"]:
			if trait["tier_current"] > 0:
				traits.append((trait["name"], trait["tier_current"]))
		key = tuple(sorted(traits, key=lambda x: (x[1] / trait_totals[x[0]], x[0]), reverse=True))

		if key in places:
			places[key].append(comp["place"])
		else:
			places[key] = [comp["place"]]

		if key not in champs:
			champs[key] = {}
		added_champs = set()
		for champ in comp["units"]:
			name = champ["name"]
			if name == "":
				name = champ["character_id"]
			if name in added_champs:
				continue
			added_champs.add(name)
			if name in champs[key]:
				champs[key][name][0] += 1
			else:
				champs[key][name] = [1, {}]
			for item in champ["items"]:
				if item in champs[key][name][1]:
					champs[key][name][1][item] += 1
				else:
					champs[key][name][1][item] = 1


	print("recorded comps")
	longest = 0
	uniques = 0
	counter = 0
	sorted_keys = sorted(list(places.keys()), key=lambda x: len(places[x]), reverse=True)

	for key in sorted_keys:
		weighted_places[key] = sum(places[key]) / len(places[key]) * (len(places[key]) ** 0.4 - 1) / len(places[key]) ** 0.4 + 4.5 * 1 / len(places[key]) ** 0.4 # Weighting factor to make comps with less data points closer to the average.
		winrates[key] = len(list(filter(lambda x: x < 5, places[key]))) / len(places[key])
		weighted_winrates[key] = winrates[key] * (len(places[key]) ** 0.4 - 1) / len(places[key]) ** 0.4 + 0.5 * 1 / len(places[key]) ** 0.4 # Weighting factor to make comps with less data points closer to the average.
		if len(places[key]) == 1:
			uniques += 1
		if len(places[key]) > longest:
			longest = len(places[key])
		if counter < 50:
			# print(', '.join([str(k) for k in key]) + ': ' + str(places[key]))
			counter += 1
			# print(winrates[key])
			# print(weighted_winrates[key])

	sorted_keys = sorted(list(places.keys()), key=lambda x: weighted_winrates[x], reverse=True)
	now = datetime.utcnow()
	now = now.replace(tzinfo=pytz.utc)
	local_now = now.astimezone(pytz.timezone('America/Toronto'))
	jsonobject = {"last_update": local_now.timestamp(), "comps": [], "last_update_human": local_now.strftime("%m/%d/%Y, %H:%M:%S"), "updating": True}
	print("updating")
	wr_col.update_one({}, {'$set': jsonobject}, upsert=True)
	temp_comps = []
	print(len(sorted_keys))
	for key in sorted_keys[:5000]:
		sorted_champs = [(k, champs[key][k][0]/len(places[key]), [(item_key, champs[key][k][1][item_key]/champs[key][k][0]) for item_key in sorted(list(champs[key][k][1].keys()), key=lambda x: champs[key][k][1][x], reverse=True)]) for k in sorted(list(champs[key].keys()), key=lambda x: champs[key][x][0], reverse=True)]
		comp_json = {"comp": key, "weighted_winrate": weighted_winrates[key], "winrate": winrates[key], "instances": len(places[key]), "champs": sorted_champs}
		temp_comps.append(comp_json)
		if len(temp_comps) > 100:
			# print("uploading 100 comps")
			wr_col.update_one({}, {"$push": {"comps": {"$each": temp_comps}}})
			temp_comps = []
	wr_col.update_one({}, {"$push": {"comps": {"$each": temp_comps}}})
	update_false = {"updating": False}
	wr_col.update_one({}, {'$set': update_false})
	# json.dump(jsonobject, open('comps.json', 'w'))
	# for key in sorted_keys[:50]:
	# 	print(', '.join([str(k) for k in key]) + ': ' + str(places[key]))
	# 	print(len(places[key]))
	# 	print(winrates[key])
	# 	print(weighted_winrates[key])



	# print(n)
	# print(len(sorted_keys))
	# print(uniques)
	# print(longest)
	return jsonobject

def get_trait_image(trait, n, logger):
	colour = get_colour(trait, n, logger)
	trait = trait.replace(' ', '')
	image_name = "set/computed_images/{}_{}.png".format(trait, colour)
	try:
		img = Image.open(image_name)
		return image_name
	except FileNotFoundError:
		bg = Image.open("set/traits/bg.png")
		index = indices[colour]
		bg = bg.crop((56 * index, 0, 56 * index + 52, 58))
		icon = Image.open("set/traits/{}.png".format(trait))
		icon = icon.convert("RGBA")
		data = icon.load()
		for y in range(icon.size[1]):
			for x in range(icon.size[0]):
				if data[x, y] == (196, 196, 196, 255):
					data[x, y] = (0, 0, 0, 0)
		# icon.putdata(data)
		icon = icon.resize((int(icon.size[0] * 0.6), int(icon.size[1] * 0.6)), Image.BICUBIC)
		bg.paste(icon, ((bg.size[0] - icon.size[0]) // 2, (bg.size[1] - icon.size[1]) // 2), icon)
		bg.save(image_name)
		return image_name


def get_colour(trait, n, logger):
	logger.info(trait)
	for t in set_traits.find():
		if t["name"].lower() == trait:
			logger.info(len(t["sets"]))
			logger.info(t["sets"][n - 1])
			return t["sets"][n - 1]["style"]
	return None



if __name__ == "__main__":
	update_comps()