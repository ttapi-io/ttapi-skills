// TTAPI public API contract snapshot verified 2026-10-26. No API calls at import.
export const catalog = {
  "skill": "ttapi-flux-image",
  "title": "TTAPI FLUX Image",
  "operations": {
    "flux-generate": {
      "family": "FLUX Image",
      "description": "Generate images through TTAPI’s Flux compatibility request.",
      "method": "POST",
      "path": "/flux/generate",
      "schema": {
        "type": "object",
        "description": "**Note**: The synchronous response from the Flux image generation endpoint is not the final result of the task. The final result needs to be received via asynchronous notification using the `hookUrl` parameter, or by querying through the <a href=\"fetch\" target=\"_self\">Flux fetch task result</a> endpoint.",
        "properties": {
          "prompt": {
            "type": "string",
            "description": "Image description. Note: Flux supports multilingual understanding, but English performs best in testing.",
            "minLength": 1
          },
          "mode": {
            "type": "string",
            "description": "Model version",
            "enum": [
              "flux1-dev",
              "flux1-pro",
              "flux-kontext-pro",
              "flux-kontext-max",
              "flux-2-pro",
              "flux-2-flex",
              "flux-2-max",
              "flux-2-klein-4b",
              "flux-2-klein-9b"
            ],
            "minLength": 1
          },
          "size": {
            "type": "string",
            "description": "Image size",
            "enum": [
              "1024x1024",
              "1024x1792",
              "1792x1024"
            ],
            "minLength": 1
          },
          "aspect_ratio": {
            "type": "string",
            "description": "Aspect ratio",
            "enum": [
              "21:9",
              "16:9",
              "4:3",
              "3:2",
              "1:1",
              "2:3",
              "3:4",
              "9:16",
              "9:21"
            ],
            "minLength": 1
          },
          "hookUrl": {
            "type": "string",
            "description": "Callback notification URL",
            "minLength": 1
          }
        },
        "required": [
          "prompt",
          "mode"
        ],
        "additionalProperties": false
      },
      "bodyType": "json",
      "example": {
        "prompt": "A quiet mountain lake at sunrise, detailed illustration, soft natural light.",
        "mode": "flux-2-pro",
        "size": "1024x1024"
      },
      "docs": [
        "https://docs.ttapi.io/api/en/flux/index",
        "https://docs.ttapi.io/api/en/flux/fetch",
        "https://docs.ttapi.io/openapi/en/flux.json"
      ],
      "poll": {
        "method": "GET",
        "path": "/flux/fetch",
        "idParam": "jobId",
        "location": "body",
        "bodyType": "multipart"
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
    "flux-edit": {
      "family": "FLUX Image",
      "description": "Edit with one or more local reference files using the documented multipart route.",
      "method": "POST",
      "path": "/flux/edits",
      "schema": {
        "type": "object",
        "properties": {
          "image": {
            "oneOf": [
              {
                "type": "object",
                "additionalProperties": false,
                "required": [
                  "$file"
                ],
                "properties": {
                  "$file": {
                    "type": "string",
                    "minLength": 1,
                    "description": "Local image path; read and sent as a multipart file."
                  }
                }
              },
              {
                "type": "array",
                "minItems": 1,
                "items": {
                  "type": "object",
                  "additionalProperties": false,
                  "required": [
                    "$file"
                  ],
                  "properties": {
                    "$file": {
                      "type": "string",
                      "minLength": 1,
                      "description": "Local image path; read and sent as a multipart file."
                    }
                  }
                }
              }
            ],
            "description": "One local image or an array; converted to repeated multipart image fields."
          },
          "prompt": {
            "type": "string",
            "description": "Image description. Note: Flux supports multilingual understanding, but English performs best in testing.",
            "minLength": 1
          },
          "mode": {
            "type": "string",
            "description": "Model version",
            "enum": [
              "flux1-dev",
              "flux1-schnell",
              "flux1-pro",
              "flux-kontext-pro",
              "flux-kontext-max",
              "flux-2-pro",
              "flux-2-flex",
              "flux-2-max",
              "flux-2-klein-4b",
              "flux-2-klein-9b"
            ],
            "minLength": 1
          },
          "aspect_ratio": {
            "type": "string",
            "description": "Aspect ratio",
            "enum": [
              "21:9",
              "16:9",
              "4:3",
              "3:2",
              "1:1",
              "2:3",
              "3:4",
              "9:16",
              "9:21"
            ],
            "minLength": 1
          },
          "hookUrl": {
            "type": "string",
            "description": "Callback notification URL",
            "minLength": 1
          }
        },
        "required": [
          "image",
          "mode"
        ],
        "additionalProperties": false
      },
      "bodyType": "multipart",
      "example": {
        "image": {
          "$file": "./reference.png"
        },
        "mode": "flux-kontext-pro",
        "prompt": "Restyle the supplied image as a soft watercolor."
      },
      "docs": [
        "https://docs.ttapi.io/api/en/flux/index",
        "https://docs.ttapi.io/api/en/flux/fetch",
        "https://docs.ttapi.io/openapi/en/flux.json"
      ],
      "poll": {
        "method": "GET",
        "path": "/flux/fetch",
        "idParam": "jobId",
        "location": "body",
        "bodyType": "multipart"
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
    "flux-kontext-max": {
      "family": "FLUX Image",
      "description": "Generate or reference-edit using Flux Kontext Max.",
      "method": "POST",
      "path": "/bfl/v1/flux-kontext-max",
      "schema": {
        "type": "object",
        "description": "Generate or edit images using the Flux Kontext Max model based on text prompts. <a href=\"https://docs.bfl.ai/api/tasks/edit-or-create-an-image-with-flux-kontext-max\" target=\"_self\">Official documentation</a>",
        "properties": {
          "prompt": {
            "type": "string",
            "description": "Image description. Note: Flux supports multilingual understanding, but English performs best in testing.",
            "minLength": 1
          },
          "input_image": {
            "type": "string",
            "description": "Reference image 1, URL or base64",
            "minLength": 1
          },
          "input_image_2": {
            "type": "string",
            "description": "Reference image 2, URL or base64",
            "minLength": 1
          },
          "input_image_3": {
            "type": "string",
            "description": "Reference image 3, URL or base64",
            "minLength": 1
          },
          "input_image_4": {
            "type": "string",
            "description": "Reference image 4, URL or base64",
            "minLength": 1
          },
          "aspect_ratio": {
            "type": "string",
            "description": "Aspect ratio",
            "enum": [
              "21:9",
              "9:21"
            ],
            "minLength": 1
          },
          "seed": {
            "type": "string",
            "description": "Random seed",
            "minLength": 1
          },
          "output_format": {
            "type": "string",
            "description": "Output format",
            "enum": [
              "jpeg",
              "png"
            ],
            "minLength": 1
          },
          "prompt_upsampling": {
            "type": "boolean",
            "description": "Whether to enable prompt upsampling. true - yes, false - no",
            "enum": [
              false,
              true
            ]
          },
          "safety_tolerance": {
            "type": "integer",
            "description": "Safety tolerance level for input and output adjustment. Range: 0-6, where 0 is strictest and 6 is most permissive. Default: 2",
            "minimum": 0,
            "maximum": 6
          },
          "webhook_url": {
            "type": "string",
            "description": "Asynchronous callback URL",
            "minLength": 1
          }
        },
        "required": [
          "prompt"
        ],
        "additionalProperties": false
      },
      "bodyType": "json",
      "example": {
        "prompt": "A quiet mountain lake at sunrise, detailed illustration, soft natural light."
      },
      "docs": [
        "https://docs.ttapi.io/api/en/flux/flux-kontext-max",
        "https://docs.ttapi.io/api/en/flux/fetch",
        "https://docs.ttapi.io/openapi/en/flux.json"
      ],
      "poll": {
        "method": "GET",
        "path": "/flux/fetch",
        "idParam": "jobId",
        "location": "body",
        "bodyType": "multipart"
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
    "flux-kontext-pro": {
      "family": "FLUX Image",
      "description": "Generate or reference-edit using Flux Kontext Pro.",
      "method": "POST",
      "path": "/bfl/v1/flux-kontext-pro",
      "schema": {
        "type": "object",
        "description": "Generate or edit images using the Flux Kontext Max model based on text prompts. <a href=\"https://docs.bfl.ai/api/tasks/edit-or-create-an-image-with-flux-kontext-max\" target=\"_self\">Official documentation</a>",
        "properties": {
          "prompt": {
            "type": "string",
            "description": "Image description. Note: Flux supports multilingual understanding, but English performs best in testing.",
            "minLength": 1
          },
          "input_image": {
            "type": "string",
            "description": "Reference image 1, URL or base64",
            "minLength": 1
          },
          "input_image_2": {
            "type": "string",
            "description": "Reference image 2, URL or base64",
            "minLength": 1
          },
          "input_image_3": {
            "type": "string",
            "description": "Reference image 3, URL or base64",
            "minLength": 1
          },
          "input_image_4": {
            "type": "string",
            "description": "Reference image 4, URL or base64",
            "minLength": 1
          },
          "aspect_ratio": {
            "type": "string",
            "description": "Aspect ratio",
            "enum": [
              "21:9",
              "9:21"
            ],
            "minLength": 1
          },
          "seed": {
            "type": "string",
            "description": "Random seed",
            "minLength": 1
          },
          "output_format": {
            "type": "string",
            "description": "Output format",
            "enum": [
              "jpeg",
              "png"
            ],
            "minLength": 1
          },
          "prompt_upsampling": {
            "type": "boolean",
            "description": "Whether to enable prompt upsampling. true - yes, false - no",
            "enum": [
              false,
              true
            ]
          },
          "safety_tolerance": {
            "type": "integer",
            "description": "Safety tolerance level for input and output adjustment. Range: 0-6, where 0 is strictest and 6 is most permissive. Default: 2",
            "minimum": 0,
            "maximum": 6
          },
          "webhook_url": {
            "type": "string",
            "description": "Asynchronous callback URL",
            "minLength": 1
          }
        },
        "required": [
          "prompt"
        ],
        "additionalProperties": false
      },
      "bodyType": "json",
      "example": {
        "prompt": "A quiet mountain lake at sunrise, detailed illustration, soft natural light."
      },
      "docs": [
        "https://docs.ttapi.io/api/en/flux/flux-kontext-pro",
        "https://docs.ttapi.io/api/en/flux/fetch",
        "https://docs.ttapi.io/openapi/en/flux.json"
      ],
      "poll": {
        "method": "GET",
        "path": "/flux/fetch",
        "idParam": "jobId",
        "location": "body",
        "bodyType": "multipart"
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
    "flux-ultra": {
      "family": "FLUX Image",
      "description": "Generate using Flux 1.1 Pro Ultra.",
      "method": "POST",
      "path": "/bfl/v1/flux-pro-1.1-ultra",
      "schema": {
        "type": "object",
        "properties": {
          "prompt": {
            "type": "string",
            "description": "Image description. Note: Flux supports multilingual understanding, but English performs best in testing.",
            "minLength": 1
          },
          "aspect_ratio": {
            "type": "string",
            "description": "Aspect ratio",
            "enum": [
              "21:9",
              "9:21"
            ],
            "minLength": 1
          },
          "image_prompt": {
            "type": "string",
            "description": "Reference image, base64 encoded",
            "minLength": 1
          },
          "raw": {
            "type": "string",
            "description": "Generate images with lower processing and more natural appearance. Default: false",
            "minLength": 1
          },
          "seed": {
            "type": "string",
            "description": "Random seed",
            "minLength": 1
          },
          "output_format": {
            "type": "string",
            "description": "Output format",
            "enum": [
              "jpeg",
              "png"
            ],
            "minLength": 1
          },
          "prompt_upsampling": {
            "type": "boolean",
            "description": "Whether to enable prompt upsampling. true - yes, false - no",
            "enum": [
              false,
              true
            ]
          },
          "safety_tolerance": {
            "type": "integer",
            "description": "Safety tolerance level for input and output adjustment. Range: 0-6, where 0 is strictest and 6 is most permissive. Default: 2",
            "minimum": 0,
            "maximum": 6
          },
          "webhook_url": {
            "type": "string",
            "description": "Asynchronous callback URL",
            "minLength": 1
          }
        },
        "required": [
          "prompt"
        ],
        "additionalProperties": false
      },
      "bodyType": "json",
      "example": {
        "prompt": "A quiet mountain lake at sunrise, detailed illustration, soft natural light."
      },
      "docs": [
        "https://docs.ttapi.io/api/en/flux/flux-pro-1.1-ultra",
        "https://docs.ttapi.io/api/en/flux/fetch",
        "https://docs.ttapi.io/openapi/en/flux.json"
      ],
      "poll": {
        "method": "GET",
        "path": "/flux/fetch",
        "idParam": "jobId",
        "location": "body",
        "bodyType": "multipart"
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
    "flux-pro-1-1": {
      "family": "FLUX Image",
      "description": "Generate using Flux 1.1 Pro.",
      "method": "POST",
      "path": "/bfl/v1/flux-pro-1.1",
      "schema": {
        "type": "object",
        "properties": {
          "prompt": {
            "type": "string",
            "description": "Image description. Note: Flux supports multilingual understanding, but English performs best in testing.",
            "minLength": 1
          },
          "image_prompt": {
            "type": "string",
            "description": "Reference image, base64 encoded",
            "minLength": 1
          },
          "width": {
            "type": "string",
            "description": "Width of generated image. Range: 256-1440, must be a multiple of 32. Default: 1024",
            "minLength": 1
          },
          "height": {
            "type": "string",
            "description": "Height of generated image. Range: 256-1440, must be a multiple of 32. Default: 768",
            "minLength": 1
          },
          "output_format": {
            "type": "string",
            "description": "Output format",
            "enum": [
              "jpeg",
              "png"
            ],
            "minLength": 1
          },
          "prompt_upsampling": {
            "type": "boolean",
            "description": "Whether to enable prompt upsampling. true - yes, false - no",
            "enum": [
              false,
              true
            ]
          },
          "safety_tolerance": {
            "type": "integer",
            "description": "Safety tolerance level for input and output adjustment. Range: 0-6, where 0 is strictest and 6 is most permissive. Default: 2",
            "minimum": 0,
            "maximum": 6
          },
          "webhook_url": {
            "type": "string",
            "description": "Asynchronous callback URL",
            "minLength": 1
          }
        },
        "required": [
          "prompt"
        ],
        "additionalProperties": false
      },
      "bodyType": "json",
      "example": {
        "prompt": "A quiet mountain lake at sunrise, detailed illustration, soft natural light."
      },
      "docs": [
        "https://docs.ttapi.io/api/en/flux/flux-pro-1.1",
        "https://docs.ttapi.io/api/en/flux/fetch",
        "https://docs.ttapi.io/openapi/en/flux.json"
      ],
      "poll": {
        "method": "GET",
        "path": "/flux/fetch",
        "idParam": "jobId",
        "location": "body",
        "bodyType": "multipart"
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
    "flux-pro": {
      "family": "FLUX Image",
      "description": "Generate using Flux 1 Pro.",
      "method": "POST",
      "path": "/bfl/v1/flux-pro",
      "schema": {
        "type": "object",
        "properties": {
          "prompt": {
            "type": "string",
            "description": "Image description. Note: Flux supports multilingual understanding, but English performs best in testing.",
            "minLength": 1
          },
          "image_prompt": {
            "type": "string",
            "description": "Reference image, base64 encoded",
            "minLength": 1
          },
          "width": {
            "type": "string",
            "description": "Width of generated image. Range: 256-1440, must be a multiple of 32. Default: 1024",
            "minLength": 1
          },
          "height": {
            "type": "string",
            "description": "Height of generated image. Range: 256-1440, must be a multiple of 32. Default: 768",
            "minLength": 1
          },
          "seed": {
            "type": "string",
            "description": "Random seed",
            "minLength": 1
          },
          "output_format": {
            "type": "string",
            "description": "Output format",
            "enum": [
              "jpeg",
              "png"
            ],
            "minLength": 1
          },
          "prompt_upsampling": {
            "type": "boolean",
            "description": "Whether to enable prompt upsampling. true - yes, false - no",
            "enum": [
              false,
              true
            ]
          },
          "safety_tolerance": {
            "type": "integer",
            "description": "Safety tolerance level for input and output adjustment. Range: 0-6, where 0 is strictest and 6 is most permissive. Default: 2",
            "minimum": 0,
            "maximum": 6
          },
          "steps": {
            "type": "integer",
            "description": "Number of steps in image generation process. Range: 1-50. Default: 40",
            "minimum": 1,
            "maximum": 50
          },
          "guidance": {
            "type": "number",
            "description": "Guidance scale for image generation. Higher guidance increases prompt adherence at the cost of realism. Range: 1.5-5. Default: 2.5",
            "minimum": 1.5,
            "maximum": 5
          },
          "interval": {
            "type": "number",
            "description": "Interval parameter for guidance control. Range: 1-4. Default: 2",
            "minimum": 1,
            "maximum": 4
          },
          "webhook_url": {
            "type": "string",
            "description": "Asynchronous callback URL",
            "minLength": 1
          }
        },
        "required": [
          "prompt"
        ],
        "additionalProperties": false
      },
      "bodyType": "json",
      "example": {
        "prompt": "A quiet mountain lake at sunrise, detailed illustration, soft natural light."
      },
      "docs": [
        "https://docs.ttapi.io/api/en/flux/flux-pro",
        "https://docs.ttapi.io/api/en/flux/fetch",
        "https://docs.ttapi.io/openapi/en/flux.json"
      ],
      "poll": {
        "method": "GET",
        "path": "/flux/fetch",
        "idParam": "jobId",
        "location": "body",
        "bodyType": "multipart"
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
    "flux-dev": {
      "family": "FLUX Image",
      "description": "Generate using Flux 1 Dev.",
      "method": "POST",
      "path": "/bfl/v1/flux-dev",
      "schema": {
        "type": "object",
        "properties": {
          "prompt": {
            "type": "string",
            "description": "Image description. Note: Flux supports multilingual understanding, but English performs best in testing.",
            "minLength": 1
          },
          "image_prompt": {
            "type": "string",
            "description": "Reference image, base64 encoded",
            "minLength": 1
          },
          "width": {
            "type": "string",
            "description": "Width of generated image. Range: 256-1440, must be a multiple of 32. Default: 1024",
            "minLength": 1
          },
          "height": {
            "type": "string",
            "description": "Height of generated image. Range: 256-1440, must be a multiple of 32. Default: 768",
            "minLength": 1
          },
          "seed": {
            "type": "string",
            "description": "Random seed",
            "minLength": 1
          },
          "output_format": {
            "type": "string",
            "description": "Output format",
            "enum": [
              "jpeg",
              "png"
            ],
            "minLength": 1
          },
          "prompt_upsampling": {
            "type": "boolean",
            "description": "Whether to enable prompt upsampling. true - yes, false - no",
            "enum": [
              false,
              true
            ]
          },
          "safety_tolerance": {
            "type": "integer",
            "description": "Safety tolerance level for input and output adjustment. Range: 0-6, where 0 is strictest and 6 is most permissive. Default: 2",
            "minimum": 0,
            "maximum": 6
          },
          "steps": {
            "type": "integer",
            "description": "Number of steps in image generation process. Range: 1-50. Default: 40",
            "minimum": 1,
            "maximum": 50
          },
          "guidance": {
            "type": "number",
            "description": "Guidance scale for image generation. Higher guidance increases prompt adherence at the cost of realism. Range: 1.5-5. Default: 2.5",
            "minimum": 1.5,
            "maximum": 5
          },
          "webhook_url": {
            "type": "string",
            "description": "Asynchronous callback URL",
            "minLength": 1
          }
        },
        "required": [
          "prompt"
        ],
        "additionalProperties": false
      },
      "bodyType": "json",
      "example": {
        "prompt": "A quiet mountain lake at sunrise, detailed illustration, soft natural light."
      },
      "docs": [
        "https://docs.ttapi.io/api/en/flux/flux-dev",
        "https://docs.ttapi.io/api/en/flux/fetch",
        "https://docs.ttapi.io/openapi/en/flux.json"
      ],
      "poll": {
        "method": "GET",
        "path": "/flux/fetch",
        "idParam": "jobId",
        "location": "body",
        "bodyType": "multipart"
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
    "flux-2-pro": {
      "family": "FLUX Image",
      "description": "Generate or reference-edit using Flux 2 Pro.",
      "method": "POST",
      "path": "/bfl/v1/flux-2-pro",
      "schema": {
        "type": "object",
        "properties": {
          "prompt": {
            "type": "string",
            "description": "Image description. Note: Flux supports multilingual understanding, but English performs best in testing.",
            "minLength": 1
          },
          "input_image": {
            "type": "string",
            "description": "Reference image 1, URL or base64",
            "minLength": 1
          },
          "input_image_2": {
            "type": "string",
            "description": "Reference image 2, URL or base64",
            "minLength": 1
          },
          "input_image_3": {
            "type": "string",
            "description": "Reference image 3, URL or base64",
            "minLength": 1
          },
          "input_image_4": {
            "type": "string",
            "description": "Reference image 4, URL or base64",
            "minLength": 1
          },
          "image_prompt": {
            "type": "string",
            "description": "Reference image, base64 encoded",
            "minLength": 1
          },
          "width": {
            "type": "string",
            "description": "Width of generated image. Range: 256-1440, must be a multiple of 32. Default: 1024",
            "minLength": 1
          },
          "height": {
            "type": "string",
            "description": "Height of generated image. Range: 256-1440, must be a multiple of 32. Default: 768",
            "minLength": 1
          },
          "seed": {
            "type": "string",
            "description": "Random seed",
            "minLength": 1
          },
          "output_format": {
            "type": "string",
            "description": "Output format",
            "enum": [
              "jpeg",
              "png"
            ],
            "minLength": 1
          },
          "safety_tolerance": {
            "type": "integer",
            "description": "Safety tolerance level for input and output adjustment. Range: 0-6, where 0 is strictest and 6 is most permissive. Default: 2",
            "minimum": 0,
            "maximum": 6
          },
          "webhook_url": {
            "type": "string",
            "description": "Asynchronous callback URL",
            "minLength": 1
          }
        },
        "required": [
          "prompt"
        ],
        "additionalProperties": false
      },
      "bodyType": "json",
      "example": {
        "prompt": "A quiet mountain lake at sunrise, detailed illustration, soft natural light."
      },
      "docs": [
        "https://docs.ttapi.io/api/en/flux/flux-2-pro",
        "https://docs.ttapi.io/api/en/flux/fetch",
        "https://docs.ttapi.io/openapi/en/flux.json"
      ],
      "poll": {
        "method": "GET",
        "path": "/flux/fetch",
        "idParam": "jobId",
        "location": "body",
        "bodyType": "multipart"
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
    "flux-2-flex": {
      "family": "FLUX Image",
      "description": "Generate or reference-edit using Flux 2 Flex.",
      "method": "POST",
      "path": "/bfl/v1/flux-2-flex",
      "schema": {
        "type": "object",
        "properties": {
          "prompt": {
            "type": "string",
            "description": "Image description. Note: Flux supports multilingual understanding, but English performs best in testing.",
            "minLength": 1
          },
          "input_image": {
            "type": "string",
            "description": "Reference image 1, URL or base64",
            "minLength": 1
          },
          "input_image_2": {
            "type": "string",
            "description": "Reference image 2, URL or base64",
            "minLength": 1
          },
          "input_image_3": {
            "type": "string",
            "description": "Reference image 3, URL or base64",
            "minLength": 1
          },
          "input_image_4": {
            "type": "string",
            "description": "Reference image 4, URL or base64",
            "minLength": 1
          },
          "image_prompt": {
            "type": "string",
            "description": "Reference image, base64 encoded",
            "minLength": 1
          },
          "width": {
            "type": "string",
            "description": "Width of generated image. Range: 256-1440, must be a multiple of 32. Default: 1024",
            "minLength": 1
          },
          "height": {
            "type": "string",
            "description": "Height of generated image. Range: 256-1440, must be a multiple of 32. Default: 768",
            "minLength": 1
          },
          "seed": {
            "type": "string",
            "description": "Random seed",
            "minLength": 1
          },
          "output_format": {
            "type": "string",
            "description": "Output format",
            "enum": [
              "jpeg",
              "png"
            ],
            "minLength": 1
          },
          "safety_tolerance": {
            "type": "integer",
            "description": "Safety tolerance level for input and output adjustment. Range: 0-6, where 0 is strictest and 6 is most permissive. Default: 2",
            "minimum": 0,
            "maximum": 6
          },
          "webhook_url": {
            "type": "string",
            "description": "Asynchronous callback URL",
            "minLength": 1
          }
        },
        "required": [
          "prompt"
        ],
        "additionalProperties": false
      },
      "bodyType": "json",
      "example": {
        "prompt": "A quiet mountain lake at sunrise, detailed illustration, soft natural light."
      },
      "docs": [
        "https://docs.ttapi.io/api/en/flux/flux-2-flex",
        "https://docs.ttapi.io/api/en/flux/fetch",
        "https://docs.ttapi.io/openapi/en/flux.json"
      ],
      "poll": {
        "method": "GET",
        "path": "/flux/fetch",
        "idParam": "jobId",
        "location": "body",
        "bodyType": "multipart"
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
    "flux-2-max": {
      "family": "FLUX Image",
      "description": "Generate or reference-edit using Flux 2 Max.",
      "method": "POST",
      "path": "/bfl/v1/flux-2-max",
      "schema": {
        "type": "object",
        "properties": {
          "prompt": {
            "type": "string",
            "description": "Image description. Note: Flux supports multilingual understanding, but English performs best in testing.",
            "minLength": 1
          },
          "input_image": {
            "type": "string",
            "description": "Reference image 1, URL or base64",
            "minLength": 1
          },
          "input_image_2": {
            "type": "string",
            "description": "Reference image 2, URL or base64",
            "minLength": 1
          },
          "input_image_3": {
            "type": "string",
            "description": "Reference image 3, URL or base64",
            "minLength": 1
          },
          "input_image_4": {
            "type": "string",
            "description": "Reference image 4, URL or base64",
            "minLength": 1
          },
          "image_prompt": {
            "type": "string",
            "description": "Reference image, base64 encoded",
            "minLength": 1
          },
          "width": {
            "type": "string",
            "description": "Width of generated image. Range: 256-1440, must be a multiple of 32. Default: 1024",
            "minLength": 1
          },
          "height": {
            "type": "string",
            "description": "Height of generated image. Range: 256-1440, must be a multiple of 32. Default: 768",
            "minLength": 1
          },
          "seed": {
            "type": "string",
            "description": "Random seed",
            "minLength": 1
          },
          "output_format": {
            "type": "string",
            "description": "Output format",
            "enum": [
              "jpeg",
              "png"
            ],
            "minLength": 1
          },
          "safety_tolerance": {
            "type": "integer",
            "description": "Safety tolerance level for input and output adjustment. Range: 0-6, where 0 is strictest and 6 is most permissive. Default: 2",
            "minimum": 0,
            "maximum": 6
          },
          "webhook_url": {
            "type": "string",
            "description": "Asynchronous callback URL",
            "minLength": 1
          }
        },
        "required": [
          "prompt"
        ],
        "additionalProperties": false
      },
      "bodyType": "json",
      "example": {
        "prompt": "A quiet mountain lake at sunrise, detailed illustration, soft natural light."
      },
      "docs": [
        "https://docs.ttapi.io/api/en/flux/flux-2-max",
        "https://docs.ttapi.io/api/en/flux/fetch",
        "https://docs.ttapi.io/openapi/en/flux.json"
      ],
      "poll": {
        "method": "GET",
        "path": "/flux/fetch",
        "idParam": "jobId",
        "location": "body",
        "bodyType": "multipart"
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
    "flux-2-klein-4b": {
      "family": "FLUX Image",
      "description": "Generate or reference-edit using Flux 2 Klein 4B.",
      "method": "POST",
      "path": "/bfl/v1/flux-2-klein-4b",
      "schema": {
        "type": "object",
        "properties": {
          "prompt": {
            "type": "string",
            "description": "Image description. Note: Flux supports multilingual understanding, but English performs best in testing.",
            "minLength": 1
          },
          "input_image": {
            "type": "string",
            "description": "Reference image 1, URL or base64",
            "minLength": 1
          },
          "input_image_2": {
            "type": "string",
            "description": "Reference image 2, URL or base64",
            "minLength": 1
          },
          "input_image_3": {
            "type": "string",
            "description": "Reference image 3, URL or base64",
            "minLength": 1
          },
          "input_image_4": {
            "type": "string",
            "description": "Reference image 4, URL or base64",
            "minLength": 1
          },
          "image_prompt": {
            "type": "string",
            "description": "Reference image, base64 encoded",
            "minLength": 1
          },
          "width": {
            "type": "string",
            "description": "Width of generated image. Range: 256-1440, must be a multiple of 32. Default: 1024",
            "minLength": 1
          },
          "height": {
            "type": "string",
            "description": "Height of generated image. Range: 256-1440, must be a multiple of 32. Default: 768",
            "minLength": 1
          },
          "seed": {
            "type": "string",
            "description": "Random seed",
            "minLength": 1
          },
          "output_format": {
            "type": "string",
            "description": "Output format",
            "enum": [
              "jpeg",
              "png"
            ],
            "minLength": 1
          },
          "safety_tolerance": {
            "type": "integer",
            "description": "Safety tolerance level for input and output adjustment. Range: 0-6, where 0 is strictest and 6 is most permissive. Default: 2",
            "minimum": 0,
            "maximum": 6
          },
          "webhook_url": {
            "type": "string",
            "description": "Asynchronous callback URL",
            "minLength": 1
          }
        },
        "required": [
          "prompt"
        ],
        "additionalProperties": false
      },
      "bodyType": "json",
      "example": {
        "prompt": "A quiet mountain lake at sunrise, detailed illustration, soft natural light."
      },
      "docs": [
        "https://docs.ttapi.io/api/en/flux/flux-2-klein-4b",
        "https://docs.ttapi.io/api/en/flux/fetch",
        "https://docs.ttapi.io/openapi/en/flux.json"
      ],
      "poll": {
        "method": "GET",
        "path": "/flux/fetch",
        "idParam": "jobId",
        "location": "body",
        "bodyType": "multipart"
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
    "flux-2-klein-9b": {
      "family": "FLUX Image",
      "description": "Generate or reference-edit using Flux 2 Klein 9B.",
      "method": "POST",
      "path": "/bfl/v1/flux-2-klein-9b",
      "schema": {
        "type": "object",
        "properties": {
          "prompt": {
            "type": "string",
            "description": "Image description. Note: Flux supports multilingual understanding, but English performs best in testing.",
            "minLength": 1
          },
          "input_image": {
            "type": "string",
            "description": "Reference image 1, URL or base64",
            "minLength": 1
          },
          "input_image_2": {
            "type": "string",
            "description": "Reference image 2, URL or base64",
            "minLength": 1
          },
          "input_image_3": {
            "type": "string",
            "description": "Reference image 3, URL or base64",
            "minLength": 1
          },
          "input_image_4": {
            "type": "string",
            "description": "Reference image 4, URL or base64",
            "minLength": 1
          },
          "image_prompt": {
            "type": "string",
            "description": "Reference image, base64 encoded",
            "minLength": 1
          },
          "width": {
            "type": "string",
            "description": "Width of generated image. Range: 256-1440, must be a multiple of 32. Default: 1024",
            "minLength": 1
          },
          "height": {
            "type": "string",
            "description": "Height of generated image. Range: 256-1440, must be a multiple of 32. Default: 768",
            "minLength": 1
          },
          "seed": {
            "type": "string",
            "description": "Random seed",
            "minLength": 1
          },
          "output_format": {
            "type": "string",
            "description": "Output format",
            "enum": [
              "jpeg",
              "png"
            ],
            "minLength": 1
          },
          "safety_tolerance": {
            "type": "integer",
            "description": "Safety tolerance level for input and output adjustment. Range: 0-6, where 0 is strictest and 6 is most permissive. Default: 2",
            "minimum": 0,
            "maximum": 6
          },
          "webhook_url": {
            "type": "string",
            "description": "Asynchronous callback URL",
            "minLength": 1
          }
        },
        "required": [
          "prompt"
        ],
        "additionalProperties": false
      },
      "bodyType": "json",
      "example": {
        "prompt": "A quiet mountain lake at sunrise, detailed illustration, soft natural light."
      },
      "docs": [
        "https://docs.ttapi.io/api/en/flux/flux-2-klein-9b",
        "https://docs.ttapi.io/api/en/flux/fetch",
        "https://docs.ttapi.io/openapi/en/flux.json"
      ],
      "poll": {
        "method": "GET",
        "path": "/flux/fetch",
        "idParam": "jobId",
        "location": "body",
        "bodyType": "multipart"
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
    "flux-3-image": {
      "family": "FLUX Image",
      "description": "Generate, edit, restyle or combine up to ten references using FLUX 3 Image.",
      "method": "POST",
      "path": "/bfl/v1/flux-3-image",
      "schema": {
        "type": "object",
        "properties": {
          "prompt": {
            "type": "string",
            "description": "Free-form prompt describing the image. Without `images`, it generates a new image from the prompt. With reference images, state what to change and refer to them in order as image 1 and image 2. Bounding boxes can be appended to the prompt, using a 0 to 1000 grid as `[top, left, bottom, right]`.",
            "minLength": 1
          },
          "images": {
            "oneOf": [
              {
                "type": "string",
                "minLength": 1
              },
              {
                "type": "array",
                "items": {
                  "type": "string",
                  "minLength": 1
                },
                "minItems": 1,
                "maxItems": 10
              }
            ],
            "description": "Optional reference images. Omit them for text-to-image. When present, the prompt edits a detail, changes the style, or combines the references. Each item is an http(s) URL or base64, 1 to 10 total. Each image must be at least 256×256."
          },
          "aspect_ratio": {
            "type": "string",
            "description": "Output aspect ratio. With `auto`, a ratio named in the prompt wins; otherwise the output keeps the first reference image's framing. Without references, the prompt decides, otherwise `1:1`. Set the ratio explicitly for text-to-image.",
            "default": "auto",
            "enum": [
              "auto",
              "21:9",
              "2:1",
              "16:9",
              "3:2",
              "7:5",
              "4:3",
              "5:4",
              "1:1",
              "4:5",
              "3:4",
              "5:7",
              "2:3",
              "9:16",
              "1:2",
              "9:21"
            ],
            "minLength": 1
          },
          "resolution": {
            "type": "string",
            "description": "Image resolution tier by similar pixel area. Exact width and height vary with the aspect ratio.",
            "default": "1k",
            "enum": [
              "768sq",
              "1k",
              "1.5k",
              "2k",
              "4k"
            ],
            "minLength": 1
          },
          "safety_tolerance": {
            "type": "integer",
            "description": "Harm moderation tolerance from 0 to 7, with 0 the strictest. Default is 2. The route and organization determine the approved maximum and the ceiling for each category.",
            "minimum": 0,
            "maximum": 7,
            "default": 2
          },
          "grounding": {
            "type": "boolean",
            "description": "When `true` (default), the prompt may be grounded with web search and image search. When `false`, both are off, generation is faster, and the model uses only the prompt.",
            "default": true
          },
          "webhook_url": {
            "type": "string",
            "description": "Async callback URL. The initial response returns `jobId`. Use this callback or the [Flux fetch API](/api/en/flux/fetch) to get the final image.",
            "minLength": 1
          }
        },
        "required": [
          "prompt"
        ],
        "additionalProperties": false
      },
      "bodyType": "json",
      "example": {
        "prompt": "A quiet mountain lake at sunrise, detailed illustration, soft natural light.",
        "aspect_ratio": "1:1",
        "resolution": "1k"
      },
      "docs": [
        "https://docs.ttapi.io/api/en/flux/flux-3-image",
        "https://docs.ttapi.io/api/en/flux/fetch",
        "https://docs.ttapi.io/openapi/en/flux.json"
      ],
      "poll": {
        "method": "GET",
        "path": "/flux/fetch",
        "idParam": "jobId",
        "location": "body",
        "bodyType": "multipart"
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
    "flux-3-image-klein": {
      "family": "FLUX Image",
      "description": "Generate or edit using FLUX 3 Image Klein with optional exact dimensions and seed.",
      "method": "POST",
      "path": "/bfl/v1/flux-3-image-klein",
      "schema": {
        "type": "object",
        "properties": {
          "prompt": {
            "type": "string",
            "description": "Free-form prompt describing the image. Without `images`, it generates a new image from the prompt. With reference images, state what to change and refer to them in order as image 1 and image 2. Bounding boxes can be appended to the prompt, using a 0 to 1000 grid as `[top, left, bottom, right]`.",
            "minLength": 1
          },
          "images": {
            "oneOf": [
              {
                "type": "string",
                "minLength": 1
              },
              {
                "type": "array",
                "items": {
                  "type": "string",
                  "minLength": 1
                },
                "minItems": 1,
                "maxItems": 10
              }
            ],
            "description": "Optional reference images. Omit them for text-to-image. When present, the prompt edits, restyles, or combines them. Each item is an http(s) URL or base64, 1 to 10 total. The first image is the picture being edited and sets the default output size."
          },
          "aspect_ratio": {
            "type": "string",
            "description": "Output aspect ratio. With `auto`, a reference image uses the first image's exact ratio; without references, a ratio is chosen from the prompt, otherwise `16:9`. Ignored when `width` and `height` are both set.",
            "default": "auto",
            "enum": [
              "auto",
              "21:9",
              "2:1",
              "16:9",
              "3:2",
              "7:5",
              "4:3",
              "5:4",
              "1:1",
              "4:5",
              "3:4",
              "5:7",
              "2:3",
              "9:16",
              "1:2",
              "9:21"
            ],
            "minLength": 1
          },
          "resolution": {
            "type": "string",
            "description": "Resolution tier: `768sq`, `1k`, `1.5k`, `2k`, or `4k`. Omitted text-to-image requests use `1k`. With a reference image and this field omitted, the first image's own size is used, or the nearest tier when `aspect_ratio` is also set. Ignored when `width` and `height` are both set.",
            "enum": [
              "768sq",
              "1k",
              "1.5k",
              "2k",
              "4k"
            ],
            "minLength": 1
          },
          "width": {
            "type": "integer",
            "description": "Output width in pixels, from 64 to 6256. Must be sent together with `height`, and overrides `aspect_ratio` and `resolution`. Width times height must not exceed 16822272 pixels.",
            "minimum": 64,
            "maximum": 6256
          },
          "height": {
            "type": "integer",
            "description": "Output height in pixels, from 64 to 6256. Must be sent together with `width`. Width times height must not exceed 16822272 pixels.",
            "minimum": 64,
            "maximum": 6256
          },
          "seed": {
            "type": "integer",
            "description": "Seed used to reproduce a result. Random when omitted. Range: 0 to 4294967295.",
            "minimum": 0,
            "maximum": 4294967295
          },
          "safety_tolerance": {
            "type": "integer",
            "description": "Harm moderation tolerance from 0 to 7, with 0 the strictest. Default is 2. The route and organization determine the approved maximum and the ceiling for each category.",
            "minimum": 0,
            "maximum": 7,
            "default": 2
          },
          "output_format": {
            "type": "string",
            "description": "Output image format.",
            "default": "jpeg",
            "enum": [
              "jpeg",
              "png"
            ],
            "minLength": 1
          },
          "steps": {
            "type": "integer",
            "description": "Denoising steps. Default is 16. Range: 1 to 16.",
            "minimum": 1,
            "maximum": 16,
            "default": 16
          },
          "webhook_url": {
            "type": "string",
            "description": "Async callback URL. The initial response returns `jobId`. Use this callback or the [Flux fetch API](/api/en/flux/fetch) to get the final image.",
            "minLength": 1
          }
        },
        "required": [
          "prompt"
        ],
        "additionalProperties": false
      },
      "bodyType": "json",
      "example": {
        "prompt": "A quiet mountain lake at sunrise, detailed illustration, soft natural light.",
        "aspect_ratio": "1:1",
        "resolution": "1k",
        "output_format": "png"
      },
      "docs": [
        "https://docs.ttapi.io/api/en/flux/flux-3-image-klein",
        "https://docs.ttapi.io/api/en/flux/fetch",
        "https://docs.ttapi.io/openapi/en/flux.json"
      ],
      "poll": {
        "method": "GET",
        "path": "/flux/fetch",
        "idParam": "jobId",
        "location": "body",
        "bodyType": "multipart"
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

for (const [id, operation] of Object.entries(catalog.operations)) {
  operation.validate = input => {
    const errors = [];
    if (id === 'flux-3-image-klein') {
      if ((input.width === undefined) !== (input.height === undefined)) errors.push('FLUX 3 Klein width and height must be provided together.');
      if (input.width !== undefined && input.height !== undefined && input.width * input.height > 16822272) errors.push('FLUX 3 Klein dimensions exceed 16822272 pixels.');
    } else if (!id.startsWith('flux-3')) {
      for (const name of ['width','height']) if (input[name] !== undefined && (!/^\d+$/.test(input[name]) || Number(input[name]) < 256 || Number(input[name]) > 1440 || Number(input[name]) % 32 !== 0)) errors.push(name + ' must be a numeric string from 256 to 1440 and a multiple of 32.');
    }
    return errors;
  };
}
