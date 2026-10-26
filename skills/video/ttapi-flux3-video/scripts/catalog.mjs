// Official TTAPI schemas, checked 2026-10-26. No credentials or network calls.
export const catalog = {
  "skill": "ttapi-flux3-video",
  "title": "TTAPI FLUX 3 video",
  "operations": {
    "flux3-text-to-video": {
      "family": "flux3-video",
      "description": "Text to Video with FLUX 3 video.",
      "method": "POST",
      "path": "/bfl/v1/flux-3-video",
      "bodyType": "json",
      "schema": {
        "title": "Text to Video",
        "type": "object",
        "properties": {
          "prompt": {
            "type": "string",
            "description": "Free-form prompt describing the video.",
            "minLength": 1
          },
          "mode": {
            "type": "string",
            "description": "Allowed value: \"t2v\"",
            "default": "t2v",
            "const": "t2v"
          },
          "aspect_ratio": {
            "type": "string",
            "description": "Output aspect ratio. auto lets the harness choose from the prompt and any references.",
            "default": "auto",
            "enum": [
              "auto",
              "21:9",
              "2:1",
              "16:9",
              "4:3",
              "1:1",
              "3:4",
              "9:16"
            ]
          },
          "duration": {
            "oneOf": [
              {
                "type": "integer",
                "minimum": 5,
                "maximum": 20
              },
              {
                "type": "string",
                "enum": [
                  "auto"
                ]
              }
            ],
            "description": "Video duration in seconds (any whole second from 5 to 20), or auto to fit the content.",
            "default": "auto"
          },
          "resolution": {
            "type": "string",
            "description": "Video resolution class: hd, or fhd for a higher-resolution result finished by the video upsampler. Exact dimensions vary with the aspect ratio.",
            "default": "hd",
            "enum": [
              "hd",
              "fhd"
            ]
          },
          "version": {
            "type": "string",
            "description": "Endpoint version. `latest` serves the current release.",
            "example": "latest",
            "enum": [
              "latest"
            ]
          },
          "generate_audio": {
            "type": "boolean",
            "description": "Generate synchronized audio alongside the video.",
            "default": true
          },
          "safety_tolerance": {
            "type": "integer",
            "description": "Tolerance level for input and output harm moderation. Between 0 and 4, with 0 the strictest. Sexual content is limited to level 3 and hate content to level 2 regardless of the requested tolerance. Contextual safety signals can tighten the requested level.",
            "minimum": 0,
            "maximum": 4,
            "default": 2
          },
          "draft": {
            "type": "boolean",
            "description": "Draft mode: generate a fast preview and return a draft_cache download URL in the result. Download that bundle and pass it back later to render the full-quality version of the same generation.",
            "default": false
          },
          "webhook_url": {
            "type": "string",
            "description": "TTAPI asynchronous callback URL. The initial response returns `jobId`; use this callback or the Flux fetch endpoint to receive the final video result."
          }
        },
        "required": [
          "mode",
          "prompt"
        ],
        "additionalProperties": false
      },
      "example": {
        "mode": "t2v",
        "prompt": "A paper boat floats across a quiet pond at sunrise, gentle ripples.",
        "aspect_ratio": "16:9",
        "duration": 5,
        "resolution": "hd",
        "generate_audio": true
      },
      "docs": [
        "https://docs.ttapi.io/api/en/flux/flux-3-video.md",
        "https://docs.ttapi.io/api/en/flux/video-result.md",
        "https://docs.ttapi.io/openapi/en/flux.json"
      ],
      "poll": {
        "method": "GET",
        "path": "/bfl/v1/fetch",
        "idParam": "jobId",
        "location": "body",
        "bodyType": "multipart"
      },
      "assetPaths": [
        "data.videoUrl",
        "data.draftCache"
      ]
    },
    "flux3-image-to-video": {
      "family": "flux3-video",
      "description": "Image to Video with FLUX 3 video.",
      "method": "POST",
      "path": "/bfl/v1/flux-3-video",
      "bodyType": "json",
      "schema": {
        "title": "Image to Video",
        "description": "Image continuation: your images become frames of the video. One image\nstarts the video; two start and end it; with more, the first starts it,\nthe last ends it, and the rest fall evenly in between. To control the\ntiming yourself, send [seconds, image] pairs: each image becomes the\nframe at that second.",
        "type": "object",
        "properties": {
          "prompt": {
            "type": "string",
            "description": "Free-form prompt describing the video.",
            "minLength": 1
          },
          "mode": {
            "type": "string",
            "description": "Allowed value: \"i2v\"",
            "default": "i2v",
            "const": "i2v"
          },
          "keyframes": {
            "oneOf": [
              {
                "type": "string",
                "minLength": 1
              },
              {
                "type": "array",
                "minItems": 1,
                "maxItems": 10,
                "items": {
                  "oneOf": [
                    {
                      "type": "string",
                      "minLength": 1
                    },
                    {
                      "type": "array",
                      "minItems": 2,
                      "maxItems": 2
                    }
                  ]
                }
              }
            ],
            "description": "Your images become frames of the video; each is an http(s) URL or base64, one to ten total. Plain images: one starts the video, two start and end it, with more the first starts it, the last ends it, and the rest fall evenly in between (3 or more need a set duration). To control the timing yourself, send [seconds, image] pairs in time order, e.g. [[0, \"...\"], [3.5, \"...\"]]: each image becomes the frame at that second, and with duration: \"auto\" the video runs to the last pair's second, rounded up (20s max)."
          },
          "aspect_ratio": {
            "type": "string",
            "description": "Output aspect ratio. auto lets the harness choose from the prompt and any references.",
            "default": "auto",
            "enum": [
              "auto",
              "21:9",
              "2:1",
              "16:9",
              "4:3",
              "1:1",
              "3:4",
              "9:16"
            ]
          },
          "duration": {
            "oneOf": [
              {
                "type": "integer",
                "minimum": 5,
                "maximum": 20
              },
              {
                "type": "string",
                "enum": [
                  "auto"
                ]
              }
            ],
            "description": "Video duration in seconds (any whole second from 5 to 20), or auto to fit the content.",
            "default": "auto"
          },
          "resolution": {
            "type": "string",
            "description": "Video resolution class: hd, or fhd for a higher-resolution result finished by the video upsampler. Exact dimensions vary with the aspect ratio.",
            "default": "hd",
            "enum": [
              "hd",
              "fhd"
            ]
          },
          "version": {
            "type": "string",
            "description": "Endpoint version. `latest` serves the current release.",
            "example": "latest",
            "enum": [
              "latest"
            ]
          },
          "generate_audio": {
            "type": "boolean",
            "description": "Generate synchronized audio alongside the video.",
            "default": true
          },
          "safety_tolerance": {
            "type": "integer",
            "description": "Tolerance level for input and output harm moderation. Between 0 and 4, with 0 the strictest. Sexual content is limited to level 3 and hate content to level 2 regardless of the requested tolerance. Contextual safety signals can tighten the requested level.",
            "minimum": 0,
            "maximum": 4,
            "default": 2
          },
          "draft": {
            "type": "boolean",
            "description": "Draft mode: generate a fast preview and return a draft_cache download URL in the result. Download that bundle and pass it back later to render the full-quality version of the same generation.",
            "default": false
          },
          "webhook_url": {
            "type": "string",
            "description": "TTAPI asynchronous callback URL. The initial response returns `jobId`; use this callback or the Flux fetch endpoint to receive the final video result."
          }
        },
        "required": [
          "mode",
          "prompt",
          "keyframes"
        ],
        "additionalProperties": false
      },
      "example": {
        "mode": "i2v",
        "prompt": "The camera slowly moves closer as soft light crosses the scene.",
        "keyframes": [
          "https://cdn.ttapi.io/example/reference-image.png"
        ],
        "duration": 5,
        "resolution": "hd"
      },
      "docs": [
        "https://docs.ttapi.io/api/en/flux/flux-3-video.md",
        "https://docs.ttapi.io/api/en/flux/video-result.md",
        "https://docs.ttapi.io/openapi/en/flux.json"
      ],
      "poll": {
        "method": "GET",
        "path": "/bfl/v1/fetch",
        "idParam": "jobId",
        "location": "body",
        "bodyType": "multipart"
      },
      "assetPaths": [
        "data.videoUrl",
        "data.draftCache"
      ]
    },
    "flux3-video-continuation": {
      "family": "flux3-video",
      "description": "Video Continuation with FLUX 3 video.",
      "method": "POST",
      "path": "/bfl/v1/flux-3-video",
      "bodyType": "json",
      "schema": {
        "title": "Video Continuation",
        "description": "Video continuation: the generated clip carries on from your video's\nfinal frames.",
        "type": "object",
        "properties": {
          "prompt": {
            "type": "string",
            "description": "Free-form prompt describing the video.",
            "minLength": 1
          },
          "mode": {
            "type": "string",
            "description": "Allowed value: \"v2v\"",
            "default": "v2v",
            "const": "v2v"
          },
          "start_video": {
            "type": "string",
            "description": "The video to continue, an http(s) URL or base64 mp4; the generated clip carries on from its final frames.",
            "minLength": 1
          },
          "aspect_ratio": {
            "type": "string",
            "description": "Output aspect ratio. auto lets the harness choose from the prompt and any references.",
            "default": "auto",
            "enum": [
              "auto",
              "21:9",
              "2:1",
              "16:9",
              "4:3",
              "1:1",
              "3:4",
              "9:16"
            ]
          },
          "duration": {
            "oneOf": [
              {
                "type": "integer",
                "minimum": 5,
                "maximum": 20
              },
              {
                "type": "string",
                "enum": [
                  "auto"
                ]
              }
            ],
            "description": "Video duration in seconds (any whole second from 5 to 20), or auto to fit the content.",
            "default": "auto"
          },
          "resolution": {
            "type": "string",
            "description": "Video resolution class: hd, or fhd for a higher-resolution result finished by the video upsampler. Exact dimensions vary with the aspect ratio.",
            "default": "hd",
            "enum": [
              "hd",
              "fhd"
            ]
          },
          "version": {
            "type": "string",
            "description": "Endpoint version. `latest` serves the current release.",
            "example": "latest",
            "enum": [
              "latest"
            ]
          },
          "generate_audio": {
            "type": "boolean",
            "description": "Generate synchronized audio alongside the video.",
            "default": true
          },
          "safety_tolerance": {
            "type": "integer",
            "description": "Tolerance level for input and output harm moderation. Between 0 and 4, with 0 the strictest. Sexual content is limited to level 3 and hate content to level 2 regardless of the requested tolerance. Contextual safety signals can tighten the requested level.",
            "minimum": 0,
            "maximum": 4,
            "default": 2
          },
          "draft": {
            "type": "boolean",
            "description": "Draft mode: generate a fast preview and return a draft_cache download URL in the result. Download that bundle and pass it back later to render the full-quality version of the same generation.",
            "default": false
          },
          "webhook_url": {
            "type": "string",
            "description": "TTAPI asynchronous callback URL. The initial response returns `jobId`; use this callback or the Flux fetch endpoint to receive the final video result."
          }
        },
        "required": [
          "mode",
          "prompt",
          "start_video"
        ],
        "additionalProperties": false
      },
      "example": {
        "mode": "v2v",
        "prompt": "Continue the smooth camera movement across the landscape.",
        "start_video": "https://cdn.ttapi.io/example/reference-video.mp4",
        "duration": 5,
        "resolution": "hd"
      },
      "docs": [
        "https://docs.ttapi.io/api/en/flux/flux-3-video.md",
        "https://docs.ttapi.io/api/en/flux/video-result.md",
        "https://docs.ttapi.io/openapi/en/flux.json"
      ],
      "poll": {
        "method": "GET",
        "path": "/bfl/v1/fetch",
        "idParam": "jobId",
        "location": "body",
        "bodyType": "multipart"
      },
      "assetPaths": [
        "data.videoUrl",
        "data.draftCache"
      ]
    },
    "flux3-draft-enhance": {
      "family": "flux3-video",
      "description": "Draft Enhance with FLUX 3 video.",
      "method": "POST",
      "path": "/bfl/v1/flux-3-video",
      "bodyType": "json",
      "schema": {
        "title": "Draft Enhance",
        "description": "Full-quality render of a prior draft generation. The bundle pins the\ngeneration itself -- the original mode, prompt, seed, and conditioning\nmedia -- so resolution is the only output choice left to the caller.",
        "type": "object",
        "properties": {
          "mode": {
            "type": "string",
            "description": "Allowed value: \"draft_enhance\"",
            "default": "draft_enhance",
            "const": "draft_enhance"
          },
          "draft_cache": {
            "type": "string",
            "description": "Encrypted draft-cache bundle from a prior draft generation. Primary form: the base64-encoded .bin file downloaded from the prior result's draft_cache URL. An http(s) URL is also accepted for replays within the download URL's expiry window. The harness is skipped and the original FLUX call is reproduced at full quality; the original inputs are embedded in the bundle.",
            "minLength": 1
          },
          "resolution": {
            "type": "string",
            "description": "Video resolution class of the enhanced result: fhd (default) finishes the reproduced generation with the video upsampler, hd returns it without that pass. The reproduced generation is identical either way; only the finishing pass differs.",
            "default": "fhd",
            "enum": [
              "hd",
              "fhd"
            ]
          },
          "safety_tolerance": {
            "type": "integer",
            "description": "Tolerance level for input and output harm moderation. Between 0 and 4, with 0 the strictest. Sexual content is limited to level 3 and hate content to level 2 regardless of the requested tolerance. Contextual safety signals can tighten the requested level.",
            "minimum": 0,
            "maximum": 4,
            "default": 2
          },
          "webhook_url": {
            "type": "string",
            "description": "TTAPI asynchronous callback URL. The initial response returns `jobId`; use this callback or the Flux fetch endpoint to receive the final video result."
          }
        },
        "required": [
          "mode",
          "draft_cache"
        ],
        "additionalProperties": false
      },
      "example": {
        "mode": "draft_enhance",
        "draft_cache": "REPLACE_WITH_DRAFT_CACHE_URL_OR_BASE64",
        "resolution": "fhd"
      },
      "docs": [
        "https://docs.ttapi.io/api/en/flux/flux-3-video.md",
        "https://docs.ttapi.io/api/en/flux/video-result.md",
        "https://docs.ttapi.io/openapi/en/flux.json"
      ],
      "poll": {
        "method": "GET",
        "path": "/bfl/v1/fetch",
        "idParam": "jobId",
        "location": "body",
        "bodyType": "multipart"
      },
      "assetPaths": [
        "data.videoUrl",
        "data.draftCache"
      ]
    }
  }
};

catalog.operations['flux3-image-to-video'].validate = input => {
  const frames = input.keyframes;
  if (typeof frames === 'string') return [];
  const errors = [];
  const timed = frames.map(frame => Array.isArray(frame));
  if (timed.some(Boolean) && !timed.every(Boolean)) errors.push('Use either plain image references or timed [seconds, image] pairs consistently.');
  if (timed.every(Boolean)) {
    let previous = -1;
    for (const [seconds, image] of frames) {
      if (typeof seconds !== 'number' || !Number.isFinite(seconds) || seconds < 0 || seconds > 20 || seconds <= previous) errors.push('Keyframe times must be finite, increasing numbers between 0 and 20 seconds.');
      if (typeof image !== 'string' || !image.trim()) errors.push('Each keyframe pair needs an image URL or base64 string.');
      previous = seconds;
    }
    if (typeof input.duration === 'number' && frames.at(-1)[0] > input.duration) errors.push('A keyframe cannot occur after the selected duration.');
  } else if (frames.length >= 3 && (input.duration === undefined || input.duration === 'auto')) errors.push('Three or more plain images require an explicit duration.');
  return errors;
};
