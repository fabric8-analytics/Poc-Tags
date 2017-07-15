#!/usr/bin/env bash

# --------------------------------------------------------------------------------------------------
# start web service to provide rest end points for this container
# --------------------------------------------------------------------------------------------------

gunicorn --pythonpath /tag_rest -b 0.0.0.0:9000 rest_api:app