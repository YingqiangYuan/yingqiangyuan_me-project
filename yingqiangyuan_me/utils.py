# -*- coding: utf-8 -*-

import sys


def debug(s: str):
    """
    Print debug message to stderr (visible in server logs, not in response).
    """
    print(s, file=sys.stderr)
