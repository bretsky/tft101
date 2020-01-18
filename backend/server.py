from flask import Flask, render_template, request, jsonify, Response, send_from_directory
from flask_cors import CORS
import main
import json
from datetime import datetime
import pymongo

application = Flask(__name__)
CORS(application)

env = json.load(open("env.json", "r"))

myclient = pymongo.MongoClient(env["mongo_url"])

wr_db = myclient["winrates"]
wr_col = wr_db[env["version_big"] + "." + env["version_small"]]


@application.route('/comps', methods=['GET'])
def comps():
	try:
		n = request.args.get('n')
		n = int(n)
	except (ValueError, TypeError) as e:
		n = 10
	comp_list = wr_col.find()
	if comp_list.count() == 0 or (datetime.now() - datetime.fromtimestamp(comp_list[0]["last_update"])).total_seconds() > 3 * 60:
		winrates = main.update_comps()
	else:
		winrates = comp_list[0]
	return jsonify(winrates["comps"][:n])

if __name__ == '__main__':
	application.run(host='0.0.0.0', port=1999, debug=True)
