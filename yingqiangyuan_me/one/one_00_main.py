# -*- coding: utf-8 -*-

"""Main module defining the One class that aggregates all mixins."""

from .one_01_config import ConfigMixin
from .one_02_boto3 import Boto3Mixin

class One(
    ConfigMixin,
    Boto3Mixin,
):
    """Central class that combines all mixin functionalities for the application."""


one = One()
