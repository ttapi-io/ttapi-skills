// Official TTAPI schemas, checked 2026-10-26. No credentials or network calls.
export const catalog = {
  "skill": "ttapi-producer",
  "title": "TTAPI Producer music and Lyria workflows",
  "operations": {
    "producer-generate": {
      "family": "producer",
      "description": "Generate one Producer music track.",
      "method": "POST",
      "path": "/producer/v1/music",
      "bodyType": "json",
      "schema": {
        "type": "object",
        "properties": {
          "sound_prompt": {
            "type": "string",
            "description": "Audio prompt, sound_prompt and lyrics_text cannot both be empty"
          },
          "lyrics_text": {
            "type": "string",
            "description": "Lyrics text, sound_prompt and lyrics_text cannot both be empty"
          },
          "instrumental": {
            "type": "boolean",
            "description": "Whether to generate pure music",
            "default": false
          },
          "mv": {
            "type": "string",
            "default": "FUZZ-2.0",
            "enum": [
              "FUZZ-2.0 Pro",
              "FUZZ-2.0",
              "FUZZ-2.0 Raw",
              "FUZZ-1.1 Pro",
              "FUZZ-1.0 Pro",
              "FUZZ-1.0",
              "FUZZ-1.1",
              "FUZZ-0.8",
              "Lyria 3 preview",
              "Lyria 3 Pro"
            ],
            "description": "Model to use, supported options listed above"
          },
          "title": {
            "type": "string",
            "description": "Title"
          },
          "cover_art_url": {
            "type": "string",
            "description": "Cover URL",
            "pattern": "^https?://"
          },
          "seed": {
            "type": "string",
            "description": "Random seed"
          },
          "lyrics_strength": {
            "type": "number",
            "description": "Lyrics strength, optional 0-1",
            "default": 0.5,
            "minimum": 0,
            "maximum": 1
          },
          "sound_strength": {
            "type": "number",
            "description": "Audio prompt strength, optional 0.2-1",
            "default": 0.5,
            "minimum": 0.2,
            "maximum": 1
          },
          "weirdness": {
            "type": "number",
            "description": "Style weirdness, optional 0-1",
            "default": 0.5,
            "minimum": 0,
            "maximum": 1
          },
          "is_storage": {
            "type": "boolean",
            "description": "Whether to save",
            "default": false
          },
          "hook_url": {
            "type": "string",
            "description": "Callback notification URL. The data returned is consistent with the task result query response"
          }
        },
        "required": [
          "sound_prompt",
          "lyrics_text"
        ],
        "additionalProperties": false,
        "anyOf": [
          {
            "required": [
              "sound_prompt"
            ],
            "properties": {
              "sound_prompt": {
                "minLength": 1
              }
            }
          },
          {
            "required": [
              "lyrics_text"
            ],
            "properties": {
              "lyrics_text": {
                "minLength": 1
              }
            }
          }
        ]
      },
      "example": {
        "mv": "FUZZ-2.0",
        "sound_prompt": "Gentle instrumental acoustic music with warm piano and a calm mood.",
        "lyrics_text": "",
        "instrumental": true,
        "title": "Quiet Morning"
      },
      "docs": [
        "https://docs.ttapi.io/api/en/producer/producer_generate.md",
        "https://docs.ttapi.io/openapi/en/producer.json"
      ],
      "poll": {
        "method": "GET",
        "path": "/producer/v1/fetch",
        "idParam": "jobId",
        "location": "query"
      },
      "assetPaths": [
        "data.musics.*.audioUrl"
      ]
    },
    "producer-lyrics": {
      "family": "producer",
      "description": "Write lyrics from a prompt; official example returns text synchronously.",
      "method": "POST",
      "path": "/producer/v1/lyrics",
      "bodyType": "json",
      "schema": {
        "type": "object",
        "properties": {
          "prompt": {
            "type": "string",
            "description": "Prompt",
            "minLength": 1
          }
        },
        "required": [
          "prompt"
        ],
        "additionalProperties": false
      },
      "example": {
        "prompt": "Write an original hopeful verse and chorus about a new beginning."
      },
      "docs": [
        "https://docs.ttapi.io/api/en/producer/producer_lyrics.md",
        "https://docs.ttapi.io/openapi/en/producer.json"
      ],
      "assetPaths": []
    },
    "producer-extend": {
      "family": "producer",
      "description": "Extend a successfully completed Producer track.",
      "method": "POST",
      "path": "/producer/v1/extend",
      "bodyType": "json",
      "schema": {
        "type": "object",
        "properties": {
          "music_id": {
            "type": "string",
            "description": "Parent task's musicId",
            "minLength": 1
          },
          "starts": {
            "type": "number",
            "description": "Indicates extending from the nth second of the original audio, unit: seconds",
            "default": 30,
            "minimum": 0
          },
          "sound_prompt": {
            "type": "string",
            "description": "Audio prompt, sound_prompt and lyrics_text cannot both be empty"
          },
          "lyrics_text": {
            "type": "string",
            "description": "Lyrics text, sound_prompt and lyrics_text cannot both be empty"
          },
          "instrumental": {
            "type": "boolean",
            "default": false,
            "description": "Whether to generate pure music"
          },
          "mv": {
            "type": "string",
            "default": "FUZZ-2.0",
            "enum": [
              "FUZZ-2.0 Pro",
              "FUZZ-2.0",
              "FUZZ-2.0 Raw",
              "FUZZ-1.1 Pro",
              "FUZZ-1.0 Pro",
              "FUZZ-1.0",
              "FUZZ-1.1",
              "FUZZ-0.8",
              "Lyria 3 preview"
            ],
            "description": "Model to use, supported options listed above"
          },
          "title": {
            "type": "string",
            "description": "Title"
          },
          "cover_art_url": {
            "type": "string",
            "description": "Cover URL",
            "pattern": "^https?://"
          },
          "seed": {
            "type": "string",
            "description": "Random seed"
          },
          "lyrics_strength": {
            "type": "number",
            "description": "Lyrics strength, optional 0-1",
            "default": 0.5,
            "minimum": 0,
            "maximum": 1
          },
          "sound_strength": {
            "type": "number",
            "description": "Audio prompt strength, optional 0.2-1",
            "default": 0.5,
            "minimum": 0.2,
            "maximum": 1
          },
          "weirdness": {
            "type": "number",
            "description": "Style weirdness, optional 0-1",
            "default": 0.5,
            "minimum": 0,
            "maximum": 1
          },
          "is_storage": {
            "type": "boolean",
            "description": "Whether to save",
            "default": false
          },
          "hook_url": {
            "type": "string",
            "description": "Callback notification URL. The data returned is consistent with the task result query response"
          }
        },
        "required": [
          "music_id",
          "starts",
          "sound_prompt",
          "lyrics_text"
        ],
        "additionalProperties": false,
        "anyOf": [
          {
            "required": [
              "sound_prompt"
            ],
            "properties": {
              "sound_prompt": {
                "minLength": 1
              }
            }
          },
          {
            "required": [
              "lyrics_text"
            ],
            "properties": {
              "lyrics_text": {
                "minLength": 1
              }
            }
          }
        ]
      },
      "example": {
        "music_id": "REPLACE_WITH_COMPLETED_PRODUCER_MUSIC_ID",
        "starts": 20,
        "sound_prompt": "Continue the warm acoustic melody.",
        "lyrics_text": "",
        "instrumental": true,
        "mv": "FUZZ-2.0"
      },
      "docs": [
        "https://docs.ttapi.io/api/en/producer/producer_extend.md",
        "https://docs.ttapi.io/openapi/en/producer.json"
      ],
      "poll": {
        "method": "GET",
        "path": "/producer/v1/fetch",
        "idParam": "jobId",
        "location": "query"
      },
      "assetPaths": [
        "data.musics.*.audioUrl"
      ]
    },
    "producer-cover": {
      "family": "producer",
      "description": "Restyle a completed Producer track.",
      "method": "POST",
      "path": "/producer/v1/cover",
      "bodyType": "json",
      "schema": {
        "type": "object",
        "properties": {
          "music_id": {
            "type": "string",
            "description": "Parent task's musicId",
            "minLength": 1
          },
          "sound_prompt": {
            "type": "string",
            "description": "Audio prompt, sound_prompt and lyrics_text cannot both be empty"
          },
          "lyrics_text": {
            "type": "string",
            "description": "Lyrics text, sound_prompt and lyrics_text cannot both be empty"
          },
          "instrumental": {
            "type": "boolean",
            "default": false,
            "description": "Whether to generate pure music"
          },
          "mv": {
            "type": "string",
            "default": "FUZZ-2.0",
            "enum": [
              "FUZZ-2.0 Pro",
              "FUZZ-2.0",
              "FUZZ-2.0 Raw",
              "FUZZ-1.1 Pro",
              "FUZZ-1.0 Pro",
              "FUZZ-1.0",
              "FUZZ-1.1",
              "FUZZ-0.8",
              "Lyria 3 preview"
            ],
            "description": "Model to use, supported options listed above"
          },
          "title": {
            "type": "string",
            "description": "Title"
          },
          "cover_art_url": {
            "type": "string",
            "description": "Cover URL",
            "pattern": "^https?://"
          },
          "seed": {
            "type": "string",
            "description": "Random seed"
          },
          "lyrics_strength": {
            "type": "number",
            "description": "Lyrics strength, optional 0-1",
            "default": 0.5,
            "minimum": 0,
            "maximum": 1
          },
          "sound_strength": {
            "type": "number",
            "description": "Audio prompt strength, optional 0.2-1",
            "default": 0.5,
            "minimum": 0.2,
            "maximum": 1
          },
          "weirdness": {
            "type": "number",
            "description": "Style weirdness, optional 0-1",
            "default": 0.5,
            "minimum": 0,
            "maximum": 1
          },
          "is_storage": {
            "type": "boolean",
            "description": "Whether to save",
            "default": false
          },
          "hook_url": {
            "type": "string",
            "description": "Callback notification URL. The data returned is consistent with the task result query response"
          }
        },
        "required": [
          "music_id",
          "sound_prompt",
          "lyrics_text"
        ],
        "additionalProperties": false,
        "anyOf": [
          {
            "required": [
              "sound_prompt"
            ],
            "properties": {
              "sound_prompt": {
                "minLength": 1
              }
            }
          },
          {
            "required": [
              "lyrics_text"
            ],
            "properties": {
              "lyrics_text": {
                "minLength": 1
              }
            }
          }
        ]
      },
      "example": {
        "music_id": "REPLACE_WITH_COMPLETED_PRODUCER_MUSIC_ID",
        "sound_prompt": "Mellow jazz piano arrangement.",
        "lyrics_text": "",
        "instrumental": true,
        "mv": "FUZZ-2.0"
      },
      "docs": [
        "https://docs.ttapi.io/api/en/producer/producer_cover.md",
        "https://docs.ttapi.io/openapi/en/producer.json"
      ],
      "poll": {
        "method": "GET",
        "path": "/producer/v1/fetch",
        "idParam": "jobId",
        "location": "query"
      },
      "assetPaths": [
        "data.musics.*.audioUrl"
      ]
    },
    "producer-variation": {
      "family": "producer",
      "description": "Generate a variation from an existing Producer track.",
      "method": "POST",
      "path": "/producer/v1/variation",
      "bodyType": "json",
      "schema": {
        "type": "object",
        "properties": {
          "music_id": {
            "type": "string",
            "description": "Parent task's musicId",
            "minLength": 1
          },
          "is_storage": {
            "type": "boolean",
            "description": "Whether to save",
            "default": false
          },
          "hook_url": {
            "type": "string",
            "description": "Callback notification URL. The data returned is consistent with the task result query response"
          }
        },
        "required": [
          "music_id"
        ],
        "additionalProperties": false
      },
      "example": {
        "music_id": "REPLACE_WITH_COMPLETED_PRODUCER_MUSIC_ID"
      },
      "docs": [
        "https://docs.ttapi.io/api/en/producer/producer_variation.md",
        "https://docs.ttapi.io/openapi/en/producer.json"
      ],
      "poll": {
        "method": "GET",
        "path": "/producer/v1/fetch",
        "idParam": "jobId",
        "location": "query"
      },
      "assetPaths": [
        "data.musics.*.audioUrl"
      ]
    },
    "producer-replace": {
      "family": "producer",
      "description": "Replace a section of a completed Producer track.",
      "method": "POST",
      "path": "/producer/v1/replace",
      "bodyType": "json",
      "schema": {
        "type": "object",
        "properties": {
          "music_id": {
            "type": "string",
            "description": "Parent task's musicId",
            "minLength": 1
          },
          "sound_prompt": {
            "type": "string",
            "description": "Audio prompt, sound_prompt and lyrics_text cannot both be empty"
          },
          "lyrics_text": {
            "type": "string",
            "description": "Lyrics text, sound_prompt and lyrics_text cannot both be empty"
          },
          "instrumental": {
            "type": "boolean",
            "default": false,
            "description": "Whether to generate pure music"
          },
          "starts": {
            "type": "number",
            "example": [
              "30.01"
            ],
            "description": "Indicates starting replacement from x seconds of the original audio",
            "minimum": 0
          },
          "ends": {
            "type": "number",
            "description": "End time of the replacement segment (seconds)",
            "minimum": 0
          },
          "mv": {
            "type": "string",
            "default": "FUZZ-2.0",
            "enum": [
              "FUZZ-2.0 Pro",
              "FUZZ-2.0",
              "FUZZ-2.0 Raw",
              "FUZZ-1.1 Pro",
              "FUZZ-1.0 Pro",
              "FUZZ-1.0",
              "FUZZ-1.1",
              "FUZZ-0.8",
              "Lyria 3 preview"
            ],
            "description": "Model to use, supported options listed above"
          },
          "title": {
            "type": "string",
            "description": "Title"
          },
          "cover_art_url": {
            "type": "string",
            "description": "Cover URL",
            "pattern": "^https?://"
          },
          "seed": {
            "type": "string",
            "description": "Random seed"
          },
          "lyrics_strength": {
            "type": "number",
            "description": "Lyrics strength, optional 0-1",
            "default": 0.5,
            "minimum": 0,
            "maximum": 1
          },
          "sound_strength": {
            "type": "number",
            "description": "Audio prompt strength, optional 0.2-1",
            "default": 0.5,
            "minimum": 0.2,
            "maximum": 1
          },
          "weirdness": {
            "type": "number",
            "description": "Style weirdness, optional 0-1",
            "default": 0.5,
            "minimum": 0,
            "maximum": 1
          },
          "is_storage": {
            "type": "boolean",
            "description": "Whether to save",
            "default": false
          },
          "hook_url": {
            "type": "string",
            "description": "Callback notification URL. The data returned is consistent with the task result query response"
          }
        },
        "required": [
          "music_id",
          "sound_prompt",
          "lyrics_text"
        ],
        "additionalProperties": false,
        "anyOf": [
          {
            "required": [
              "sound_prompt"
            ],
            "properties": {
              "sound_prompt": {
                "minLength": 1
              }
            }
          },
          {
            "required": [
              "lyrics_text"
            ],
            "properties": {
              "lyrics_text": {
                "minLength": 1
              }
            }
          }
        ]
      },
      "example": {
        "music_id": "REPLACE_WITH_COMPLETED_PRODUCER_MUSIC_ID",
        "starts": 10,
        "ends": 20,
        "sound_prompt": "A gentle piano bridge.",
        "lyrics_text": "",
        "instrumental": true,
        "mv": "FUZZ-2.0"
      },
      "docs": [
        "https://docs.ttapi.io/api/en/producer/producer_replace.md",
        "https://docs.ttapi.io/openapi/en/producer.json"
      ],
      "poll": {
        "method": "GET",
        "path": "/producer/v1/fetch",
        "idParam": "jobId",
        "location": "query"
      },
      "assetPaths": [
        "data.musics.*.audioUrl"
      ]
    },
    "producer-vocals-swap": {
      "family": "producer",
      "description": "Replace the vocals of a completed Producer track.",
      "method": "POST",
      "path": "/producer/v1/vocals-swap",
      "bodyType": "json",
      "schema": {
        "type": "object",
        "properties": {
          "music_id": {
            "type": "string",
            "description": "Parent task's musicId",
            "minLength": 1
          },
          "sound_prompt": {
            "type": "string",
            "description": "Audio prompt, sound_prompt and lyrics_text cannot both be empty"
          },
          "lyrics_text": {
            "type": "string",
            "description": "Lyrics text, sound_prompt and lyrics_text cannot both be empty"
          },
          "instrumental": {
            "type": "boolean",
            "description": "Whether to generate pure music",
            "default": false
          },
          "mv": {
            "type": "string",
            "default": "FUZZ-2.0",
            "enum": [
              "FUZZ-2.0 Pro",
              "FUZZ-2.0",
              "FUZZ-2.0 Raw",
              "FUZZ-1.1 Pro",
              "FUZZ-1.0 Pro",
              "FUZZ-1.0",
              "FUZZ-1.1",
              "FUZZ-0.8",
              "Lyria 3 preview"
            ],
            "description": "Model to use, supported options listed above"
          },
          "title": {
            "type": "string",
            "description": "Title"
          },
          "cover_art_url": {
            "type": "string",
            "description": "Cover URL",
            "pattern": "^https?://"
          },
          "seed": {
            "type": "string",
            "description": "Random seed"
          },
          "lyrics_strength": {
            "type": "number",
            "description": "Lyrics strength, optional 0-1",
            "default": 0.5,
            "minimum": 0,
            "maximum": 1
          },
          "sound_strength": {
            "type": "number",
            "description": "Audio prompt strength, optional 0.2-1",
            "default": 0.5,
            "minimum": 0.2,
            "maximum": 1
          },
          "weirdness": {
            "type": "number",
            "description": "Style weirdness, optional 0-1",
            "default": 0.5,
            "minimum": 0,
            "maximum": 1
          },
          "is_storage": {
            "type": "boolean",
            "description": "Whether to save",
            "default": false
          },
          "hook_url": {
            "type": "string",
            "description": "Callback notification URL. The data returned is consistent with the task result query response"
          }
        },
        "required": [
          "sound_prompt",
          "lyrics_text",
          "music_id"
        ],
        "additionalProperties": false,
        "anyOf": [
          {
            "required": [
              "sound_prompt"
            ],
            "properties": {
              "sound_prompt": {
                "minLength": 1
              }
            }
          },
          {
            "required": [
              "lyrics_text"
            ],
            "properties": {
              "lyrics_text": {
                "minLength": 1
              }
            }
          }
        ]
      },
      "example": {
        "music_id": "REPLACE_WITH_COMPLETED_PRODUCER_MUSIC_ID",
        "sound_prompt": "Soft melodic pop vocals.",
        "lyrics_text": "[Verse]\nA new day opens at the door",
        "mv": "FUZZ-2.0"
      },
      "docs": [
        "https://docs.ttapi.io/api/en/producer/producer_vocals-swap.md",
        "https://docs.ttapi.io/openapi/en/producer.json"
      ],
      "poll": {
        "method": "GET",
        "path": "/producer/v1/fetch",
        "idParam": "jobId",
        "location": "query"
      },
      "assetPaths": [
        "data.musics.*.audioUrl"
      ]
    },
    "producer-instrumentals-swap": {
      "family": "producer",
      "description": "Replace the accompaniment of a completed Producer track.",
      "method": "POST",
      "path": "/producer/v1/instrumentals-swap",
      "bodyType": "json",
      "schema": {
        "type": "object",
        "properties": {
          "music_id": {
            "type": "string",
            "description": "Parent task's musicId",
            "minLength": 1
          },
          "sound_prompt": {
            "type": "string",
            "description": "Audio prompt, sound_prompt and lyrics_text cannot both be empty"
          },
          "lyrics_text": {
            "type": "string",
            "description": "Lyrics text, sound_prompt and lyrics_text cannot both be empty"
          },
          "instrumental": {
            "type": "boolean",
            "default": false,
            "description": "Whether to generate pure music"
          },
          "mv": {
            "type": "string",
            "default": "FUZZ-2.0",
            "enum": [
              "FUZZ-2.0 Pro",
              "FUZZ-2.0",
              "FUZZ-2.0 Raw",
              "FUZZ-1.1 Pro",
              "FUZZ-1.0 Pro",
              "FUZZ-1.0",
              "FUZZ-1.1",
              "FUZZ-0.8",
              "Lyria 3 preview"
            ],
            "description": "Model to use, supported options listed above"
          },
          "title": {
            "type": "string",
            "description": "Title"
          },
          "cover_art_url": {
            "type": "string",
            "description": "Cover URL",
            "pattern": "^https?://"
          },
          "seed": {
            "type": "string",
            "description": "Random seed"
          },
          "lyrics_strength": {
            "type": "number",
            "description": "Lyrics strength, optional 0-1",
            "default": 0.5,
            "minimum": 0,
            "maximum": 1
          },
          "sound_strength": {
            "type": "number",
            "description": "Audio prompt strength, optional 0.2-1",
            "default": 0.5,
            "minimum": 0.2,
            "maximum": 1
          },
          "weirdness": {
            "type": "number",
            "description": "Style weirdness, optional 0-1",
            "default": 0.5,
            "minimum": 0,
            "maximum": 1
          },
          "is_storage": {
            "type": "boolean",
            "description": "Whether to save",
            "default": false
          },
          "hook_url": {
            "type": "string",
            "description": "Callback notification URL. The data returned is consistent with the task result query response"
          }
        },
        "required": [
          "music_id",
          "sound_prompt",
          "lyrics_text"
        ],
        "additionalProperties": false,
        "anyOf": [
          {
            "required": [
              "sound_prompt"
            ],
            "properties": {
              "sound_prompt": {
                "minLength": 1
              }
            }
          },
          {
            "required": [
              "lyrics_text"
            ],
            "properties": {
              "lyrics_text": {
                "minLength": 1
              }
            }
          }
        ]
      },
      "example": {
        "music_id": "REPLACE_WITH_COMPLETED_PRODUCER_MUSIC_ID",
        "sound_prompt": "Warm acoustic guitar and brushed drums.",
        "lyrics_text": "",
        "mv": "FUZZ-2.0"
      },
      "docs": [
        "https://docs.ttapi.io/api/en/producer/producer_instrumentals-swap.md",
        "https://docs.ttapi.io/openapi/en/producer.json"
      ],
      "poll": {
        "method": "GET",
        "path": "/producer/v1/fetch",
        "idParam": "jobId",
        "location": "query"
      },
      "assetPaths": [
        "data.musics.*.audioUrl"
      ]
    },
    "producer-stems": {
      "family": "producer",
      "description": "Separate a completed Producer track into stems.",
      "method": "POST",
      "path": "/producer/v1/stems",
      "bodyType": "json",
      "schema": {
        "type": "object",
        "properties": {
          "music_id": {
            "type": "string",
            "description": "Parent task's musicId",
            "minLength": 1
          },
          "hook_url": {
            "type": "string",
            "description": "Callback notification URL. The data returned is consistent with the task result query response"
          }
        },
        "required": [
          "music_id"
        ],
        "additionalProperties": false
      },
      "example": {
        "music_id": "REPLACE_WITH_COMPLETED_PRODUCER_MUSIC_ID"
      },
      "docs": [
        "https://docs.ttapi.io/api/en/producer/producer_stems.md",
        "https://docs.ttapi.io/openapi/en/producer.json"
      ],
      "poll": {
        "method": "GET",
        "path": "/producer/v1/fetch",
        "idParam": "jobId",
        "location": "query"
      },
      "assetPaths": [
        "data.musics.*.audioUrl"
      ]
    },
    "producer-download": {
      "family": "producer",
      "description": "Request mp3 or wav export of a Producer track.",
      "method": "POST",
      "path": "/producer/v1/download",
      "bodyType": "json",
      "schema": {
        "type": "object",
        "properties": {
          "music_id": {
            "type": "string",
            "description": "Parent task's musicId",
            "minLength": 1
          },
          "format": {
            "type": "string",
            "enum": [
              "wav",
              "mp3"
            ],
            "description": "Supported format options"
          }
        },
        "required": [
          "music_id",
          "format"
        ],
        "additionalProperties": false
      },
      "example": {
        "music_id": "REPLACE_WITH_COMPLETED_PRODUCER_MUSIC_ID",
        "format": "wav"
      },
      "docs": [
        "https://docs.ttapi.io/api/en/producer/producer_download.md",
        "https://docs.ttapi.io/openapi/en/producer.json"
      ],
      "poll": {
        "method": "GET",
        "path": "/producer/v1/fetch",
        "idParam": "jobId",
        "location": "query"
      },
      "assetPaths": [
        "data.musics.*.audioUrl"
      ]
    },
    "producer-upload": {
      "family": "producer",
      "description": "Import source audio from a publicly accessible URL.",
      "method": "POST",
      "path": "/producer/v1/upload",
      "bodyType": "json",
      "schema": {
        "type": "object",
        "properties": {
          "audio_url": {
            "type": "string",
            "description": "Audio file URL",
            "minLength": 1,
            "pattern": "^https?://"
          },
          "hook_url": {
            "type": "string",
            "description": "Callback notification URL. The data returned is consistent with the task result query response"
          }
        },
        "required": [
          "audio_url"
        ],
        "additionalProperties": false
      },
      "example": {
        "audio_url": "https://cdn.ttapi.io/example/source-audio.mp3"
      },
      "docs": [
        "https://docs.ttapi.io/api/en/producer/producer_upload.md",
        "https://docs.ttapi.io/openapi/en/producer.json"
      ],
      "poll": {
        "method": "GET",
        "path": "/producer/v1/fetch",
        "idParam": "jobId",
        "location": "query"
      },
      "assetPaths": []
    },
    "producer-generate-video": {
      "family": "producer",
      "description": "Create a video for a Producer track; official example returns a video URL synchronously.",
      "method": "POST",
      "path": "/producer/v1/generate-video",
      "bodyType": "json",
      "schema": {
        "type": "object",
        "properties": {
          "music_id": {
            "type": "string",
            "description": "Parent task's musicId",
            "minLength": 1
          },
          "preset": {
            "type": "string",
            "enum": [
              "modern",
              "player",
              "simple"
            ],
            "default": "simple",
            "description": "Preset video generation type, three options available"
          }
        },
        "required": [
          "music_id"
        ],
        "additionalProperties": false
      },
      "example": {
        "music_id": "REPLACE_WITH_COMPLETED_PRODUCER_MUSIC_ID",
        "preset": "simple"
      },
      "docs": [
        "https://docs.ttapi.io/api/en/producer/producer_generate-video.md",
        "https://docs.ttapi.io/openapi/en/producer.json"
      ],
      "assetPaths": [
        "data.videoUrl"
      ]
    }
  }
};

for (const operation of Object.values(catalog.operations)) {
  if (operation.schema.properties.sound_prompt && operation.schema.properties.lyrics_text) operation.validate = input => {
    const errors = [];
    if (!input.sound_prompt?.trim() && !input.lyrics_text?.trim()) errors.push('sound_prompt and lyrics_text cannot both be empty.');
    if (input.starts !== undefined && input.ends !== undefined && input.ends <= input.starts) errors.push('ends must be greater than starts.');
    return errors;
  };
}
