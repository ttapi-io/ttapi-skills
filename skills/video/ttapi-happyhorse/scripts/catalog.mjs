// Official TTAPI schemas, checked 2026-10-26. No credentials or network calls.
export const catalog = {
  "skill": "ttapi-happyhorse",
  "title": "TTAPI HappyHorse video",
  "operations": {
    "happyhorse-text-to-video": {
      "family": "happyhorse",
      "description": "Text-to-video using HappyHorse 1.0 or 1.1.",
      "method": "POST",
      "path": "/happyhorse/api/v1/services/aigc/video-generation/video-synthesis",
      "bodyType": "json",
      "schema": {
        "type": "object",
        "properties": {
          "model": {
            "type": "string",
            "description": "Model name. Supports happyhorse-1.0-t2v and happyhorse-1.1-t2v.",
            "default": "happyhorse-1.0-t2v",
            "example": "happyhorse-1.0-t2v",
            "enum": [
              "happyhorse-1.0-t2v",
              "happyhorse-1.1-t2v"
            ]
          },
          "input": {
            "type": "object",
            "description": "Model input information",
            "properties": {
              "prompt": {
                "type": "string",
                "description": "Text prompt, used to describe the expected video content to generate. Supports any language input, with a maximum length of 5000 non-Chinese characters or 2500 Chinese characters. Exceeding content will be automatically truncated.",
                "minLength": 1,
                "maxLength": 5000
              }
            },
            "required": [
              "prompt"
            ],
            "additionalProperties": false
          },
          "parameters": {
            "type": "object",
            "description": "Video processing parameters, such as setting video resolution, duration, etc.",
            "properties": {
              "resolution": {
                "type": "string",
                "description": "Specify the resolution level for generated video.",
                "default": "1080P",
                "enum": [
                  "720P",
                  "1080P"
                ],
                "example": "720P"
              },
              "ratio": {
                "type": "string",
                "description": "Specify the aspect ratio of generated video.",
                "default": "16:9",
                "enum": [
                  "16:9",
                  "9:16",
                  "1:1",
                  "4:3",
                  "3:4"
                ],
                "example": "16:9"
              },
              "duration": {
                "type": "integer",
                "description": "Specify the duration of generated video in seconds. Value range: integer between 3 and 15. Default: 5.",
                "default": 5,
                "minimum": 3,
                "maximum": 15,
                "example": 5
              },
              "watermark": {
                "type": "boolean",
                "description": "Whether to add watermark to generated video. Watermark is located at the bottom right corner of video, text is fixed as \"Happy Horse\". true: default, add watermark; false: no watermark.",
                "default": true,
                "example": false
              },
              "seed": {
                "type": "integer",
                "description": "Random seed, value range: [0, 2147483647]. If not specified, system will automatically generate a random seed. To improve reproducibility of generation results, it is recommended to fix the seed value. Note that due to the probabilistic nature of model generation, even with the same seed, cannot guarantee identical results each time.",
                "minimum": 0,
                "maximum": 2147483647,
                "example": 12345
              }
            },
            "additionalProperties": false
          }
        },
        "required": [
          "model",
          "input"
        ],
        "additionalProperties": false
      },
      "example": {
        "model": "happyhorse-1.1-t2v",
        "input": {
          "prompt": "A paper boat floats across a quiet pond at sunrise, slow camera movement."
        },
        "parameters": {
          "resolution": "720P",
          "ratio": "16:9",
          "duration": 5
        }
      },
      "docs": [
        "https://docs.ttapi.io/api/en/happyhorse/generations.md",
        "https://docs.ttapi.io/openapi/en/happyhorse.json",
        "https://docs.ttapi.io/api/en/happyhorse/fetch.md"
      ],
      "poll": {
        "method": "GET",
        "path": "/happyhorse/api/v1/tasks/{task_id}",
        "idParam": "task_id",
        "location": "path"
      },
      "assetPaths": [
        "output.video_url"
      ]
    },
    "happyhorse-image-to-video": {
      "family": "happyhorse",
      "description": "Animate exactly one first-frame image with HappyHorse.",
      "method": "POST",
      "path": "/happyhorse/api/v1/services/aigc/video-generation/video-synthesis",
      "bodyType": "json",
      "schema": {
        "type": "object",
        "properties": {
          "model": {
            "type": "string",
            "description": "Model name. Supports happyhorse-1.0-i2v and happyhorse-1.1-i2v.",
            "default": "happyhorse-1.0-i2v",
            "example": "happyhorse-1.0-i2v",
            "enum": [
              "happyhorse-1.0-i2v",
              "happyhorse-1.1-i2v"
            ]
          },
          "input": {
            "type": "object",
            "description": "Basic input information, such as prompt, etc.",
            "properties": {
              "prompt": {
                "type": "string",
                "description": "Text prompt, used to describe the expected video content to generate. Supports any language input, with a maximum length of 5000 non-Chinese characters or 2500 Chinese characters. Exceeding content will be automatically truncated.",
                "minLength": 1,
                "maxLength": 5000
              },
              "media": {
                "type": "array",
                "description": "Input media list. Used to specify the image for video generation. Must have exactly 1 first-frame image.",
                "items": {
                  "type": "object",
                  "properties": {
                    "type": {
                      "type": "string",
                      "description": "Media type. Fixed value: first_frame.",
                      "enum": [
                        "first_frame"
                      ],
                      "example": "first_frame"
                    },
                    "url": {
                      "type": "string",
                      "description": "Media URL. First-frame URL. Supports HTTP or HTTPS protocol. Image limits: format: JPEG, JPG, PNG, WEBP; resolution: both width and height not less than 300 pixels; aspect ratio: 1:2.5 to 2.5:1; file size: not exceeding 10MB.",
                      "minLength": 1,
                      "pattern": "^https?://"
                    }
                  },
                  "required": [
                    "type",
                    "url"
                  ],
                  "additionalProperties": false
                },
                "minItems": 1,
                "maxItems": 1
              }
            },
            "required": [
              "media"
            ],
            "additionalProperties": false
          },
          "parameters": {
            "type": "object",
            "description": "Video processing parameters, such as setting video resolution, duration, etc.",
            "properties": {
              "resolution": {
                "type": "string",
                "description": "Specify the resolution level for generated video, used to control video clarity (total pixels). The model automatically scales to a similar total pixel based on the selected resolution level. The output video aspect ratio is approximately consistent with the input first-frame.",
                "default": "1080P",
                "enum": [
                  "720P",
                  "1080P"
                ],
                "example": "720P"
              },
              "duration": {
                "type": "integer",
                "description": "Specify the duration of generated video in seconds. Value range: integer between 3 and 15. Default: 5.",
                "default": 5,
                "minimum": 3,
                "maximum": 15,
                "example": 5
              },
              "watermark": {
                "type": "boolean",
                "description": "Whether to add watermark to generated video. Watermark is located at the bottom right corner of video, text is fixed as \"Happy Horse\". true: default, add watermark; false: no watermark.",
                "default": true,
                "example": false
              },
              "seed": {
                "type": "integer",
                "description": "Random seed, value range: [0, 2147483647]. If not specified, system will automatically generate a random seed. To improve reproducibility of generation results, it is recommended to fix the seed value. Note that due to the probabilistic nature of model generation, even with the same seed, cannot guarantee identical results each time.",
                "minimum": 0,
                "maximum": 2147483647,
                "example": 12345
              }
            },
            "additionalProperties": false
          }
        },
        "required": [
          "model",
          "input"
        ],
        "additionalProperties": false
      },
      "example": {
        "model": "happyhorse-1.1-i2v",
        "input": {
          "prompt": "The camera slowly moves closer as soft morning light crosses the scene.",
          "media": [
            {
              "type": "first_frame",
              "url": "https://cdn.ttapi.io/example/reference-image.png"
            }
          ]
        },
        "parameters": {
          "resolution": "720P",
          "duration": 5
        }
      },
      "docs": [
        "https://docs.ttapi.io/api/en/happyhorse/image-to-video.md",
        "https://docs.ttapi.io/openapi/en/happyhorse-image-to-video.json",
        "https://docs.ttapi.io/api/en/happyhorse/fetch.md"
      ],
      "poll": {
        "method": "GET",
        "path": "/happyhorse/api/v1/tasks/{task_id}",
        "idParam": "task_id",
        "location": "path"
      },
      "assetPaths": [
        "output.video_url"
      ]
    },
    "happyhorse-reference-to-video": {
      "family": "happyhorse",
      "description": "Generate video from one to nine reference images.",
      "method": "POST",
      "path": "/happyhorse/api/v1/services/aigc/video-generation/video-synthesis",
      "bodyType": "json",
      "schema": {
        "type": "object",
        "properties": {
          "model": {
            "type": "string",
            "description": "Model name. Supports happyhorse-1.0-r2v and happyhorse-1.1-r2v.",
            "default": "happyhorse-1.0-r2v",
            "example": "happyhorse-1.0-r2v",
            "enum": [
              "happyhorse-1.0-r2v",
              "happyhorse-1.1-r2v"
            ]
          },
          "input": {
            "type": "object",
            "description": "Basic input information, including reference images and prompt.",
            "properties": {
              "prompt": {
                "type": "string",
                "description": "Text prompt, used to describe the expected elements and visual characteristics in the generated video. Supports any language input, with a maximum length of 5000 non-Chinese characters or 2500 Chinese characters. Exceeding content will be automatically truncated. Reference notation: Use character1, character2 identifiers in prompt to refer to reference images at corresponding positions in the media array, in the same order as the media array.",
                "minLength": 1,
                "maxLength": 5000
              },
              "media": {
                "type": "array",
                "description": "Media list, used to specify reference images. Each element in the array is a media object containing type and url fields. Defines the order of character references in prompt according to array order. The 1st reference_image corresponds to character1, the 2nd to character2, and so on. Reference image count: 1 to 9 images.",
                "items": {
                  "type": "object",
                  "properties": {
                    "type": {
                      "type": "string",
                      "description": "Media type. Fixed value: reference_image.",
                      "enum": [
                        "reference_image"
                      ],
                      "example": "reference_image"
                    },
                    "url": {
                      "type": "string",
                      "description": "URL address of the image file, must be a publicly accessible URL. Supports HTTP or HTTPS protocol. Image limits: format: JPEG, JPG, PNG, WEBP; resolution: short side not less than 400 pixels, recommend 720P or above clear images, avoid passing images that are too small, blurry, or overly compressed; file size: not exceeding 10MB.",
                      "minLength": 1,
                      "pattern": "^https?://"
                    }
                  },
                  "required": [
                    "type",
                    "url"
                  ],
                  "additionalProperties": false
                },
                "minItems": 1,
                "maxItems": 9
              }
            },
            "required": [
              "prompt",
              "media"
            ],
            "additionalProperties": false
          },
          "parameters": {
            "type": "object",
            "description": "Video generation parameters, such as setting video resolution, aspect ratio, duration, etc.",
            "properties": {
              "resolution": {
                "type": "string",
                "description": "Resolution level of generated video.",
                "default": "1080P",
                "enum": [
                  "720P",
                  "1080P"
                ],
                "example": "720P"
              },
              "ratio": {
                "type": "string",
                "description": "Aspect ratio of generated video.",
                "default": "16:9",
                "enum": [
                  "16:9",
                  "9:16",
                  "3:4",
                  "4:3",
                  "1:1"
                ],
                "example": "16:9"
              },
              "duration": {
                "type": "integer",
                "description": "Duration of generated video in seconds. Value range: integer between 3 and 15. Default: 5.",
                "default": 5,
                "minimum": 3,
                "maximum": 15,
                "example": 5
              },
              "watermark": {
                "type": "boolean",
                "description": "Whether to add watermark to generated video. Watermark is located at the bottom right corner of video, text is fixed as \"Happy Horse\". true: default, add watermark; false: no watermark.",
                "default": true,
                "example": false
              },
              "seed": {
                "type": "integer",
                "description": "Random seed, value range: [0, 2147483647]. If not specified, system will automatically generate a random seed. To improve reproducibility of generation results, it is recommended to fix the seed value. Note that due to the probabilistic nature of model generation, even with the same seed, cannot guarantee identical results each time.",
                "minimum": 0,
                "maximum": 2147483647,
                "example": 12345
              }
            },
            "additionalProperties": false
          }
        },
        "required": [
          "model",
          "input"
        ],
        "additionalProperties": false
      },
      "example": {
        "model": "happyhorse-1.1-r2v",
        "input": {
          "prompt": "Character1 walks through a sunlit garden, slow tracking camera.",
          "media": [
            {
              "type": "reference_image",
              "url": "https://cdn.ttapi.io/example/reference-image.png"
            }
          ]
        },
        "parameters": {
          "resolution": "720P",
          "ratio": "16:9",
          "duration": 5
        }
      },
      "docs": [
        "https://docs.ttapi.io/api/en/happyhorse/reference-to-video.md",
        "https://docs.ttapi.io/openapi/en/happyhorse-reference-to-video.json",
        "https://docs.ttapi.io/api/en/happyhorse/fetch.md"
      ],
      "poll": {
        "method": "GET",
        "path": "/happyhorse/api/v1/tasks/{task_id}",
        "idParam": "task_id",
        "location": "path"
      },
      "assetPaths": [
        "output.video_url"
      ]
    },
    "happyhorse-video-edit": {
      "family": "happyhorse",
      "description": "Edit one source video with optional reference images.",
      "method": "POST",
      "path": "/happyhorse/api/v1/services/aigc/video-generation/video-synthesis",
      "bodyType": "json",
      "schema": {
        "type": "object",
        "properties": {
          "model": {
            "type": "string",
            "description": "Model name. Fixed value: happyhorse-1.0-video-edit.",
            "default": "happyhorse-1.0-video-edit",
            "example": "happyhorse-1.0-video-edit",
            "enum": [
              "happyhorse-1.0-video-edit"
            ]
          },
          "input": {
            "type": "object",
            "description": "Basic input information, including video to edit, reference images and prompt.",
            "properties": {
              "prompt": {
                "type": "string",
                "description": "Text prompt, used to describe the editing intent for the video, such as style transfer, partial replacement, etc. Supports any language input, with a maximum length of 5000 non-Chinese characters or 2500 Chinese characters. Exceeding content will be automatically truncated.",
                "minLength": 1,
                "maxLength": 5000
              },
              "media": {
                "type": "array",
                "description": "Media list, used to specify the video to edit and reference images. Array must contain 1 video type element; optionally contain 0 to 5 reference_image type elements.",
                "items": {
                  "oneOf": [
                    {
                      "type": "object",
                      "description": "Video to edit",
                      "properties": {
                        "type": {
                          "type": "string",
                          "description": "Media type. Fixed value: video (video to edit).",
                          "enum": [
                            "video"
                          ],
                          "example": "video"
                        },
                        "url": {
                          "type": "string",
                          "description": "URL of video to edit, must be a publicly accessible URL. Supports HTTP and HTTPS protocol. Video limits: format: MP4, MOV (H.264 encoding recommended); duration: 3 to 60 seconds; resolution: long side not exceeding 2160 pixels, short side not less than 320 pixels; aspect ratio: 1:2.5 to 2.5:1; file size: not exceeding 100MB; frame rate: greater than 8fps. Output video duration: 3 to 15 seconds (when input video is not more than 15 seconds, output duration is consistent with input; when input video exceeds 15 seconds, system will automatically truncate the first 15 seconds as valid segment, so maximum output is 15 seconds).",
                          "minLength": 1,
                          "pattern": "^https?://"
                        }
                      },
                      "required": [
                        "type",
                        "url"
                      ],
                      "additionalProperties": false
                    },
                    {
                      "type": "object",
                      "description": "Reference image",
                      "properties": {
                        "type": {
                          "type": "string",
                          "description": "Media type. Fixed value: reference_image.",
                          "enum": [
                            "reference_image"
                          ],
                          "example": "reference_image"
                        },
                        "url": {
                          "type": "string",
                          "description": "URL of reference image, must be a publicly accessible URL. Supports HTTP or HTTPS protocol. Image limits: format: JPEG, JPG, PNG, WEBP; resolution: width and height not less than 300 pixels; aspect ratio: 1:2.5 to 2.5:1; file size: not exceeding 10MB.",
                          "minLength": 1,
                          "pattern": "^https?://"
                        }
                      },
                      "required": [
                        "type",
                        "url"
                      ],
                      "additionalProperties": false
                    }
                  ]
                },
                "minItems": 1,
                "maxItems": 6
              }
            },
            "required": [
              "prompt",
              "media"
            ],
            "additionalProperties": false
          },
          "parameters": {
            "type": "object",
            "description": "Video editing parameters, such as setting video resolution, etc.",
            "properties": {
              "resolution": {
                "type": "string",
                "description": "Resolution level of generated video.",
                "default": "1080P",
                "enum": [
                  "720P",
                  "1080P"
                ],
                "example": "720P"
              },
              "watermark": {
                "type": "boolean",
                "description": "Whether to add watermark to generated video. Watermark is located at the bottom right corner of video, text is fixed as \"Happy Horse\". true: default, add watermark; false: no watermark.",
                "default": true,
                "example": false
              },
              "audio_setting": {
                "type": "string",
                "description": "Audio control. auto: default, controlled by model; origin: preserve the original audio of input video.",
                "default": "auto",
                "enum": [
                  "auto",
                  "origin"
                ],
                "example": "auto"
              },
              "seed": {
                "type": "integer",
                "description": "Random seed, value range: [0, 2147483647]. If not specified, system will automatically generate a random seed. To improve reproducibility of generation results, it is recommended to fix the seed value. Note that due to the probabilistic nature of model generation, even with the same seed, cannot guarantee identical results each time.",
                "minimum": 0,
                "maximum": 2147483647,
                "example": 12345
              }
            },
            "additionalProperties": false
          }
        },
        "required": [
          "model",
          "input"
        ],
        "additionalProperties": false
      },
      "example": {
        "model": "happyhorse-1.0-video-edit",
        "input": {
          "prompt": "Change the lighting to warm sunset while retaining the original motion.",
          "media": [
            {
              "type": "video",
              "url": "https://cdn.ttapi.io/example/reference-video.mp4"
            }
          ]
        },
        "parameters": {
          "resolution": "720P",
          "audio_setting": "origin"
        }
      },
      "docs": [
        "https://docs.ttapi.io/api/en/happyhorse/video-edit.md",
        "https://docs.ttapi.io/openapi/en/happyhorse-video-edit.json",
        "https://docs.ttapi.io/api/en/happyhorse/fetch.md"
      ],
      "poll": {
        "method": "GET",
        "path": "/happyhorse/api/v1/tasks/{task_id}",
        "idParam": "task_id",
        "location": "path"
      },
      "assetPaths": [
        "output.video_url"
      ]
    }
  }
};

catalog.operations['happyhorse-video-edit'].validate = input => {
  const media = input.input.media;
  const errors = [];
  if (media.filter(item => item.type === 'video').length !== 1) errors.push('Video edit requires exactly one video input.');
  if (media.filter(item => item.type === 'reference_image').length > 5) errors.push('Video edit accepts at most five reference images.');
  return errors;
};
