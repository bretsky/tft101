import riotapi
import json
import pymongo
from datetime import datetime

env = json.load(open("env.json", "r"))
api_key = env["api-key"]
region = env["region"]
tftregion = env["tftregion"]

riot_api = riotapi.RiotAPI(api_key, region, tftregion)

summoner = riot_api.get_summoner("XIN SHOU")

matches = riot_api.get_tft_matches(summoner)




myclient = pymongo.MongoClient(env["mongo_url"])
mydb = myclient["comps"]
mycol = mydb["9.24b"]

def convert_to_json(participant):
	return {'place': participant.place, 'units': participant.units, 'traits': participant.traits, 'match_id': participant.match_id, 'puuid': participant.puuid}

def push_to_mongo(participant):
	if mycol.find_one({'match_id': participant.match_id, 'puuid': participant.puuid}):
		# We already added this match and participant combination to the collection
		print('already added to collection')
		return
	else:
		print("Uploading")
		mycol.insert_one(convert_to_json(participant))

def save_match(match):
	for participant in match.participants:
		push_to_mongo(participant)

for match in matches:
	# print(match.version)
	version_number = match.version.split(' ')[1].split('.')
	if version_number[0] == env["version_big"] and version_number[1] == env["version_small"]:
		save_match(match)
	else:
		print("Wrong version")
		print(version_number)