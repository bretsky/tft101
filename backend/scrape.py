import riotapi
import json
import pymongo
from datetime import datetime
import sys
import requests

env = json.load(open("env.json", "r"))
version = requests.get("https://ddragon.leagueoflegends.com/api/versions.json").json()[0]
api_key = env["api-key"]
region = env["region"]
tftregion = env["tftregion"]

riot_api = riotapi.RiotAPI(api_key, region, tftregion)



myclient = pymongo.MongoClient(env["mongo_url"])
mydb = myclient["comps"]
mycol = mydb[version]

def convert_to_json(participant):
	return {'place': participant.place, 'units': participant.units, 'traits': participant.traits, 'match_id': participant.match_id, 'puuid': participant.puuid}

def push_to_mongo(participant):
	if mycol.find_one({'match_id': participant.match_id, 'puuid': participant.puuid}):
		# We already added this match and participant combination to the collection
		print('already added to collection')
		return False
	else:
		print("Uploading")
		mycol.insert_one(convert_to_json(participant))
		return participant.puuid

def save_match(match):
	participants = []
	for participant in match.participants:
		participant = push_to_mongo(participant)
		if participant:
			participants.append(participant)
	print(participants)
	return participants

def save_recent_matches(puuid):
	summoner = riot_api.get_summoner_by_puuid(puuid)
	if summoner.null == True:
		return []
	print(summoner.name)
	matches = riot_api.get_tft_matches(summoner)
	puuids = []
	for match in matches:
		# print(match.version)
		if match != False:
			version_number = match.version.split(' ')[1].split('.')
			current_version = version.split('.')
			if version_number[0] == current_version[0] and version_number[1] == current_version[1]:
				puuids.extend(save_match(match))
			else:
				print("Wrong version")
			print(version_number)
	print(puuids)
	return puuids


def recursive_scrape(puuid, added):
	if len(added) > 500 or puuid in added:
		return
	puuids = save_recent_matches(puuid)
	print(len(added))
	added.append(puuid)
	for puuid in puuids:
		recursive_scrape(puuid, added)

if len(sys.argv) > 1:
	first_summoner = riot_api.get_summoner(sys.argv[1])
else: 
	first_summoner = riot_api.get_summoner("Furukawa")

recursive_scrape(first_summoner.puuid, [])