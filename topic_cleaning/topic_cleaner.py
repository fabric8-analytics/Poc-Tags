import re
import json


pattern_to_change = re.compile(' +') # remove one or more spaces
pattern_to_save = '[^a-zA-Z0-9-]' #save only alphabets, numbers and dash
pattern_n2_remove = re.compile(pattern_to_save) #pattern not to remove


class Cleaner(object):

    def __init__(self):
        self.stop_words = Cleaner.load_stop_words() #set of stop_words
        self.aliases = Cleaner.load_aliases() # dict of aliases    

    @staticmethod
    def load_stop_words():
        stop_words = set
        with open('stop_words.txt', 'r') as f:
            for line in f.readlines():
                stop_words.add(line[:-1]) # to remove \n at the end of words
        return stop_words

    @staticmethod    
    def load_aliases():
        alias_words = {}
        with open('aliases.json', 'r') as f:
            alias_words = json.load(f)
        return alias_words

    def remove_redundant(self, topics):
        saved_words = set()
        for t in topics:
            saved_words.add(str(self.aliases.get(t, t)))
        return list(saved_words)    

    def remove_stop_words(self, topic):
            for st in self.stop_words:
                if topic.startswith(st):
                    return None                     
            return topic
                    
    def clean_topics(self, topics):
        if len(topics) == 0:
            return topics
        temp_list = [pattern_to_change.sub('-', t) for t in topics] #replace space with -
        clean_topics = set([pattern_n2_remove.sub('', t.lower()).strip('-') for t in temp_list])
        temp_set = set()
        for each_topic in clean_topics:
            split_list = each_topic.split('-')
            resultant_topic = []
            for term in split_list:
                if term.isalpha() or not re.match('[0-9+]', term):
                    if self.remove_stop_words(term) is not None:
                        resultant_topic.append(term)
            if len(resultant_topic)>0:
                each_topic = '-'.join(resultant_topic)
                temp_set.add(each_topic)
        final_topics = self.remove_redundant(temp_set) # drop redundant words
        final_clean_topics = []
        for topic in final_topics:
            if self.remove_stop_words(topic) is not None:
                        final_clean_topics.append(topic)     
        return final_clean_topics
