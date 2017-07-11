import flask
from flask import Flask, request, redirect, make_response
from flask_cors import CORS
import json
import sys
import codecs
import urllib
import logging
import config
from tagging import PackageTags


logging.basicConfig(filename=config.LOGFILE_PATH, level=logging.DEBUG)
logger = logging.getLogger(__name__)


# Python2.x: Make default encoding as UTF-8
if sys.version_info.major == 2:
    reload(sys)
    sys.setdefaultencoding('UTF8')


app = Flask(__name__)
app.config.from_object('config')
CORS(app)


@app.route('/')
def home():
    return flask.jsonify({"All good, unblocking now":config.OK_MESSAGE}), 200

@app.route('/api/v1/')
def ready():
    return flask.jsonify({"All good, unblocking now":config.OK_MESSAGE}), 200

@app.route('/api/v1/add_tags', methods=['POST'])
def add_package_tags():
    input_json = request.get_json()
    app.logger.info("Adding tags")
    expected_keys = set(['ecosystem', 'name', 'topics'])
    if expected_keys != set(input_json.keys()):
        response = {'message': 'Invalid keys found in input: ' + ','.join(input_json.keys())}
        return flask.jsonify(response), 400
    json_response = PackageTags.populate_graph(input_json)
    response = {'message': json_response.get('status',{}).get('message','No message to display')}
    if json_response.get('status',{}).get('code') is not 'Success':
        return flask.jsonify(response), 500
    else:
        return flask.jsonify(response)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=9000)
