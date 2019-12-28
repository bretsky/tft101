import json
import pymongo
from datetime import datetime

env = json.load(open("env.json", "r"))

myclient = pymongo.MongoClient(env["mongo_url"])
mydb = myclient["comps"]
mycol = mydb["9.24b"]

places = {}
weighted_places = {}
winrates = {}
weighted_winrates = {}

trait_totals = {}
comps = mycol.find()
n = 0
for comp in comps:
	n += 1

	traits = []
	for trait in comp["traits"]:
		if trait["name"] not in trait_totals:
			trait_totals[trait["name"]] = trait["tier_total"]
		if trait["tier_current"] > 0:
			traits.append((trait["name"], trait["tier_current"]))
	key = tuple(sorted(traits, key=lambda x: (x[1] / trait_totals[x[0]], x[0]), reverse=True))

	if key in places:
		places[key].append(comp["place"])
	else:
		places[key] = [comp["place"]]

longest = 0
uniques = 0
counter = 0
sorted_keys = sorted(list(places.keys()), key=lambda x: len(places[x]), reverse=True)

for key in sorted_keys:
	weighted_places[key] = sum(places[key]) / len(places[key]) * (len(places[key]) ** 0.35 - 1) / len(places[key]) ** 0.35 + 4.5 * 1 / len(places[key]) ** 0.35 # Weighting factor to make comps with less data points closer to the average.
	winrates[key] = len(list(filter(lambda x: x < 5, places[key]))) / len(places[key])
	weighted_winrates[key] = winrates[key] * (len(places[key]) ** 0.35 - 1) / len(places[key]) ** 0.35 + 0.5 * 1 / len(places[key]) ** 0.35 # Weighting factor to make comps with less data points closer to the average.
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
for key in sorted_keys[:50]:
	print(', '.join([str(k) for k in key]) + ': ' + str(places[key]))
	print(len(places[key]))
	print(winrates[key])
	print(weighted_winrates[key])



print(n)
print(len(sorted_keys))
print(uniques)
print(longest)