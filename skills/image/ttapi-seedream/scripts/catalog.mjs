// TTAPI public API contract snapshot verified 2026-10-26. No API calls at import.
export const catalog = {
  "skill": "ttapi-seedream",
  "title": "TTAPI Seedream",
  "operations": {
    "seedream-text-to-image": {
      "family": "Seedream 5",
      "description": "Generate a new image from a text description.",
      "method": "POST",
      "path": "/sd/api/v3/images/generations/tasks",
      "schema": {
        "type": "object",
        "description": "Text-to-Image request parameters",
        "properties": {
          "model": {
            "type": "string",
            "description": "Model name.\n- `doubao-seedream-5-0-pro-260628`: Pro version\n- `doubao-seedream-5-0-flash-260915`: Flash version",
            "enum": [
              "doubao-seedream-5-0-pro-260628",
              "doubao-seedream-5-0-flash-260915"
            ],
            "minLength": 1
          },
          "prompt": {
            "type": "string",
            "description": "Text prompt describing the content to generate.",
            "minLength": 1
          },
          "size": {
            "type": "string",
            "description": "Image size. 5.0 pro/flash options: 1K, 1.5K, 2K (default 2K), or pixel values like `2048x1024`.",
            "default": "2K",
            "enum": [
              "1K",
              "1.5K",
              "2K"
            ],
            "minLength": 1
          },
          "output_format": {
            "type": "string",
            "description": "Output image format.",
            "default": "jpeg",
            "enum": [
              "png",
              "jpeg"
            ],
            "minLength": 1
          },
          "response_format": {
            "type": "string",
            "description": "This client exposes the documented URL response; base64 result shape is not specified in the published response schema.",
            "default": "url",
            "enum": [
              "url"
            ],
            "minLength": 1
          },
          "watermark": {
            "type": "boolean",
            "description": "Whether to add watermark. true=Display \"AI Generated\" in bottom-right, false=Do not add.",
            "default": true,
            "enum": [
              true,
              false
            ]
          },
          "optimize_prompt_options": {
            "type": "object",
            "description": "Prompt optimization config",
            "properties": {
              "mode": {
                "type": "string",
                "enum": [
                  "standard",
                  "fast"
                ],
                "default": "standard",
                "description": "Optimization mode. standard=standard mode (higher quality, longer time), fast=fast mode (shorter time, slightly lower quality, 5.0 flash not supported)",
                "minLength": 1
              }
            },
            "additionalProperties": false
          },
          "execution_expires_after": {
            "type": "integer",
            "default": 172800,
            "description": "Task timeout threshold (seconds). Range [3600, 259200] (1-72 hours), default 172800 (48 hours)",
            "minimum": 3600,
            "maximum": 259200
          },
          "priority": {
            "type": "integer",
            "default": 0,
            "description": "Execution priority. Range [0, 9], higher value = higher priority, default 0 (FIFO)",
            "minimum": 0,
            "maximum": 9
          },
          "safety_identifier": {
            "type": "string",
            "description": "End user unique identifier, max 64 characters. Recommend passing a hashed string",
            "minLength": 1,
            "maxLength": 64
          }
        },
        "required": [
          "model",
          "prompt"
        ],
        "additionalProperties": false,
        "allOf": [
          {
            "if": {
              "required": [
                "model"
              ],
              "properties": {
                "model": {
                  "const": "doubao-seedream-5-0-flash-260915"
                }
              }
            },
            "then": {
              "properties": {
                "optimize_prompt_options": {
                  "properties": {
                    "mode": {
                      "const": "standard"
                    }
                  }
                }
              }
            }
          }
        ]
      },
      "bodyType": "json",
      "example": {
        "model": "doubao-seedream-5-0-pro-260628",
        "prompt": "Vibrant close-up editorial portrait, model with sharp gaze, sculptural hat, rich color palette",
        "size": "2K",
        "output_format": "png",
        "watermark": false,
        "response_format": "url"
      },
      "docs": [
        "https://docs.ttapi.io/api/en/seedream/text-to-image",
        "https://docs.ttapi.io/openapi/en/seedream-text-to-image.json",
        "https://docs.ttapi.io/api/en/seedream/fetch"
      ],
      "statusPaths": [
        "status"
      ],
      "assetPaths": [
        "data.images"
      ],
      "poll": {
        "method": "GET",
        "path": "/sd/api/v3/images/generations/tasks/{id}",
        "idParam": "id",
        "location": "path"
      },
      "taskIdPaths": [
        "id",
        "data.id"
      ]
    },
    "seedream-image-to-image": {
      "family": "Seedream 5",
      "description": "Transform a supplied reference image, including supported transparency controls.",
      "method": "POST",
      "path": "/sd/api/v3/images/generations/tasks",
      "schema": {
        "type": "object",
        "description": "Image-to-Image request parameters",
        "properties": {
          "model": {
            "type": "string",
            "description": "Model name.",
            "enum": [
              "doubao-seedream-5-0-pro-260628",
              "doubao-seedream-5-0-flash-260915"
            ],
            "minLength": 1
          },
          "prompt": {
            "type": "string",
            "description": "Text prompt describing the editing intent.",
            "minLength": 1
          },
          "image": {
            "type": "string",
            "description": "Reference image URL. Supports jpeg/png/webp/bmp/tiff/gif/heic/heif formats, aspect ratio [1/16, 16], max size 30MB.",
            "minLength": 1,
            "pattern": "^https?://"
          },
          "size": {
            "type": "string",
            "description": "Image size. 5.0 pro/flash options: 1K, 1.5K, 2K (default 2K), or pixel values like `2048x1024`.",
            "default": "2K",
            "enum": [
              "1K",
              "1.5K",
              "2K"
            ],
            "minLength": 1
          },
          "output_format": {
            "type": "string",
            "description": "Output image format.",
            "default": "jpeg",
            "enum": [
              "png",
              "jpeg"
            ],
            "minLength": 1
          },
          "response_format": {
            "type": "string",
            "description": "This client exposes the documented URL response; base64 result shape is not specified in the published response schema.",
            "default": "url",
            "enum": [
              "url"
            ],
            "minLength": 1
          },
          "background": {
            "type": "string",
            "description": "Image alpha channel setting. `transparent` generates transparent background, `opaque` generates opaque background.",
            "default": "opaque",
            "enum": [
              "transparent",
              "opaque"
            ],
            "minLength": 1
          },
          "watermark": {
            "type": "boolean",
            "description": "Whether to add watermark. true=Display \"AI Generated\" in bottom-right, false=Do not add.",
            "default": true,
            "enum": [
              true,
              false
            ]
          },
          "optimize_prompt_options": {
            "type": "object",
            "description": "Prompt optimization config",
            "properties": {
              "mode": {
                "type": "string",
                "enum": [
                  "standard",
                  "fast"
                ],
                "default": "standard",
                "description": "Optimization mode. standard=standard mode (higher quality, longer time), fast=fast mode (shorter time, slightly lower quality, 5.0 flash not supported)",
                "minLength": 1
              }
            },
            "additionalProperties": false
          },
          "execution_expires_after": {
            "type": "integer",
            "default": 172800,
            "description": "Task timeout threshold (seconds). Range [3600, 259200] (1-72 hours), default 172800 (48 hours)",
            "minimum": 3600,
            "maximum": 259200
          },
          "priority": {
            "type": "integer",
            "default": 0,
            "description": "Execution priority. Range [0, 9], higher value = higher priority, default 0 (FIFO)",
            "minimum": 0,
            "maximum": 9
          },
          "safety_identifier": {
            "type": "string",
            "description": "End user unique identifier, max 64 characters. Recommend passing a hashed string",
            "minLength": 1,
            "maxLength": 64
          }
        },
        "required": [
          "model",
          "prompt",
          "image"
        ],
        "additionalProperties": false,
        "allOf": [
          {
            "if": {
              "required": [
                "model"
              ],
              "properties": {
                "model": {
                  "const": "doubao-seedream-5-0-flash-260915"
                }
              }
            },
            "then": {
              "properties": {
                "optimize_prompt_options": {
                  "properties": {
                    "mode": {
                      "const": "standard"
                    }
                  }
                }
              }
            }
          },
          {
            "if": {
              "required": [
                "background"
              ],
              "properties": {
                "background": {
                  "const": "transparent"
                }
              }
            },
            "then": {
              "properties": {
                "output_format": {
                  "const": "png"
                }
              }
            }
          }
        ]
      },
      "bodyType": "json",
      "example": {
        "model": "doubao-seedream-5-0-pro-260628",
        "prompt": "Convert image to watercolor style",
        "image": "https://example.com/reference.jpg",
        "size": "2K",
        "output_format": "png",
        "watermark": false,
        "response_format": "url"
      },
      "docs": [
        "https://docs.ttapi.io/api/en/seedream/image-to-image",
        "https://docs.ttapi.io/openapi/en/seedream-image-to-image.json",
        "https://docs.ttapi.io/api/en/seedream/fetch"
      ],
      "statusPaths": [
        "status"
      ],
      "assetPaths": [
        "data.images"
      ],
      "poll": {
        "method": "GET",
        "path": "/sd/api/v3/images/generations/tasks/{id}",
        "idParam": "id",
        "location": "path"
      },
      "taskIdPaths": [
        "id",
        "data.id"
      ]
    },
    "seedream-multi-image": {
      "family": "Seedream 5",
      "description": "Fuse two to ten supplied reference images.",
      "method": "POST",
      "path": "/sd/api/v3/images/generations/tasks",
      "schema": {
        "type": "object",
        "description": "Multi-Image Fusion request parameters",
        "properties": {
          "model": {
            "type": "string",
            "description": "Model name.",
            "enum": [
              "doubao-seedream-5-0-pro-260628",
              "doubao-seedream-5-0-flash-260915"
            ],
            "minLength": 1
          },
          "prompt": {
            "type": "string",
            "description": "Text prompt describing the fusion intent.",
            "minLength": 1
          },
          "image": {
            "type": "array",
            "description": "Array of reference image URLs, supports 2-10 images.",
            "items": {
              "type": "string",
              "minLength": 1,
              "pattern": "^https?://"
            },
            "minItems": 2,
            "maxItems": 10
          },
          "size": {
            "type": "string",
            "description": "Image size. 5.0 pro/flash options: 1K, 1.5K, 2K (default 2K), or specify pixel values.",
            "default": "2K",
            "enum": [
              "1K",
              "1.5K",
              "2K"
            ],
            "minLength": 1
          },
          "output_format": {
            "type": "string",
            "description": "Output image format.",
            "default": "jpeg",
            "enum": [
              "png",
              "jpeg"
            ],
            "minLength": 1
          },
          "response_format": {
            "type": "string",
            "description": "This client exposes the documented URL response; base64 result shape is not specified in the published response schema.",
            "default": "url",
            "enum": [
              "url"
            ],
            "minLength": 1
          },
          "watermark": {
            "type": "boolean",
            "description": "Whether to add watermark. true=Display \"AI Generated\" in bottom-right, false=Do not add.",
            "default": true,
            "enum": [
              true,
              false
            ]
          },
          "optimize_prompt_options": {
            "type": "object",
            "description": "Prompt optimization config",
            "properties": {
              "mode": {
                "type": "string",
                "enum": [
                  "standard",
                  "fast"
                ],
                "default": "standard",
                "description": "Optimization mode. standard=standard mode (higher quality, longer time), fast=fast mode (shorter time, slightly lower quality, 5.0 flash not supported)",
                "minLength": 1
              }
            },
            "additionalProperties": false
          },
          "execution_expires_after": {
            "type": "integer",
            "default": 172800,
            "description": "Task timeout threshold (seconds). Range [3600, 259200] (1-72 hours), default 172800 (48 hours)",
            "minimum": 3600,
            "maximum": 259200
          },
          "priority": {
            "type": "integer",
            "default": 0,
            "description": "Execution priority. Range [0, 9], higher value = higher priority, default 0 (FIFO)",
            "minimum": 0,
            "maximum": 9
          },
          "safety_identifier": {
            "type": "string",
            "description": "End user unique identifier, max 64 characters. Recommend passing a hashed string",
            "minLength": 1,
            "maxLength": 64
          }
        },
        "required": [
          "model",
          "prompt",
          "image"
        ],
        "additionalProperties": false,
        "allOf": [
          {
            "if": {
              "required": [
                "model"
              ],
              "properties": {
                "model": {
                  "const": "doubao-seedream-5-0-flash-260915"
                }
              }
            },
            "then": {
              "properties": {
                "optimize_prompt_options": {
                  "properties": {
                    "mode": {
                      "const": "standard"
                    }
                  }
                }
              }
            }
          }
        ]
      },
      "bodyType": "json",
      "example": {
        "model": "doubao-seedream-5-0-pro-260628",
        "prompt": "Fuse characters from two images into the same scene",
        "image": [
          "https://example.com/ref1.jpg",
          "https://example.com/ref2.jpg"
        ],
        "size": "2K",
        "watermark": false,
        "response_format": "url"
      },
      "docs": [
        "https://docs.ttapi.io/api/en/seedream/multi-image",
        "https://docs.ttapi.io/openapi/en/seedream-multi-image.json",
        "https://docs.ttapi.io/api/en/seedream/fetch"
      ],
      "statusPaths": [
        "status"
      ],
      "assetPaths": [
        "data.images"
      ],
      "poll": {
        "method": "GET",
        "path": "/sd/api/v3/images/generations/tasks/{id}",
        "idParam": "id",
        "location": "path"
      },
      "taskIdPaths": [
        "id",
        "data.id"
      ]
    },
    "seedream-layers": {
      "family": "Seedream 5",
      "description": "Decompose a source into a base image and image layers.",
      "method": "POST",
      "path": "/sd/api/v3/images/generations/tasks",
      "schema": {
        "type": "object",
        "description": "Layer Decomposition request parameters",
        "properties": {
          "model": {
            "type": "string",
            "description": "Model name.",
            "enum": [
              "doubao-seedream-5-0-pro-260628",
              "doubao-seedream-5-0-flash-260915"
            ],
            "minLength": 1
          },
          "prompt": {
            "type": "string",
            "description": "Text prompt, use <bbox> coordinates to mark areas to decompose.",
            "minLength": 1
          },
          "image": {
            "type": "string",
            "description": "Image URL to decompose.",
            "minLength": 1,
            "pattern": "^https?://"
          },
          "layer_decomposition": {
            "type": "boolean",
            "description": "Enable layer decomposition mode. true=layer decomposition, decompose input image into base image and multiple layers (max 16); false=image generation mode. Only Seedream 5.0 pro/flash supports.",
            "default": true,
            "enum": [
              true,
              false
            ],
            "const": true
          },
          "size": {
            "type": "string",
            "description": "Image size. Layer decomposition options: 1K, 1.5K, 2K, auto (default auto, keeps same as input). Pixel values not supported.",
            "default": "auto",
            "enum": [
              "1K",
              "1.5K",
              "2K",
              "auto"
            ],
            "minLength": 1
          },
          "output_format": {
            "type": "string",
            "description": "Output image format. In layer decomposition scene, only controls base image format; layers always output as png.",
            "default": "jpeg",
            "enum": [
              "png",
              "jpeg"
            ],
            "minLength": 1
          },
          "response_format": {
            "type": "string",
            "description": "This client exposes the documented URL response; base64 result shape is not specified in the published response schema.",
            "default": "url",
            "enum": [
              "url"
            ],
            "minLength": 1
          },
          "watermark": {
            "type": "boolean",
            "description": "Whether to add watermark. true=Display \"AI Generated\" in bottom-right, false=Do not add.",
            "default": true,
            "enum": [
              true,
              false
            ]
          },
          "optimize_prompt_options": {
            "type": "object",
            "description": "Prompt optimization config",
            "properties": {
              "mode": {
                "type": "string",
                "enum": [
                  "standard",
                  "fast"
                ],
                "default": "standard",
                "description": "Optimization mode. standard=standard mode (higher quality, longer time), fast=fast mode (shorter time, slightly lower quality, 5.0 flash not supported)",
                "minLength": 1
              }
            },
            "additionalProperties": false
          },
          "execution_expires_after": {
            "type": "integer",
            "default": 172800,
            "description": "Task timeout threshold (seconds). Range [3600, 259200] (1-72 hours), default 172800 (48 hours)",
            "minimum": 3600,
            "maximum": 259200
          },
          "priority": {
            "type": "integer",
            "default": 0,
            "description": "Execution priority. Range [0, 9], higher value = higher priority, default 0 (FIFO)",
            "minimum": 0,
            "maximum": 9
          },
          "safety_identifier": {
            "type": "string",
            "description": "End user unique identifier, max 64 characters. Recommend passing a hashed string",
            "minLength": 1,
            "maxLength": 64
          }
        },
        "required": [
          "model",
          "prompt",
          "image",
          "layer_decomposition"
        ],
        "additionalProperties": false,
        "allOf": [
          {
            "if": {
              "required": [
                "model"
              ],
              "properties": {
                "model": {
                  "const": "doubao-seedream-5-0-flash-260915"
                }
              }
            },
            "then": {
              "properties": {
                "optimize_prompt_options": {
                  "properties": {
                    "mode": {
                      "const": "standard"
                    }
                  }
                }
              }
            }
          }
        ]
      },
      "bodyType": "json",
      "example": {
        "model": "doubao-seedream-5-0-pro-260628",
        "prompt": "Separate the person from the background <bbox>(0.1, 0.2, 0.8, 0.9)",
        "image": "https://example.com/photo.jpg",
        "layer_decomposition": true,
        "watermark": false,
        "response_format": "url"
      },
      "docs": [
        "https://docs.ttapi.io/api/en/seedream/layer-decomposition",
        "https://docs.ttapi.io/openapi/en/seedream-layer-decomposition.json",
        "https://docs.ttapi.io/api/en/seedream/fetch"
      ],
      "statusPaths": [
        "status"
      ],
      "assetPaths": [
        "data.images"
      ],
      "poll": {
        "method": "GET",
        "path": "/sd/api/v3/images/generations/tasks/{id}",
        "idParam": "id",
        "location": "path"
      },
      "taskIdPaths": [
        "id",
        "data.id"
      ]
    },
    "seedream-edit": {
      "family": "Seedream 5",
      "description": "Edit a source image using an instruction and optional prompt bounding boxes.",
      "method": "POST",
      "path": "/sd/api/v3/images/generations/tasks",
      "schema": {
        "type": "object",
        "description": "Interactive Edit request parameters",
        "properties": {
          "model": {
            "type": "string",
            "description": "Model name.",
            "enum": [
              "doubao-seedream-5-0-pro-260628",
              "doubao-seedream-5-0-flash-260915"
            ],
            "minLength": 1
          },
          "prompt": {
            "type": "string",
            "description": "Text prompt, describe editing intent, use coordinates, bounding boxes, etc. to specify edit areas.",
            "minLength": 1
          },
          "image": {
            "type": "string",
            "description": "Image URL to edit.",
            "minLength": 1,
            "pattern": "^https?://"
          },
          "size": {
            "type": "string",
            "description": "Image size. 5.0 pro/flash options: 1K, 1.5K, 2K (default 2K), or specify pixel values.",
            "default": "2K",
            "enum": [
              "1K",
              "1.5K",
              "2K"
            ],
            "minLength": 1
          },
          "output_format": {
            "type": "string",
            "description": "Output image format.",
            "default": "jpeg",
            "enum": [
              "png",
              "jpeg"
            ],
            "minLength": 1
          },
          "response_format": {
            "type": "string",
            "description": "This client exposes the documented URL response; base64 result shape is not specified in the published response schema.",
            "default": "url",
            "enum": [
              "url"
            ],
            "minLength": 1
          },
          "watermark": {
            "type": "boolean",
            "description": "Whether to add watermark. true=Display \"AI Generated\" in bottom-right, false=Do not add.",
            "default": true,
            "enum": [
              true,
              false
            ]
          },
          "optimize_prompt_options": {
            "type": "object",
            "description": "Prompt optimization config",
            "properties": {
              "mode": {
                "type": "string",
                "enum": [
                  "standard",
                  "fast"
                ],
                "default": "standard",
                "description": "Optimization mode. standard=standard mode (higher quality, longer time), fast=fast mode (shorter time, slightly lower quality, 5.0 flash not supported)",
                "minLength": 1
              }
            },
            "additionalProperties": false
          },
          "execution_expires_after": {
            "type": "integer",
            "default": 172800,
            "description": "Task timeout threshold (seconds). Range [3600, 259200] (1-72 hours), default 172800 (48 hours)",
            "minimum": 3600,
            "maximum": 259200
          },
          "priority": {
            "type": "integer",
            "default": 0,
            "description": "Execution priority. Range [0, 9], higher value = higher priority, default 0 (FIFO)",
            "minimum": 0,
            "maximum": 9
          },
          "safety_identifier": {
            "type": "string",
            "description": "End user unique identifier, max 64 characters. Recommend passing a hashed string",
            "minLength": 1,
            "maxLength": 64
          }
        },
        "required": [
          "model",
          "prompt",
          "image"
        ],
        "additionalProperties": false,
        "allOf": [
          {
            "if": {
              "required": [
                "model"
              ],
              "properties": {
                "model": {
                  "const": "doubao-seedream-5-0-flash-260915"
                }
              }
            },
            "then": {
              "properties": {
                "optimize_prompt_options": {
                  "properties": {
                    "mode": {
                      "const": "standard"
                    }
                  }
                }
              }
            }
          }
        ]
      },
      "bodyType": "json",
      "example": {
        "model": "doubao-seedream-5-0-pro-260628",
        "prompt": "Change the person's hat to red <bbox>(0.3, 0.1, 0.7, 0.3)",
        "image": "https://example.com/photo.jpg",
        "watermark": false,
        "response_format": "url"
      },
      "docs": [
        "https://docs.ttapi.io/api/en/seedream/interactive-edit",
        "https://docs.ttapi.io/openapi/en/seedream-interactive-edit.json",
        "https://docs.ttapi.io/api/en/seedream/fetch"
      ],
      "statusPaths": [
        "status"
      ],
      "assetPaths": [
        "data.images"
      ],
      "poll": {
        "method": "GET",
        "path": "/sd/api/v3/images/generations/tasks/{id}",
        "idParam": "id",
        "location": "path"
      },
      "taskIdPaths": [
        "id",
        "data.id"
      ]
    },
    "seedream-text-to-image-sync": {
      "family": "Seedream 5",
      "description": "Generate an image synchronously without a task-query step.",
      "method": "POST",
      "path": "/sd/api/v3/images/generations",
      "schema": {
        "type": "object",
        "properties": {
          "model": {
            "type": "string",
            "enum": [
              "doubao-seedream-5-0-pro-260628",
              "doubao-seedream-5-0-flash-260915"
            ],
            "description": "Model name.",
            "minLength": 1
          },
          "prompt": {
            "type": "string",
            "description": "Text prompt.",
            "minLength": 1
          },
          "size": {
            "type": "string",
            "description": "Image size. 5.0 pro/flash options: 1K, 1.5K, 2K (default 2K), or specify pixel values.",
            "default": "2K",
            "enum": [
              "1K",
              "1.5K",
              "2K"
            ],
            "minLength": 1
          },
          "output_format": {
            "type": "string",
            "description": "Output image format.",
            "default": "jpeg",
            "enum": [
              "png",
              "jpeg"
            ],
            "minLength": 1
          },
          "response_format": {
            "type": "string",
            "description": "This client exposes the documented URL response; base64 result shape is not specified in the published response schema.",
            "default": "url",
            "enum": [
              "url"
            ],
            "minLength": 1
          },
          "background": {
            "type": "string",
            "description": "Image alpha channel setting. `transparent`=transparent background (image-to-image only), `opaque`=opaque background. Only 5.0 pro/flash supports.",
            "default": "opaque",
            "enum": [
              "opaque"
            ],
            "minLength": 1
          },
          "watermark": {
            "type": "boolean",
            "description": "Whether to add watermark. true=Display \"AI Generated\" in bottom-right, false=Do not add.",
            "default": true,
            "enum": [
              true,
              false
            ]
          },
          "optimize_prompt_options": {
            "type": "object",
            "description": "Prompt optimization config",
            "properties": {
              "mode": {
                "type": "string",
                "enum": [
                  "standard",
                  "fast"
                ],
                "default": "standard",
                "description": "Optimization mode. standard=standard mode (higher quality), fast=fast mode (shorter time, 5.0 flash not supported)",
                "minLength": 1
              }
            },
            "additionalProperties": false
          }
        },
        "required": [
          "model",
          "prompt"
        ],
        "additionalProperties": false,
        "allOf": [
          {
            "if": {
              "required": [
                "model"
              ],
              "properties": {
                "model": {
                  "const": "doubao-seedream-5-0-flash-260915"
                }
              }
            },
            "then": {
              "properties": {
                "optimize_prompt_options": {
                  "properties": {
                    "mode": {
                      "const": "standard"
                    }
                  }
                }
              }
            }
          }
        ]
      },
      "bodyType": "json",
      "example": {
        "model": "doubao-seedream-5-0-pro-260628",
        "prompt": "Vibrant close-up portrait, rich colors",
        "size": "2K",
        "watermark": false,
        "response_format": "url"
      },
      "docs": [
        "https://docs.ttapi.io/api/en/seedream/text-to-image-sync",
        "https://docs.ttapi.io/openapi/en/seedream-text-to-image-sync.json",
        "https://docs.ttapi.io/api/en/seedream/fetch"
      ],
      "statusPaths": [
        "status"
      ],
      "assetPaths": [
        "data.*.url"
      ]
    }
  }
};
