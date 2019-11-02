import riotapi
import json

env = json.load(open("env.json", "r"))
api_key = env["api-key"]
region = env["region"]
tftregion = env["tftregion"]

riot_api = riotapi.RiotAPI(api_key, region, tftregion)

bretsky = riot_api.get_summoner("Furukawa")

print(len(riot_api.get_tft_matches(bretsky)))
