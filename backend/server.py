from flask import Flask, render_template, request, jsonify, Response, send_from_directory
from flask_cors import CORS
import main
import json

app = Flask(__name__)
CORS(app)

@app.route('/comps', methods=['GET'])
def comps():
	try:
		comp_list = json.load(open('comps.json', 'r'))
	except IOError:
		comp_list = main.update_comps()