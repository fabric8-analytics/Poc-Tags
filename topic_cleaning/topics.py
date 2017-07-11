import json
from topic_cleaner import Cleaner
from topic_aggregator import Aggregator

class Topics(object):
    def __init__(self):
        pass

    @staticmethod    
    def aggregate_clean():
        a = Aggregator()
        c = Cleaner()
        ecosystem_list = ['python', 'maven']
        input_prefix = "filtered"
        mid_term = "package_topic_map"
        output_prefix = "clean"
        for ecosystem in ecosystem_list:
            input_file = input_prefix + "_" + mid_term + "_" + ecosystem + ".json"
            output_file = output_prefix + "_" + mid_term + "_" + ecosystem + ".json"
            input_data = a.load_input_data(input_file)
            output_data = a.get_good_data(input_data, c)
            prune_data = a.prune_topic_list(output_data)
            a.save_output_data(output_file, prune_data)     

    @staticmethod
    def clean_only():
        a = Aggregator()
        c = Cleaner()
        ecosystem_list = ['python', 'maven']
        input_prefix = "aggregated"
        mid_term = "topic_list"
        output_prefix = "clean"
        for ecosystem in ecosystem_list:
            input_file = input_prefix + "_" + mid_term + "_" + ecosystem + ".json"
            output_file = output_prefix + "_" + mid_term + "_" + ecosystem + ".json"
            input_data = a.load_input_data(input_file)
            clean_list = c.clean_topics(input_data)
            a.save_output_data(output_file, clean_list)

if __name__ == '__main__':
    Topics.aggregate_clean()
    Topics.clean_only()
            