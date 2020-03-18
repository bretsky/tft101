from flask import Flask, render_template, request, jsonify, Response, send_from_directory
from flask_cors import CORS
import main
import json
from datetime import datetime
import pymongo
import threading

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
	if wr_col.count_documents({}) == 0:
		winrates = main.update_comps()
		return jsonify(winrates["comps"][:n])
	else:
		comp_list = wr_col.find()[0]
		now = datetime.now()
		last_update = datetime.fromtimestamp(comp_list["last_update"])
		timedelta = (now - last_update).total_seconds()
		if timedelta > 3 * 60 and not comp_list["updating"]:
			thread = threading.Thread(target=main.update_comps, args=())
			thread.start()
		return jsonify(comp_list["comps"][:n])	

if __name__ == '__main__':
	application.run(host='0.0.0.0', port=1999, debug=True)
