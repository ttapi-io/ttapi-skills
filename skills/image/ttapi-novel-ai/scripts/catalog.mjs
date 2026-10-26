// TTAPI public API contract snapshot verified 2026-10-26. No API calls at import.
export const catalog = {
  "skill": "ttapi-novel-ai",
  "title": "TTAPI NovelAI",
  "operations": {
    "novel-text-to-image": {
      "family": "NovelAI",
      "description": "Generate anime or illustration images using documented NovelAI models.",
      "method": "POST",
      "path": "/novelai/text-to-image",
      "schema": {
        "type": "object",
        "properties": {
          "prompt": {
            "type": "string",
            "description": "Image description for generation or modification",
            "minLength": 1
          },
          "model": {
            "type": "string",
            "description": "Model to use",
            "default": "nai-diffusion-5-curated",
            "enum": [
              "nai-diffusion-5-full",
              "nai-diffusion-5-curated",
              "nai-diffusion-4-5-full",
              "nai-diffusion-4-5-curated"
            ],
            "minLength": 1
          },
          "n": {
            "type": "integer",
            "default": 1,
            "description": "Number of images to generate  1 - 4",
            "minimum": 1,
            "maximum": 4
          },
          "width": {
            "type": "integer",
            "default": 1024,
            "description": "Image width",
            "minimum": 1
          },
          "height": {
            "type": "integer",
            "default": 1024,
            "description": "Image height",
            "minimum": 1
          },
          "seed": {
            "type": "string",
            "description": "Seed",
            "minLength": 1
          },
          "steps": {
            "type": "integer",
            "description": "Number of sampling steps",
            "default": 23
          },
          "scale": {
            "type": "number",
            "description": "A lower guidance scale produces softer, more painterly results. A higher guidance scale produces finer details and sharper effects.",
            "default": 5
          },
          "negative_prompt": {
            "type": "string",
            "description": "Unwanted content",
            "minLength": 1
          },
          "quality_toggle": {
            "type": "boolean",
            "description": "Quality toggle",
            "default": true
          },
          "sampler": {
            "type": "string",
            "description": "Sampler",
            "default": "Euler Ancestral",
            "enum": [
              "Euler Ancestral",
              "Euler",
              "DPM++ 2S Ancestral",
              "DPM++ 2M SDE",
              "DPM++ 2M",
              "DPM++ SDE"
            ],
            "minLength": 1
          },
          "noise_schedule": {
            "type": "string",
            "description": "Noise schedule",
            "default": "karras",
            "enum": [
              "karras",
              "exponential",
              "polyexponential"
            ],
            "minLength": 1
          },
          "character_prompts": {
            "type": "array",
            "description": "Character list",
            "items": {
              "type": "object",
              "properties": {
                "prompt": {
                  "type": "string",
                  "description": "Character information",
                  "minLength": 1
                },
                "uc": {
                  "type": "string",
                  "description": "Unwanted character content",
                  "minLength": 1
                },
                "center": {
                  "type": "object",
                  "description": "Character center coordinates in the frame",
                  "properties": {
                    "x": {
                      "type": "number",
                      "description": "X-axis coordinate (between 0-1)",
                      "default": 0.5,
                      "minimum": 0,
                      "maximum": 1
                    },
                    "y": {
                      "type": "number",
                      "description": "Y-axis coordinate (between 0-1)",
                      "default": 0.5,
                      "minimum": 0,
                      "maximum": 1
                    }
                  },
                  "required": [
                    "x",
                    "y"
                  ],
                  "additionalProperties": false
                }
              },
              "required": [
                "prompt",
                "center"
              ],
              "additionalProperties": false
            }
          },
          "vibe_transfer": {
            "type": "array",
            "description": "Atmosphere transfer reference",
            "items": {
              "type": "object",
              "properties": {
                "image": {
                  "type": "string",
                  "description": "Image, URL or base64",
                  "minLength": 1
                },
                "strength": {
                  "type": "number",
                  "description": "Reference strength >= 0 <= 1",
                  "default": 0.6,
                  "minimum": 0,
                  "maximum": 1
                }
              },
              "required": [
                "image"
              ],
              "additionalProperties": false
            }
          },
          "character_reference": {
            "type": "array",
            "description": "Precise reference",
            "items": {
              "type": "object",
              "properties": {
                "image": {
                  "type": "string",
                  "description": "Image, URL or base64",
                  "minLength": 1
                },
                "type": {
                  "type": "string",
                  "description": "Reference type",
                  "enum": [
                    "character&style",
                    "character",
                    "style"
                  ],
                  "default": "character&style",
                  "minLength": 1
                },
                "strength": {
                  "type": "number",
                  "description": "Reference strength >= 0 <= 1. A lower value gives the AI more creative freedom, a higher value makes AI follow the reference more closely, possibly replicating facial expressions, angles, and poses.",
                  "default": 1,
                  "minimum": 0,
                  "maximum": 1
                },
                "fidelity": {
                  "type": "number",
                  "description": "Fidelity >= 0 <= 1",
                  "default": 0,
                  "minimum": 0,
                  "maximum": 1
                }
              },
              "required": [
                "image"
              ],
              "additionalProperties": false
            }
          },
          "hook_url": {
            "type": "string",
            "description": "Callback URL. The task completion or failure will be sent to this URL. The data structure is consistent with the <a href=\"fetch\" target=\"_self\">fetch structure</a>. If not set, you need to call the <a href=\"fetch\" target=\"_self\">fetch API</a> to query.",
            "minLength": 1
          }
        },
        "required": [
          "prompt",
          "model"
        ],
        "additionalProperties": false
      },
      "bodyType": "json",
      "example": {
        "model": "nai-diffusion-5-curated",
        "prompt": "A quiet mountain lake at sunrise, detailed illustration, soft natural light.",
        "n": 1
      },
      "docs": [
        "https://docs.ttapi.io/api/en/novel/text-to-image",
        "https://docs.ttapi.io/openapi/en/novel.json"
      ],
      "poll": {
        "method": "GET",
        "path": "/novelai/fetch",
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
        "data.imageUrl"
      ]
    },
    "novel-image-to-image": {
      "family": "NovelAI",
      "description": "Redraw a supplied URL/base64 image using NovelAI image-to-image controls.",
      "method": "POST",
      "path": "/novelai/image-to-image",
      "schema": {
        "type": "object",
        "properties": {
          "prompt": {
            "type": "string",
            "description": "Image description for generation or modification",
            "minLength": 1
          },
          "model": {
            "type": "string",
            "description": "Model to use",
            "default": "nai-diffusion-5-curated",
            "enum": [
              "nai-diffusion-5-full",
              "nai-diffusion-5-curated",
              "nai-diffusion-4-5-full",
              "nai-diffusion-4-5-curated"
            ],
            "minLength": 1
          },
          "image": {
            "type": "string",
            "description": "Reference image URL or base64",
            "minLength": 1
          },
          "n": {
            "type": "integer",
            "default": 1,
            "description": "Number of images to generate  1 - 4",
            "minimum": 1,
            "maximum": 4
          },
          "width": {
            "type": "integer",
            "default": 1024,
            "description": "Image width",
            "minimum": 1
          },
          "height": {
            "type": "integer",
            "default": 1024,
            "description": "Image height",
            "minimum": 1
          },
          "seed": {
            "type": "string",
            "description": "Seed",
            "minLength": 1
          },
          "steps": {
            "type": "integer",
            "description": "Number of sampling steps",
            "default": 23
          },
          "scale": {
            "type": "number",
            "description": "A lower guidance scale produces softer, more painterly results. A higher guidance scale produces finer details and sharper effects.",
            "default": 5
          },
          "negative_prompt": {
            "type": "string",
            "description": "Unwanted content",
            "minLength": 1
          },
          "quality_toggle": {
            "type": "boolean",
            "description": "Quality toggle",
            "default": true
          },
          "sampler": {
            "type": "string",
            "description": "Sampler",
            "default": "Euler Ancestral",
            "enum": [
              "Euler Ancestral",
              "Euler",
              "DPM++ 2S Ancestral",
              "DPM++ 2M SDE",
              "DPM++ 2M",
              "DPM++ SDE"
            ],
            "minLength": 1
          },
          "noise_schedule": {
            "type": "string",
            "description": "Noise schedule",
            "default": "karras",
            "enum": [
              "karras",
              "exponential",
              "polyexponential"
            ],
            "minLength": 1
          },
          "noise": {
            "type": "number",
            "description": "Image noise, 0 <= noise <= 0.99",
            "default": 0,
            "minimum": 0,
            "maximum": 0.99
          },
          "strength": {
            "type": "number",
            "description": "Strength, 0.01 <= strength <= 0.99",
            "default": 0.7,
            "minimum": 0.01,
            "maximum": 0.99
          },
          "character_prompts": {
            "type": "array",
            "description": "Character list",
            "items": {
              "type": "object",
              "properties": {
                "prompt": {
                  "type": "string",
                  "description": "Character information",
                  "minLength": 1
                },
                "uc": {
                  "type": "string",
                  "description": "Unwanted character content",
                  "minLength": 1
                },
                "center": {
                  "type": "object",
                  "description": "Character center coordinates in the frame",
                  "properties": {
                    "x": {
                      "type": "number",
                      "description": "X-axis coordinate (between 0-1)",
                      "default": 0.5,
                      "minimum": 0,
                      "maximum": 1
                    },
                    "y": {
                      "type": "number",
                      "description": "Y-axis coordinate (between 0-1)",
                      "default": 0.5,
                      "minimum": 0,
                      "maximum": 1
                    }
                  },
                  "required": [
                    "x",
                    "y"
                  ],
                  "additionalProperties": false
                }
              },
              "required": [
                "prompt",
                "center"
              ],
              "additionalProperties": false
            }
          },
          "vibe_transfer": {
            "type": "array",
            "description": "Atmosphere transfer reference",
            "items": {
              "type": "object",
              "properties": {
                "image": {
                  "type": "string",
                  "description": "Image, URL or base64",
                  "minLength": 1
                },
                "strength": {
                  "type": "number",
                  "description": "Reference strength >= 0 <= 1",
                  "default": 0.6,
                  "minimum": 0,
                  "maximum": 1
                }
              },
              "required": [
                "image"
              ],
              "additionalProperties": false
            }
          },
          "character_reference": {
            "type": "array",
            "description": "Precise reference",
            "items": {
              "type": "object",
              "properties": {
                "image": {
                  "type": "string",
                  "description": "Image, URL or base64",
                  "minLength": 1
                },
                "type": {
                  "type": "string",
                  "description": "Reference type",
                  "enum": [
                    "character&style",
                    "character",
                    "style"
                  ],
                  "default": "character&style",
                  "minLength": 1
                },
                "strength": {
                  "type": "number",
                  "description": "Reference strength >= 0 <= 1. A lower value gives the AI more creative freedom, a higher value makes AI follow the reference more closely, possibly replicating facial expressions, angles, and poses.",
                  "default": 1,
                  "minimum": 0,
                  "maximum": 1
                },
                "fidelity": {
                  "type": "number",
                  "description": "Fidelity >= 0 <= 1",
                  "default": 0,
                  "minimum": 0,
                  "maximum": 1
                }
              },
              "required": [
                "image"
              ],
              "additionalProperties": false
            }
          },
          "hook_url": {
            "type": "string",
            "description": "Callback URL. Task completion or failure will be sent to this URL. Data structure matches the <a href=\"fetch\" target=\"_self\">fetch structure</a>.",
            "minLength": 1
          }
        },
        "required": [
          "prompt",
          "model",
          "image"
        ],
        "additionalProperties": false
      },
      "bodyType": "json",
      "example": {
        "model": "nai-diffusion-5-curated",
        "prompt": "Redraw the reference as a detailed watercolor illustration.",
        "image": "https://cdn.ttapi.io/demo/2025-03-30/5d17dd5207daeeac86bcecd2d6405a0.jpg",
        "n": 1,
        "strength": 0.7
      },
      "docs": [
        "https://docs.ttapi.io/api/en/novel/image-to-image",
        "https://docs.ttapi.io/openapi/en/novel.json"
      ],
      "poll": {
        "method": "GET",
        "path": "/novelai/fetch",
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
        "data.imageUrl"
      ]
    }
  }
};
