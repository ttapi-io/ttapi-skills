// Official TTAPI schemas, checked 2026-10-26. No credentials or network calls.
export const catalog = {
  "skill": "ttapi-gemini-video",
  "title": "TTAPI Gemini video: Veo and Omni Flash",
  "operations": {
    "gemini-video-generate": {
      "family": "gemini-video",
      "description": "Generate video with Veo 3.1 or Gemini Omni Flash; asynchronous.",
      "method": "POST",
      "path": "/gemini/video/generations",
      "bodyType": "json",
      "schema": {
        "type": "object",
        "properties": {
          "prompt": {
            "type": "string",
            "description": "Video prompt",
            "example": "A cinematic shot of a futuristic city at sunset",
            "minLength": 1
          },
          "model": {
            "type": "string",
            "description": "Video model.",
            "default": "omni-flash",
            "enum": [
              "veo-3.1-fast",
              "veo-3.1-quality",
              "veo-3.1-lite",
              "omni-flash"
            ]
          },
          "aspect_ratio": {
            "type": "string",
            "description": "Video aspect ratio. Required.",
            "enum": [
              "16:9",
              "9:16"
            ],
            "example": "16:9"
          },
          "resolution": {
            "type": "string",
            "description": "Resolution level.",
            "enum": [
              "720p",
              "1080p"
            ],
            "example": "720p"
          },
          "duration": {
            "type": "string",
            "description": "Video duration (seconds). Veo 3.1 models (`veo-3.1-fast`, `veo-3.1-quality`, `veo-3.1-lite`) only support `8`.",
            "enum": [
              "4",
              "6",
              "8",
              "10"
            ],
            "example": "8"
          },
          "generation_type": {
            "type": "string",
            "description": "Video generation type. `frame`: frame-to-video; `reference`: reference-image-to-video. If omitted, auto-detected by image count: 2 images = frame-to-video, 3 images = reference-to-video.",
            "enum": [
              "frame",
              "reference"
            ],
            "example": "frame"
          },
          "reference_images": {
            "type": "array",
            "description": "Reference images, up to 3. Each item must be an http(s):// URL. JPEG and PNG are supported. ",
            "maxItems": 3,
            "items": {
              "type": "string",
              "minLength": 1,
              "pattern": "^https?://"
            },
            "example": [
              "https://cdn.ttapi.io/example/reference-image.png"
            ]
          },
          "reference_videos": {
            "type": "array",
            "description": "Reference or source video for editing, up to 1 (multiple video references are not supported). Each item must be an http(s):// URL. Currently available only for the `omni-flash` model.",
            "maxItems": 1,
            "items": {
              "type": "string",
              "minLength": 1,
              "pattern": "^https?://"
            },
            "example": [
              "https://cdn.ttapi.io/example/reference-video.mp4"
            ]
          },
          "hookUrl": {
            "type": "string",
            "description": "Callback URL for completion or failure notifications",
            "example": "https://example.com/callback"
          }
        },
        "required": [
          "prompt",
          "model",
          "aspect_ratio"
        ],
        "additionalProperties": false,
        "allOf": [
          {
            "if": {
              "properties": {
                "model": {
                  "enum": [
                    "veo-3.1-fast",
                    "veo-3.1-quality",
                    "veo-3.1-lite"
                  ]
                }
              },
              "required": [
                "model"
              ]
            },
            "then": {
              "properties": {
                "duration": {
                  "enum": [
                    "8"
                  ]
                },
                "reference_videos": {
                  "maxItems": 0
                }
              }
            }
          }
        ]
      },
      "example": {
        "model": "veo-3.1-fast",
        "prompt": "A paper boat floats across a quiet pond at sunrise, cinematic wide shot.",
        "aspect_ratio": "16:9",
        "resolution": "720p",
        "duration": "8"
      },
      "docs": [
        "https://docs.ttapi.io/api/en/gemini/video-generations.md",
        "https://docs.ttapi.io/openapi/en/gemini.json"
      ],
      "poll": {
        "method": "GET",
        "path": "/gemini/video/fetch",
        "idParam": "jobId",
        "location": "query"
      },
      "assetPaths": [
        "data.video_url"
      ]
    },
    "gemini-video-extend": {
      "family": "gemini-video",
      "description": "Extend a successful Gemini video job; unsupported for omni-flash.",
      "method": "POST",
      "path": "/gemini/video/extend",
      "bodyType": "json",
      "schema": {
        "type": "object",
        "properties": {
          "jobId": {
            "type": "string",
            "description": "jobId returned by a completed Gemini video generation or extension task",
            "example": "0ccf0606-3f32-4090-85bd-1786e4593be5",
            "minLength": 1
          },
          "prompt": {
            "type": "string",
            "description": "Prompt for the extended video",
            "example": "Continue the scene with the camera moving through the futuristic city",
            "minLength": 1
          },
          "aspect_ratio": {
            "type": "string",
            "description": "Video aspect ratio. Required.",
            "enum": [
              "16:9",
              "9:16"
            ],
            "example": "16:9"
          },
          "resolution": {
            "type": "string",
            "description": "Resolution level.",
            "enum": [
              "720p",
              "1080p"
            ],
            "example": "720p"
          },
          "hookUrl": {
            "type": "string",
            "description": "Callback URL for completion or failure notifications",
            "example": "https://example.com/callback"
          }
        },
        "required": [
          "jobId",
          "prompt",
          "aspect_ratio"
        ],
        "additionalProperties": false
      },
      "example": {
        "jobId": "REPLACE_WITH_SUCCESSFUL_VEO_JOB_ID",
        "prompt": "Continue the camera movement over the quiet pond.",
        "aspect_ratio": "16:9",
        "resolution": "720p"
      },
      "docs": [
        "https://docs.ttapi.io/api/en/gemini/video-extend.md",
        "https://docs.ttapi.io/openapi/en/gemini.json"
      ],
      "poll": {
        "method": "GET",
        "path": "/gemini/video/fetch",
        "idParam": "jobId",
        "location": "query"
      },
      "assetPaths": [
        "data.video_url"
      ]
    }
  }
};
