import json


class Aggregator(object):
    def __init__(self):
        pass

    def load_input_data(self, filename):
        with open(filename, 'r') as f:
            input_data = json.load(f)
        return input_data

    def save_output_data(self, filename, output_data):
        with open(filename, 'w') as f:
            json.dump(output_data, f , indent=4)
        # return input_data

    def get_good_data(self, input_data, topic_cleaner):
        clean_package_topics = {}
        clean_package_topics['ecosystem'] = input_data['ecosystem']
        clean_package_topics['package_topic_map'] = {}
        package_topics = input_data.get('package_topic_map', {})
        for pck_name, pck_topics in package_topics.items():
            clean_package_topics['package_topic_map'][pck_name] = topic_cleaner.clean_topics(pck_topics)
        return clean_package_topics

    def prune_topic_list(self, input_data):
        package_topics = input_data.get('package_topic_map', {})
        for pck_name, pck_topics in package_topics.items():
            input_data['package_topic_map'][pck_name] = pck_topics[:5]
        return input_data
        