from flask import Flask, render_template, request, jsonify, Response, send_from_directory
from flask_cors import CORS
import main
import json
from datetime import datetime

app = Flask(__name__)
CORS(app)

@app.route('/comps', methods=['GET'])
def comps():
	try:
		n = request.args.get('n')
		n = int(n)
	except (ValueError, TypeError) as e:
		n = 10
	try:
		comp_list = json.load(open('comps.json', 'r'))
		if (datetime.now() - datetime.fromtimestamp(comp_list["last_update"])).total_seconds() > 3 * 60 * 60:
			comp_list = main.update_comps()
		return jsonify(comp_list["comps"][:n])
	except IOError:
		comp_list = main.update_comps()
		return jsonify(comp_list["comps"][:n])

if __name__ == '__main__':
	app.run(host='0.0.0.0', port=1999, debug=True)
