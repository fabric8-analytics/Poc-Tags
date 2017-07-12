import config
import json
import logging
import boto3
import botocore


logging.basicConfig(filename=config.LOGFILE_PATH, level=logging.DEBUG)
logger = logging.getLogger(__name__)

class UserJson(object):
    def __init__(self, bucket_name, access_key, secret_key):
        self.session = boto3.session.Session(aws_access_key_id=access_key, aws_secret_access_key=secret_key)
        self.s3_resource = self.session.resource('s3', config=botocore.client.Config(signature_version='s3v4'))
        self.bucket_name = bucket_name

    def read_json_file(self, file_name):
        try:
            obj = self.s3_resource.Object(self.bucket_name, file_name).get()['Body'].read()
            utf_data = obj.decode("utf-8")
            return json.loads(utf_data)        
        except Exception as e:
            return False

    def write_json_file(self, file_name, data):
        """Write JSON file into S3 bucket"""
        try:
            self.s3_resource.Object(self.bucket_name, file_name).put(Body=json.dumps(data))
            return True
        except Exception as e:
            return False
        
    def get_file_name(self, input_json):
        user_name = input_json['user']
        postfix = "_user.json"
        file_name = user_name + postfix
        return file_name

    def get_user_json(self, input_json):
        user_json= {}
        ecosystem = input_json['ecosystem']
        file_name = self.get_file_name(input_json)
        if ecosystem != 'pypi':
            file_name = ecosystem + "/"+ file_name
        file_data = self.read_json_file(file_name)
        user_json['user'] = input_json['user']
        user_json['data'] = file_data
        return user_json

    def submit_user_tags(self, input_json):    
        file_name = self.get_file_name(input_json)
        data = input_json['data']
        ecosystem = input_json['data']['ecosystem']
        if ecosystem != 'pypi':
            file_name = ecosystem + "/"+ file_name
        if self.write_json_file(file_name, data):
            return {"Tagging": "Successful!"}
        return {"Tagging": "Failed :("}    