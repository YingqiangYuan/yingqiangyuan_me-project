# -*- coding: utf-8 -*-

"""
FastAPI backend for AI chat powered by AWS Bedrock.

This module provides the API endpoints that connect the frontend chat UI
to AWS Bedrock's Nova model. It implements the Vercel AI SDK v5 Data Stream
Protocol using Server-Sent Events (SSE) for real-time streaming responses.

Key components:
- /api/hello: Health check endpoint
- /api/chat: Main chat endpoint that processes messages and streams AI responses
"""

import os
import sys
import json

# fmt: off
from fastapi import FastAPI, Request, Query
from fastapi.responses import JSONResponse, StreamingResponse
from vercel_ai_sdk_mate.api import RequestBody  # Parses AI SDK request format

from yingqiangyuan_me.paths import path_enum  # System prompt & knowledge base paths
from yingqiangyuan_me.one.api import one
from yingqiangyuan_me.utils import debug
from yingqiangyuan_me.ai_sdk_adapter import request_body_to_bedrock_converse_messages
from yingqiangyuan_me.ai_sdk_adapter import debug_ai_sdk_request
from yingqiangyuan_me.ai_sdk_adapter import ai_sdk_message_generator
from yingqiangyuan_me.ai_sdk_adapter import get_last_user_message_text
from yingqiangyuan_me.multi_round_bedrock_runtime_chat_manager import ChatSession
from yingqiangyuan_me.quota import check_quota
from yingqiangyuan_me.quota import increment_usage
from yingqiangyuan_me.quota import QuotaExceededError
# fmt: on

# Add project root to sys.path for module imports
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if project_root not in sys.path:
    sys.path.insert(0, project_root)

app = FastAPI()


@app.get("/api/hello")
async def hello_world():
    """
    Health check endpoint for testing FastAPI integration.

    Returns a simple JSON response to verify the API is running.
    """
    return JSONResponse(
        content={
            "message": "Hello from FastAPI!",
            "status": "success",
        },
    )


@app.post("/api/chat")
async def handle_chat_data(request: Request, protocol: str = Query("data")):
    """
    Main chat endpoint that processes user messages and returns AI responses.

    This endpoint implements the Vercel AI SDK v5 Data Stream Protocol using
    Server-Sent Events (SSE). The frontend sends chat messages, and we stream
    back the AI's response in real-time.

    Protocol docs: https://ai-sdk.dev/docs/ai-sdk-ui/stream-protocol

    Args:
        request: The incoming HTTP request containing chat messages
        protocol: Stream protocol version (default: "data" for AI SDK v5)
    """
    # --- Log incoming request for troubleshooting
    request_body_data = await debug_ai_sdk_request(request=request)

    # --- Parse the incoming request into AI SDK format
    request_body = RequestBody(**request_body_data)

    # --- Check message length ---
    # Uncomment below to enable max message length check, preventing users from sending overly long messages
    # last_user_message = get_last_user_message_text(request_body)
    # If extraction failed, skip validation; otherwise check length
    # if last_user_message and len(last_user_message) > config.max_message_length:
    #     error_msg = f"Message too long. Maximum {config.max_message_length} characters allowed."
    #     response = StreamingResponse(
    #         ai_sdk_message_generator(output_text=error_msg),
    #         media_type="text/event-stream",
    #     )
    #     response.headers["x-vercel-ai-ui-message-stream"] = "v1"
    #     response.headers["Cache-Control"] = "no-cache"
    #     response.headers["Connection"] = "keep-alive"
    #     return response

    # --- Enforce monthly quota before spending tokens ---
    try:
        check_quota(one.bsm)
    except QuotaExceededError as e:
        debug(f"[Quota] blocked: {e}")
        response = StreamingResponse(
            ai_sdk_message_generator(
                output_text=(
                    "Heads up — this is a personal demo, and I've set a "
                    "monthly token budget on it to keep my cloud bill from "
                    "going wild. We've hit that cap for this billing cycle, "
                    "so the chat is paused until the budget resets next "
                    "month. Thanks for trying it out!"
                ),
            ),
            media_type="text/event-stream",
        )
        response.headers["x-vercel-ai-ui-message-stream"] = "v1"
        response.headers["Cache-Control"] = "no-cache"
        response.headers["Connection"] = "keep-alive"
        return response

    # --- Initialize Bedrock chat session ---
    # Uses cross-region inference profile for automatic load balancing across regions
    chat_session = ChatSession(
        client=one.bedrock_runtime_client,
        model_id=one.config.model_id,  # Cross-region inference profile
        system=[
            # System prompt defining AI behavior
            {
                "text": path_enum.instruction_content
            },
            # Cache the system prompt to save costs
            {
                "cachePoint": {"type": "default"}
            },
        ],
    )

    # Restore session ID from frontend to maintain conversation continuity
    chat_session._session_id = request_body.id

    # --- Seed the conversation with knowledge base context ---
    # This pre-populates the chat with background knowledge the AI should reference.
    # The cachePoint ensures this large knowledge base is cached for cost savings.
    chat_session_messages = [
        {
            "role": "user",
            "content": [
                {"text": path_enum.knowledge_base_content},
                {
                    "cachePoint": {"type": "default"}
                },  # Critical: cache the knowledge base
            ],
        },
        {
            "role": "assistant",
            "content": [
                {
                    "text": "I've reviewed the knowledge base and I'm ready to answer questions based on it."
                },
            ],
        },
    ]

    # --- Append conversation history from the frontend ---
    # The AI SDK request contains all previous messages in the chat.
    # We convert them to Bedrock's format to maintain multi-turn conversation context.
    messages = request_body_to_bedrock_converse_messages(request_body)
    chat_session_messages.extend(messages)
    chat_session._messages = chat_session_messages

    # --- Call AWS Bedrock to generate AI response ---
    response = chat_session.send_message([])  # Empty list = no additional content

    # Log response for debugging
    output_text = chat_session.debug_response(response)

    # --- Atomically record token spend for this invocation ---
    # Bedrock Converse returns per-call token totals on response.usage; we feed
    # those straight into the monthly DynamoDB counter via an atomic ADD so
    # concurrent requests can't lose updates.
    try:
        input_tokens = int(response.usage.inputTokens or 0)
        output_tokens = int(response.usage.outputTokens or 0)
        increment_usage(
            one.bsm,
            input_tokens=input_tokens,
            output_tokens=output_tokens,
        )
    except Exception as e:  # pragma: no cover - never let metering break a reply
        debug(f"[Quota] increment failed: {e}")

    # --- Return SSE streaming response ---
    # AI SDK v5 uses "x-vercel-ai-ui-message-stream" header (not "x-vercel-ai-data-stream")
    response = StreamingResponse(
        ai_sdk_message_generator(output_text=output_text),
        media_type="text/event-stream",  # Standard MIME type for Server-Sent Events
    )
    response.headers["x-vercel-ai-ui-message-stream"] = "v1"  # Required for AI SDK v5
    response.headers["Cache-Control"] = (
        "no-cache"  # Disable caching for real-time streaming
    )
    response.headers["Connection"] = "keep-alive"  # Keep connection open for SSE
    return response
