# -*- coding: utf-8 -*-

"""
AWS session and client factory.

Provides pre-configured boto3 session and clients for the entire codebase.
Import what you need:

    from .boto_ses import bedrock_runtime_client

One place handles credentials, everywhere else just uses the client.
"""

import boto3

from .config import config

boto_ses = boto3.Session(
    region_name=config.aws_region,
    aws_access_key_id=config.aws_access_key_id,
    aws_secret_access_key=config.aws_secret_access_key,
)

# Shared client instance - reuse across requests to avoid connection overhead
bedrock_runtime_client = boto_ses.client("bedrock-runtime")
