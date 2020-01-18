import json
from datetime import datetime

comp_list = json.load(open('comps.json', 'r'))
print((datetime.now() - datetime.fromtimestamp(comp_list["last_update"])).total_seconds())