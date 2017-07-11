import config
import json
import requests
import os
import sys
import logging


logging.basicConfig(filename=config.LOGFILE_PATH, level=logging.DEBUG)
logger = logging.getLogger(__name__)

class PackageTags(object):

    def __init__(self):
        pass

    @classmethod
    def execute(cls, str_gremlin_dsl):
        logger.debug("PackageTags-- Gremlin DSL:  %s", str_gremlin_dsl)
        payload = {'gremlin': str_gremlin_dsl}
        response = requests.post(config.GREMLIN_SERVER_URL_REST,
                                 data=json.dumps(payload))
        logger.debug("PackageTags--DSL response: %s", response)
        json_response = response.json()
        logger.debug("PackageTags--DSL json_response: %s", json_response)
        return json_response

    @classmethod
    def populate_graph(cls, input_json):
        str_gremlin_dsl = cls.construct_version_query(input_json) 
        return cls.execute(str_gremlin_dsl)


    @classmethod
    def construct_version_query(cls, input_json):
        name = input_json.get('name', '')
        ecosystem = input_json.get('ecosystem', '')
        topics = input_json.get('topics', [])
        str_gremlin = ""
        str_gremlin += "pck=g.V().has('ecosystem', '" + ecosystem \
                        + "').has('name', '" + name + \
                        "' ).tryNext().orElseGet{graph.addVertex('ecosystem', '" \
                        + ecosystem + "', 'name', '" + name + "' )};"
        str_topics = " ".join(map(lambda x: "pck.property('topics', '" + x + "');", topics))
        str_gremlin += str_topics
        return str_gremlin