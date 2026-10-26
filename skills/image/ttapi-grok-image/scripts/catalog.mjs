// TTAPI public API contract snapshot verified 2026-10-26. No API calls at import.
export const catalog = {
  "skill": "ttapi-grok-image",
  "title": "TTAPI Grok Image",
  "operations": {
    "grok-image-generate": {
      "family": "Grok Image",
      "description": "Generate one or more images with an explicitly selected Grok image model.",
      "method": "POST",
      "path": "/grok/image",
      "schema": {
        "type": "object",
        "properties": {
          "prompt": {
            "type": "string",
            "description": "Prompt word",
            "minLength": 1
          },
          "model": {
            "type": "string",
            "default": "grok-imagine-1.0",
            "enum": [
              "grok-imagine-1.0",
              "grok-imagine-2.0",
              "grok-imagine-image",
              "grok-imagine-image-quality",
              "grok-imagine-image-2.0"
            ],
            "description": "Image generation model.\n\n**Grok Imagine Series:**\n- `grok-imagine-1.0`\n- `grok-imagine-2.0`\n\n**Grok Image Series:**\n- `grok-imagine-image`\n- `grok-imagine-image-quality`\n- `grok-imagine-image-2.0`",
            "minLength": 1
          },
          "enable_pro": {
            "type": "boolean",
            "default": true,
            "description": "Only supported by `grok-imagine-1.0` and `grok-imagine-2.0`; `grok-imagine-2.0` only allows `true`. Not supported by other models."
          },
          "quality": {
            "type": "string",
            "enum": [
              "low",
              "medium"
            ],
            "description": "Image quality. Only supported by `grok-imagine-image-2.0`.",
            "minLength": 1
          },
          "aspect_ratio": {
            "type": "string",
            "default": "1:1",
            "enum": [
              "1:1",
              "16:9",
              "9:16",
              "3:2",
              "2:3",
              "4:3",
              "3:4",
              "2:1",
              "1:2",
              "19.5:9",
              "9:19.5",
              "20:9",
              "9:20",
              "auto"
            ],
            "description": "Image aspect ratio.\n`grok-imagine-1.0` supports: `1:1` (social media, avatars, thumbnails), `16:9` (landscape images, covers, desktop backgrounds), `9:16` (mobile portrait, short video covers, Stories), `3:2` (landscape photography), `2:3` (portrait photography, posters).\n`grok-imagine-image` and `grok-imagine-image-quality` additionally support: `4:3` (presentations, traditional landscape), `3:4` (portraits, vertical design), `2:1` (horizontal banners, headers), `1:2` (vertical banners, long images), `19.5:9` (horizontal smartphone screens), `9:19.5` (vertical smartphone wallpapers), `20:9` (horizontal ultra-wide screens), `9:20` (vertical ultra-wide screens), `auto` (model automatically selects ratio based on prompt).",
            "minLength": 1
          },
          "resolution": {
            "type": "string",
            "default": "1k",
            "enum": [
              "1k",
              "2k"
            ],
            "description": "Output resolution. **Grok Image Series** (`grok-imagine-image`, `grok-imagine-image-quality`, `grok-imagine-image-2.0`) supports `1k` and `2k`.",
            "minLength": 1
          },
          "n": {
            "type": "integer",
            "default": 1,
            "description": "Number of generated images (1 - 4)",
            "minimum": 1,
            "maximum": 4
          },
          "hook_url": {
            "type": "string",
            "description": "Callback URL. Notifications will be sent to this address when the task is completed or failed, and the notification data structure is consistent with the <a href=\"fetch\" target=\"_self\">fetch structure</a>. If not set, you need to request the <a href=\"fetch\" target=\"_self\">fetch endpoint</a> to query the result.",
            "minLength": 1
          }
        },
        "required": [
          "prompt",
          "model"
        ],
        "additionalProperties": false,
        "allOf": [
          {
            "if": {
              "required": [
                "quality"
              ]
            },
            "then": {
              "properties": {
                "model": {
                  "const": "grok-imagine-image-2.0"
                }
              }
            }
          },
          {
            "if": {
              "required": [
                "resolution"
              ]
            },
            "then": {
              "properties": {
                "model": {
                  "enum": [
                    "grok-imagine-image",
                    "grok-imagine-image-quality",
                    "grok-imagine-image-2.0"
                  ]
                }
              }
            }
          },
          {
            "if": {
              "required": [
                "enable_pro"
              ]
            },
            "then": {
              "properties": {
                "model": {
                  "enum": [
                    "grok-imagine-1.0",
                    "grok-imagine-2.0"
                  ]
                }
              }
            }
          },
          {
            "if": {
              "properties": {
                "model": {
                  "const": "grok-imagine-2.0"
                }
              },
              "required": [
                "model"
              ]
            },
            "then": {
              "properties": {
                "enable_pro": {
                  "const": true
                }
              }
            }
          },
          {
            "if": {
              "properties": {
                "model": {
                  "const": "grok-imagine-1.0"
                }
              },
              "required": [
                "model"
              ]
            },
            "then": {
              "properties": {
                "aspect_ratio": {
                  "enum": [
                    "1:1",
                    "16:9",
                    "9:16",
                    "3:2",
                    "2:3"
                  ]
                }
              }
            }
          }
        ]
      },
      "bodyType": "json",
      "example": {
        "model": "grok-imagine-image",
        "prompt": "A quiet mountain lake at sunrise, detailed illustration, soft natural light.",
        "n": 1,
        "resolution": "1k",
        "aspect_ratio": "1:1"
      },
      "docs": [
        "https://docs.ttapi.io/api/en/grokimage/image",
        "https://docs.ttapi.io/api/en/grokimage/fetch",
        "https://docs.ttapi.io/openapi/en/grokimage.json"
      ],
      "poll": {
        "method": "POST",
        "path": "/grok/image/fetch",
        "idParam": "jobId",
        "location": "query"
      },
      "taskIdPaths": [
        "jobId",
        "data.jobId"
      ],
      "statusPaths": [
        "status"
      ],
      "assetPaths": [
        "data.images"
      ]
    },
    "grok-image-edit": {
      "family": "Grok Image",
      "description": "Edit using one to five supplied reference image URLs.",
      "method": "POST",
      "path": "/grok/image/edits",
      "schema": {
        "type": "object",
        "properties": {
          "prompt": {
            "type": "string",
            "description": "Prompt",
            "minLength": 1
          },
          "model": {
            "type": "string",
            "default": "grok-imagine-1.0-edit",
            "enum": [
              "grok-imagine-1.0-edit",
              "grok-imagine-2.0-edit",
              "grok-imagine-image",
              "grok-imagine-image-quality",
              "grok-imagine-image-2.0"
            ],
            "description": "Image editing model.\n\n**Grok Imagine Series:**\n- `grok-imagine-1.0-edit`\n- `grok-imagine-2.0-edit`\n\n**Grok Image Series:**\n- `grok-imagine-image`\n- `grok-imagine-image-quality`\n- `grok-imagine-image-2.0`",
            "minLength": 1
          },
          "refer_images": {
            "type": "array",
            "minItems": 1,
            "maxItems": 5,
            "description": "Reference image list, supports 1-5 images.",
            "items": {
              "type": "string",
              "minLength": 1,
              "pattern": "^https?://"
            }
          },
          "quality": {
            "type": "string",
            "enum": [
              "low",
              "medium"
            ],
            "description": "Image quality. Only supported by `grok-imagine-image-2.0`.",
            "minLength": 1
          },
          "aspect_ratio": {
            "type": "string",
            "enum": [
              "1:1",
              "16:9",
              "9:16",
              "3:2",
              "2:3",
              "4:3",
              "3:4",
              "2:1",
              "1:2",
              "19.5:9",
              "9:19.5",
              "20:9",
              "9:20",
              "auto"
            ],
            "description": "Output aspect ratio; determined by model if not provided.\n`grok-imagine-1.0-edit` supports: `1:1` (social media, avatars, thumbnails), `16:9` (landscape images, covers, desktop backgrounds), `9:16` (mobile portrait, short video covers, Stories), `3:2` (landscape photography), `2:3` (portrait photography, posters).\n`grok-imagine-image` and `grok-imagine-image-quality` additionally support: `4:3` (presentations, traditional landscape), `3:4` (portraits, vertical design), `2:1` (horizontal banners, headers), `1:2` (vertical banners, long images), `19.5:9` (horizontal smartphone screens), `9:19.5` (vertical smartphone wallpapers), `20:9` (horizontal ultra-wide screens), `9:20` (vertical ultra-wide screens), `auto` (model automatically selects ratio based on prompt).",
            "minLength": 1
          },
          "resolution": {
            "type": "string",
            "default": "1k",
            "enum": [
              "1k",
              "2k"
            ],
            "description": "Output resolution. **Grok Image Series** (`grok-imagine-image`, `grok-imagine-image-quality`, `grok-imagine-image-2.0`) supports `1k` and `2k`.",
            "minLength": 1
          },
          "hook_url": {
            "type": "string",
            "description": "Callback URL. The system will send a notification to this URL when the task is completed or failed. The notification data structure is consistent with the <a href=\"fetch\" target=\"_self\">fetch structure</a>. If not set, you need to call the <a href=\"fetch\" target=\"_self\">fetch endpoint</a> to query the result",
            "minLength": 1
          }
        },
        "required": [
          "prompt",
          "model",
          "refer_images"
        ],
        "additionalProperties": false,
        "allOf": [
          {
            "if": {
              "required": [
                "quality"
              ]
            },
            "then": {
              "properties": {
                "model": {
                  "const": "grok-imagine-image-2.0"
                }
              }
            }
          },
          {
            "if": {
              "required": [
                "resolution"
              ]
            },
            "then": {
              "properties": {
                "model": {
                  "enum": [
                    "grok-imagine-image",
                    "grok-imagine-image-quality",
                    "grok-imagine-image-2.0"
                  ]
                }
              }
            }
          },
          {
            "if": {
              "properties": {
                "model": {
                  "const": "grok-imagine-1.0-edit"
                }
              },
              "required": [
                "model"
              ]
            },
            "then": {
              "properties": {
                "aspect_ratio": {
                  "enum": [
                    "1:1",
                    "16:9",
                    "9:16",
                    "3:2",
                    "2:3"
                  ]
                }
              }
            }
          }
        ]
      },
      "bodyType": "json",
      "example": {
        "model": "grok-imagine-image",
        "prompt": "Restyle this reference as an editorial watercolor image.",
        "refer_images": [
          "https://cdn.ttapi.io/demo/2025-03-30/5d17dd5207daeeac86bcecd2d6405a0.jpg"
        ]
      },
      "docs": [
        "https://docs.ttapi.io/api/en/grokimage/editimage",
        "https://docs.ttapi.io/api/en/grokimage/fetch",
        "https://docs.ttapi.io/openapi/en/grokimage.json"
      ],
      "poll": {
        "method": "POST",
        "path": "/grok/image/fetch",
        "idParam": "jobId",
        "location": "query"
      },
      "taskIdPaths": [
        "jobId",
        "data.jobId"
      ],
      "statusPaths": [
        "status"
      ],
      "assetPaths": [
        "data.images"
      ]
    }
  }
};
