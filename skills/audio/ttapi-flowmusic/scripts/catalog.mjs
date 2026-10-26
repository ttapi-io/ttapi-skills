// Based on official TTAPI OpenAPI schemas, verified 2026-10-26.
const sourceCatalog = {
  "skill": "ttapi-audio",
  "title": "TTAPI Music and Audio",
  "operations": {
    "suno-generate": {
      "family": "suno",
      "description": "Generate a song or instrumental with Suno; asynchronous.",
      "method": "POST",
      "path": "/suno/v1/music",
      "bodyType": "json",
      "schema": {
        "oneOf": [
          {
            "type": "object",
            "properties": {
              "custom": {
                "type": "boolean",
                "default": true,
                "enum": [
                  true
                ],
                "description": "Custom mode. Fixed to true."
              },
              "instrumental": {
                "type": "boolean",
                "default": false,
                "description": "Whether to generate instrumental music.\n\n- **true**: Generate instrumental-only music and ignore the lyrics\n- **false**: Generate a track with vocals. **prompt** is required"
              },
              "mv": {
                "type": "string",
                "description": "Model to use. Available values: `chirp-v6`, `chirp-v6-wild`, `chirp-v6-mini`. Suno legacy models have all been discontinued; passing a legacy name maps it to `chirp-v6`. See [Model Mapping](/api/en/suno#model-mapping). After creating a custom model, you can also pass `chirp-custom:{model_id}`. See [Create Model](/api/en/suno/suno_create_model). `persona_id` and `chirp-custom` cannot be used together.",
                "anyOf": [
                  {
                    "enum": [
                      "chirp-v6",
                      "chirp-v6-wild",
                      "chirp-v6-mini"
                    ]
                  },
                  {
                    "pattern": "^chirp-custom:.+$"
                  }
                ]
              },
              "prompt": {
                "type": "string",
                "description": "Lyrics. Required when instrumental is false. The lyrics are used and sung in the generated track. Maximum length: 5000 characters.",
                "maxLength": 5000
              },
              "title": {
                "type": "string",
                "description": "Music title. Maximum length: 80 characters.",
                "maxLength": 80
              },
              "tags": {
                "type": "string",
                "description": "Music style or genre. Maximum length: 1000 characters.",
                "example": "rock, blues, hip-hop, r&b",
                "maxLength": 1000
              },
              "negative_tags": {
                "type": "string",
                "description": "Music styles or genres that should be excluded from generation."
              },
              "style_weight": {
                "type": "number",
                "description": "Music style weight, range: 0.00–1.00.",
                "example": 0.5,
                "minimum": 0,
                "maximum": 1
              },
              "weirdness_constraint": {
                "type": "number",
                "description": "Audio creativity (weirdness) weight, range: 0.00–1.00.",
                "example": 0.5,
                "minimum": 0,
                "maximum": 1
              },
              "audio_weight": {
                "type": "number",
                "description": "Audio weight, range: 0.00–1.00.",
                "example": 0.5,
                "minimum": 0,
                "maximum": 1
              },
              "auto_lyrics": {
                "type": "boolean",
                "default": false,
                "description": "Whether to automatically generate lyrics.\n\n- **true**: The input lyrics will be creatively rewritten\n- **false**: Use the provided lyrics directly to generate the music"
              },
              "duration": {
                "type": "integer",
                "description": "Audio duration, in seconds. Valid range: 10 <= x <= 360.",
                "example": 120,
                "minimum": 10,
                "maximum": 360
              },
              "vocal_gender": {
                "type": "string",
                "description": "Vocal gender.\n\n- Male: Male voice\n\n- Female: Female voice",
                "enum": [
                  "Male",
                  "Female"
                ]
              },
              "persona_id": {
                "type": "string",
                "description": "Music style ID.\n\nCannot be used together with `mv=chirp-custom:{model_id}`."
              },
              "variety": {
                "type": "string",
                "default": "normal",
                "enum": [
                  "off",
                  "normal",
                  "high",
                  "extra",
                  "max"
                ],
                "description": "Style variety. Controls how much the generated result varies from the specified style.\n\n- **off**: Exact style\n- **normal**: Balanced variety\n- **high**: Distinct styles\n- **extra**: Bold exploration\n- **max**: Unreasonably varied"
              },
              "max_mode": {
                "type": "boolean",
                "default": false,
                "description": "Whether to use more compute to maximize consistency throughout the song.\n\n- **false**: No (default)\n- **true**: Yes. Credit consumption is doubled when enabled"
              },
              "audio_format": {
                "type": "string",
                "enum": [
                  "mp3",
                  "m4a",
                  "wav"
                ],
                "example": "mp3",
                "description": "Audio format of `audioUrl` after the job succeeds."
              },
              "hookUrl": {
                "type": "string",
                "description": "Callback notification URL"
              },
              "isStorage": {
                "type": "boolean",
                "default": true,
                "deprecated": true,
                "description": "Whether to store the generated audio.\n\n- **true**: The audio will be stored and a TTAPI CDN URL will be returned\n- **false**: The original source URL will be returned"
              }
            },
            "required": [
              "custom",
              "instrumental",
              "mv"
            ],
            "additionalProperties": false,
            "if": {
              "properties": {
                "instrumental": {
                  "const": false
                }
              },
              "required": [
                "instrumental"
              ]
            },
            "then": {
              "required": [
                "prompt"
              ],
              "properties": {
                "prompt": {
                  "minLength": 1
                }
              }
            }
          },
          {
            "type": "object",
            "properties": {
              "custom": {
                "type": "boolean",
                "default": false,
                "enum": [
                  false
                ],
                "description": "Inspiration mode. Fixed to false."
              },
              "mv": {
                "type": "string",
                "description": "Model to use. Available values: `chirp-v6`, `chirp-v6-wild`, `chirp-v6-mini`. Suno legacy models have all been discontinued; passing a legacy name maps it to `chirp-v6`. See [Model Mapping](/api/en/suno#model-mapping). After creating a custom model, you can also pass `chirp-custom:{model_id}`. See [Create Model](/api/en/suno/suno_create_model). `persona_id` and `chirp-custom` cannot be used together.",
                "anyOf": [
                  {
                    "enum": [
                      "chirp-v6",
                      "chirp-v6-wild",
                      "chirp-v6-mini"
                    ]
                  },
                  {
                    "pattern": "^chirp-custom:.+$"
                  }
                ]
              },
              "gpt_description_prompt": {
                "type": "string",
                "description": "Inspiration mode prompt, up to 3000 characters. Either the prompt or reference audio is required.",
                "example": "Night city lo-fi piano with rain ambience, soft vocal phrases, theme: \"Under the city lights\""
              },
              "reference_music_ids": {
                "type": "array",
                "maxItems": 10,
                "items": {
                  "type": "string"
                },
                "description": "Reference audio. Provide music_id values of existing songs, up to 10. Either the prompt or reference audio is required."
              },
              "persona_id": {
                "type": "string",
                "description": "Music style ID.\n\nCannot be used together with `mv=chirp-custom:{model_id}`."
              },
              "audio_format": {
                "type": "string",
                "enum": [
                  "mp3",
                  "m4a",
                  "wav"
                ],
                "example": "mp3",
                "description": "Audio format of `audioUrl` after the job succeeds."
              },
              "hookUrl": {
                "type": "string",
                "description": "Callback notification URL"
              },
              "isStorage": {
                "type": "boolean",
                "default": true,
                "deprecated": true,
                "description": "Whether to store the generated audio.\n\n- **true**: The audio will be stored and a TTAPI CDN URL will be returned\n- **false**: The original source URL will be returned"
              }
            },
            "required": [
              "custom",
              "mv"
            ],
            "additionalProperties": false,
            "anyOf": [
              {
                "required": [
                  "gpt_description_prompt"
                ],
                "properties": {
                  "gpt_description_prompt": {
                    "minLength": 1,
                    "maxLength": 3000
                  }
                }
              },
              {
                "required": [
                  "reference_music_ids"
                ],
                "properties": {
                  "reference_music_ids": {
                    "minItems": 1
                  }
                }
              }
            ]
          }
        ],
        "type": "object"
      },
      "example": {
        "custom": true,
        "instrumental": true,
        "mv": "chirp-v6",
        "title": "Quiet Morning",
        "tags": "gentle acoustic guitar, warm piano, calm, instrumental",
        "duration": 30,
        "audio_format": "mp3"
      },
      "docs": [
        "https://docs.ttapi.io/api/en/suno/suno_music",
        "https://docs.ttapi.io/openapi/en/suno.json"
      ],
      "assetPaths": [
        "data.musics.*.audioUrl"
      ],
      "poll": {
        "method": "GET",
        "path": "/suno/v2/fetch",
        "idParam": "jobId",
        "location": "query"
      }
    },
    "suno-lyrics": {
      "family": "suno",
      "description": "Generate lyrics; asynchronous, returned as text by the Suno V2 fetch endpoint.",
      "method": "POST",
      "path": "/suno/v1/lyrics",
      "bodyType": "json",
      "schema": {
        "type": "object",
        "properties": {
          "prompt": {
            "type": "string",
            "description": "Prompt",
            "minLength": 1
          },
          "lyrics_model": {
            "type": "string",
            "description": "Lyrics model",
            "enum": [
              "classic",
              "remi"
            ],
            "default": "classic"
          },
          "hookUrl": {
            "type": "string",
            "description": "Callback notification URL"
          }
        },
        "required": [
          "prompt"
        ],
        "additionalProperties": false
      },
      "example": {
        "prompt": "A hopeful song about a new beginning",
        "lyrics_model": "classic"
      },
      "docs": [
        "https://docs.ttapi.io/api/en/suno/suno_lyrics",
        "https://docs.ttapi.io/openapi/en/suno.json"
      ],
      "assetPaths": [],
      "poll": {
        "method": "GET",
        "path": "/suno/v2/fetch",
        "idParam": "jobId",
        "location": "query"
      }
    },
    "suno-extend": {
      "family": "suno",
      "description": "Extend a completed Suno track from continue_at seconds; requires its musicId.",
      "method": "POST",
      "path": "/suno/v1/extend",
      "bodyType": "json",
      "schema": {
        "type": "object",
        "properties": {
          "prompt": {
            "type": "string",
            "description": "Lyrics. The lyrics are used and sung in the generated track. Maximum length: 5000 characters.",
            "maxLength": 5000
          },
          "title": {
            "type": "string",
            "description": "Music title. Maximum length: 80 characters.",
            "maxLength": 80
          },
          "tags": {
            "type": "string",
            "description": "Music style or genre. Maximum length: 1000 characters.",
            "example": "rock, blues, hip-hop, r&b",
            "maxLength": 1000
          },
          "negative_tags": {
            "type": "string",
            "description": "Music styles or genres that should be excluded from generation."
          },
          "style_weight": {
            "type": "number",
            "description": "Music style weight, range: 0.00–1.00.",
            "example": 0.5,
            "minimum": 0,
            "maximum": 1
          },
          "weirdness_constraint": {
            "type": "number",
            "description": "Audio creativity (weirdness) weight, range: 0.00–1.00.",
            "example": 0.5,
            "minimum": 0,
            "maximum": 1
          },
          "audio_weight": {
            "type": "number",
            "description": "Audio weight, range: 0.00–1.00.",
            "example": 0.5,
            "minimum": 0,
            "maximum": 1
          },
          "duration": {
            "type": "integer",
            "description": "Audio duration, in seconds. Valid range: 10 <= x <= 360.",
            "example": 120,
            "minimum": 10,
            "maximum": 360
          },
          "auto_lyrics": {
            "type": "boolean",
            "default": false,
            "description": "Whether to automatically generate lyrics.\n\n- **true**: The input lyrics will be creatively rewritten\n- **false**: Use the provided lyrics directly to generate the music"
          },
          "vocal_gender": {
            "type": "string",
            "description": "Vocal gender.\n\n- Male: Male voice\n\n- Female: Female voice",
            "enum": [
              "Male",
              "Female"
            ]
          },
          "persona_id": {
            "type": "string",
            "description": "Music style ID."
          },
          "variety": {
            "type": "string",
            "default": "normal",
            "enum": [
              "off",
              "normal",
              "high",
              "extra",
              "max"
            ],
            "description": "Style variety. Controls how much the generated result varies from the specified style.\n\n- **off**: Exact style\n- **normal**: Balanced variety\n- **high**: Distinct styles\n- **extra**: Bold exploration\n- **max**: Unreasonably varied"
          },
          "max_mode": {
            "type": "boolean",
            "default": false,
            "description": "Whether to use more compute to maximize consistency throughout the song.\n\n- **false**: No (default)\n- **true**: Yes. Credit consumption is doubled when enabled"
          },
          "audio_format": {
            "type": "string",
            "enum": [
              "mp3",
              "m4a",
              "wav"
            ],
            "example": "mp3",
            "description": "Audio format of `audioUrl` after the job succeeds."
          },
          "hookUrl": {
            "type": "string",
            "description": "Callback notification URL"
          },
          "music_id": {
            "type": "string",
            "description": "Audio ID of the track to extend.",
            "minLength": 1
          },
          "continue_at": {
            "type": "number",
            "example": 10,
            "description": "Timestamp, in seconds, where the audio extension should begin.",
            "minimum": 0
          },
          "isStorage": {
            "type": "boolean",
            "default": true,
            "deprecated": true,
            "description": "Whether to store the generated audio.\n\n- **true**: The audio will be stored and a TTAPI CDN URL will be returned\n- **false**: The original source URL will be returned"
          }
        },
        "required": [
          "music_id",
          "continue_at"
        ],
        "additionalProperties": false
      },
      "example": {
        "music_id": "REPLACE_WITH_COMPLETED_SUNO_MUSIC_ID",
        "continue_at": 20,
        "tags": "gentle acoustic guitar",
        "duration": 30
      },
      "docs": [
        "https://docs.ttapi.io/api/en/suno/suno_extend",
        "https://docs.ttapi.io/openapi/en/suno.json"
      ],
      "assetPaths": [
        "data.musics.*.audioUrl"
      ],
      "poll": {
        "method": "GET",
        "path": "/suno/v2/fetch",
        "idParam": "jobId",
        "location": "query"
      }
    },
    "suno-cover": {
      "family": "suno",
      "description": "Create a cover of an existing Suno track; music_id is a track ID, not a jobId.",
      "method": "POST",
      "path": "/suno/v1/cover",
      "bodyType": "json",
      "schema": {
        "oneOf": [
          {
            "type": "object",
            "properties": {
              "custom": {
                "type": "boolean",
                "default": true,
                "enum": [
                  true
                ],
                "description": "Custom mode. Fixed to true."
              },
              "mv": {
                "type": "string",
                "description": "Model to use. Available values: `chirp-v6`, `chirp-v6-wild`, `chirp-v6-mini`. Suno legacy models have all been discontinued; passing a legacy name maps it to `chirp-v6`. See [Model Mapping](/api/en/suno#model-mapping). After creating a custom model, you can also pass `chirp-custom:{model_id}`. See [Create Model](/api/en/suno/suno_create_model). `persona_id` and `chirp-custom` cannot be used together.",
                "anyOf": [
                  {
                    "enum": [
                      "chirp-v6",
                      "chirp-v6-wild",
                      "chirp-v6-mini"
                    ]
                  },
                  {
                    "pattern": "^chirp-custom:.+$"
                  }
                ]
              },
              "music_id": {
                "type": "string",
                "description": "Audio ID of the track to cover.",
                "minLength": 1
              },
              "prompt": {
                "type": "string",
                "description": "Lyrics. An empty value is treated as instrumental; a non-empty value generates a vocal cover.",
                "maxLength": 5000
              },
              "title": {
                "type": "string",
                "description": "Music title. Maximum length: 80 characters.",
                "maxLength": 80
              },
              "tags": {
                "type": "string",
                "description": "Music style or genre. Maximum length: 1000 characters.",
                "example": "rock, blues, hip-hop, r&b",
                "maxLength": 1000
              },
              "negative_tags": {
                "type": "string",
                "description": "Music styles or genres that should be excluded from generation."
              },
              "style_weight": {
                "type": "number",
                "description": "Music style weight, range: 0.00–1.00.",
                "example": 0.5,
                "minimum": 0,
                "maximum": 1
              },
              "weirdness_constraint": {
                "type": "number",
                "description": "Audio creativity (weirdness) weight, range: 0.00–1.00.",
                "example": 0.5,
                "minimum": 0,
                "maximum": 1
              },
              "audio_weight": {
                "type": "number",
                "description": "Audio weight, range: 0.00–1.00.",
                "example": 0.5,
                "minimum": 0,
                "maximum": 1
              },
              "vocal_gender": {
                "type": "string",
                "description": "Vocal gender.\n\n- Male: Male voice\n\n- Female: Female voice",
                "enum": [
                  "Male",
                  "Female"
                ]
              },
              "duration": {
                "type": "integer",
                "description": "Audio duration, in seconds. Valid range: 10 <= x <= 360.",
                "example": 120
              },
              "persona_id": {
                "type": "string",
                "description": "Music style ID.\n\nCannot be used together with `mv=chirp-custom:{model_id}`."
              },
              "variety": {
                "type": "string",
                "default": "normal",
                "enum": [
                  "off",
                  "normal",
                  "high",
                  "extra",
                  "max"
                ],
                "description": "Style variety. Controls how much the generated result varies from the specified style.\n\n- **off**: Exact style\n- **normal**: Balanced variety\n- **high**: Distinct styles\n- **extra**: Bold exploration\n- **max**: Unreasonably varied"
              },
              "max_mode": {
                "type": "boolean",
                "default": false,
                "description": "Whether to use more compute to maximize consistency throughout the song.\n\n- **false**: No (default)\n- **true**: Yes. Credit consumption is doubled when enabled"
              },
              "audio_format": {
                "type": "string",
                "enum": [
                  "mp3",
                  "m4a",
                  "wav"
                ],
                "example": "mp3",
                "description": "Audio format of `audioUrl` after the job succeeds."
              },
              "hookUrl": {
                "type": "string",
                "description": "Callback notification URL"
              },
              "isStorage": {
                "type": "boolean",
                "default": true,
                "deprecated": true,
                "description": "Whether to store the generated audio.\n\n- **true**: The audio will be stored and a TTAPI CDN URL will be returned\n- **false**: The original source URL will be returned"
              }
            },
            "required": [
              "custom",
              "music_id",
              "mv"
            ],
            "additionalProperties": false
          },
          {
            "type": "object",
            "properties": {
              "custom": {
                "type": "boolean",
                "default": false,
                "enum": [
                  false
                ],
                "description": "Inspiration mode. Fixed to false."
              },
              "mv": {
                "type": "string",
                "description": "Model to use. Available values: `chirp-v6`, `chirp-v6-wild`, `chirp-v6-mini`. Suno legacy models have all been discontinued; passing a legacy name maps it to `chirp-v6`. See [Model Mapping](/api/en/suno#model-mapping). After creating a custom model, you can also pass `chirp-custom:{model_id}`. See [Create Model](/api/en/suno/suno_create_model). `persona_id` and `chirp-custom` cannot be used together.",
                "anyOf": [
                  {
                    "enum": [
                      "chirp-v6",
                      "chirp-v6-wild",
                      "chirp-v6-mini"
                    ]
                  },
                  {
                    "pattern": "^chirp-custom:.+$"
                  }
                ]
              },
              "music_id": {
                "type": "string",
                "description": "music_id of the original track to cover.",
                "minLength": 1
              },
              "gpt_description_prompt": {
                "type": "string",
                "description": "Inspiration mode prompt, up to 3000 characters.",
                "example": "Night city lo-fi piano with rain ambience, soft vocal phrases, theme: \"Under the city lights\"",
                "maxLength": 3000
              },
              "persona_id": {
                "type": "string",
                "description": "Music style ID.\n\nCannot be used together with `mv=chirp-custom:{model_id}`."
              },
              "variety": {
                "type": "string",
                "default": "normal",
                "enum": [
                  "off",
                  "normal",
                  "high",
                  "extra",
                  "max"
                ],
                "description": "Style variety. Controls how much the generated result varies from the specified style.\n\n- **off**: Exact style\n- **normal**: Balanced variety\n- **high**: Distinct styles\n- **extra**: Bold exploration\n- **max**: Unreasonably varied"
              },
              "audio_format": {
                "type": "string",
                "enum": [
                  "mp3",
                  "m4a",
                  "wav"
                ],
                "example": "mp3",
                "description": "Audio format of `audioUrl` after the job succeeds."
              },
              "hookUrl": {
                "type": "string",
                "description": "Callback notification URL"
              },
              "isStorage": {
                "type": "boolean",
                "default": true,
                "deprecated": true,
                "description": "Whether to store the generated audio.\n\n- **true**: The audio will be stored and a TTAPI CDN URL will be returned\n- **false**: The original source URL will be returned"
              }
            },
            "required": [
              "custom",
              "music_id",
              "mv"
            ],
            "additionalProperties": false
          }
        ]
      },
      "example": {
        "custom": true,
        "mv": "chirp-v6",
        "music_id": "REPLACE_WITH_COMPLETED_SUNO_MUSIC_ID",
        "prompt": "",
        "tags": "mellow jazz piano",
        "title": "Jazz Morning"
      },
      "docs": [
        "https://docs.ttapi.io/api/en/suno/suno_cover",
        "https://docs.ttapi.io/openapi/en/suno.json"
      ],
      "assetPaths": [
        "data.musics.*.audioUrl"
      ],
      "poll": {
        "method": "GET",
        "path": "/suno/v2/fetch",
        "idParam": "jobId",
        "location": "query"
      }
    },
    "suno-stems": {
      "family": "suno",
      "description": "Extract one supported stem from an existing Suno track.",
      "method": "POST",
      "path": "/suno/v1/stems",
      "bodyType": "json",
      "schema": {
        "type": "object",
        "properties": {
          "audio_format": {
            "type": "string",
            "enum": [
              "mp3",
              "m4a",
              "wav"
            ],
            "example": "mp3",
            "description": "Audio format of `audioUrl` after the job succeeds."
          },
          "hookUrl": {
            "type": "string",
            "description": "Callback notification URL"
          },
          "music_id": {
            "type": "string",
            "description": "Audio ID of the track to split.",
            "minLength": 1
          },
          "stem_type": {
            "type": "string",
            "description": "Stem type to extract. Defaults to lead_vocal. Use lead_vocal for vocal separation, or pass another supported stem code such as bass, piano, drum_kit, electric_guitar, and more.",
            "default": "lead_vocal",
            "enum": [
              "lead_vocal",
              "drum_kit",
              "bass",
              "backing_vocals",
              "piano",
              "electric_guitar",
              "percussion",
              "string_section",
              "synth",
              "acoustic_guitar",
              "sound_effects",
              "synth_pad",
              "synth_bass",
              "guitar",
              "brass_section",
              "organ",
              "electronic_drum_kit",
              "lead_electric_guitar",
              "synth_keys",
              "rhythm_electric_guitar",
              "electric_piano",
              "upright_bass",
              "keyboards",
              "distorted_electric_guitar",
              "kick",
              "snare",
              "risers",
              "synth_strings",
              "synth_lead",
              "woodwinds",
              "flute",
              "harp",
              "tambourine",
              "trumpet",
              "arpeggiator",
              "accordion",
              "fiddle",
              "pedal_steel_guitar",
              "synth_voice",
              "violin",
              "digital_piano",
              "synth_brass",
              "mandolin",
              "choir",
              "banjo",
              "bells",
              "clarinet",
              "tenor_saxophone",
              "trombone",
              "shaker",
              "french_horn",
              "glockenspiel",
              "electric_bass",
              "cello",
              "timpani",
              "harmonica",
              "marimba",
              "vibraphone",
              "lap_steel_guitar",
              "saxophone",
              "orchestra",
              "horns",
              "cymbals",
              "hand_clap",
              "oboe",
              "celesta",
              "congas",
              "drone",
              "alto_saxophone",
              "double_bass",
              "ukulele",
              "harpsichord",
              "baritone_saxophone",
              "xylophone",
              "tuba",
              "bass_guitar",
              "whistle",
              "lead_guitar",
              "rhodes",
              "808",
              "bongos",
              "bassoon",
              "cowbell",
              "viola",
              "sitar",
              "steel_drums",
              "piccolo",
              "theremin",
              "bagpipes",
              "hi_hat",
              "music_box",
              "melodica",
              "tabla",
              "koto",
              "djembe",
              "taiko",
              "didgeridoo"
            ]
          },
          "isStorage": {
            "type": "boolean",
            "default": true,
            "deprecated": true,
            "description": "Whether to store the generated audio.\n\n- **true**: The audio will be stored and a TTAPI CDN URL will be returned\n- **false**: The original source URL will be returned"
          }
        },
        "required": [
          "music_id"
        ],
        "additionalProperties": false
      },
      "example": {
        "music_id": "REPLACE_WITH_COMPLETED_SUNO_MUSIC_ID",
        "stem_type": "lead_vocal",
        "audio_format": "mp3"
      },
      "docs": [
        "https://docs.ttapi.io/api/en/suno/suno_stems",
        "https://docs.ttapi.io/openapi/en/suno.json"
      ],
      "assetPaths": [
        "data.musics.*.audioUrl"
      ],
      "poll": {
        "method": "GET",
        "path": "/suno/v2/fetch",
        "idParam": "jobId",
        "location": "query"
      }
    },
    "suno-stems-all": {
      "family": "suno",
      "description": "Split an existing Suno track into all stems.",
      "method": "POST",
      "path": "/suno/v1/stems-all",
      "bodyType": "json",
      "schema": {
        "type": "object",
        "properties": {
          "audio_format": {
            "type": "string",
            "enum": [
              "mp3",
              "m4a",
              "wav"
            ],
            "example": "mp3",
            "description": "Audio format of `audioUrl` after the job succeeds."
          },
          "hookUrl": {
            "type": "string",
            "description": "Callback notification URL"
          },
          "music_id": {
            "type": "string",
            "description": "Audio ID of the track to split.",
            "minLength": 1
          },
          "isStorage": {
            "type": "boolean",
            "default": true,
            "deprecated": true,
            "description": "Whether to store the generated audio.\n\n- **true**: The audio will be stored and a TTAPI CDN URL will be returned\n- **false**: The original source URL will be returned"
          }
        },
        "required": [
          "music_id"
        ],
        "additionalProperties": false
      },
      "example": {
        "music_id": "REPLACE_WITH_COMPLETED_SUNO_MUSIC_ID",
        "audio_format": "mp3"
      },
      "docs": [
        "https://docs.ttapi.io/api/en/suno/suno_stems_all",
        "https://docs.ttapi.io/openapi/en/suno.json"
      ],
      "assetPaths": [
        "data.musics.*.audioUrl"
      ],
      "poll": {
        "method": "GET",
        "path": "/suno/v2/fetch",
        "idParam": "jobId",
        "location": "query"
      }
    },
    "flowmusic-generate": {
      "family": "flowmusic",
      "description": "Generate one music clip from a sound prompt, lyrics, or both; asynchronous.",
      "method": "POST",
      "path": "/flowmusic/v1/generations",
      "bodyType": "json",
      "schema": {
        "type": "object",
        "properties": {
          "title": {
            "type": "string",
            "description": "Music generation title"
          },
          "model": {
            "type": "string",
            "description": "Music model name, supports Lyria 3 Pro and Lyria 3.5; defaults to Lyria 3 Pro when empty",
            "default": "Lyria 3 Pro",
            "enum": [
              "Lyria 3 Pro",
              "Lyria 3.5"
            ]
          },
          "sound_prompt": {
            "type": "string",
            "description": "Music style or sound description prompt; cannot be empty together with lyrics"
          },
          "lyrics": {
            "type": "string",
            "description": "Lyrics text; cannot be empty together with sound_prompt"
          },
          "seed": {
            "type": "string",
            "description": "Random seed"
          },
          "bpm": {
            "type": "string",
            "description": "BPM, must be greater than or equal to 1"
          },
          "length": {
            "type": "integer",
            "description": "Generated music duration in seconds; can be empty, range 1 to 240",
            "minimum": 1,
            "maximum": 240
          },
          "hook_url": {
            "type": "string",
            "description": "Business callback URL after task completion; no callback push when empty"
          }
        },
        "required": [],
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
              "lyrics"
            ],
            "properties": {
              "lyrics": {
                "minLength": 1
              }
            }
          }
        ]
      },
      "example": {
        "model": "Lyria 3 Pro",
        "title": "Cafe Morning",
        "sound_prompt": "Gentle jazz instrumental for a cafe, warm piano, soft brushes, no vocals",
        "length": 30
      },
      "docs": [
        "https://docs.ttapi.io/api/en/flowmuisc/flowmuisc_generate",
        "https://docs.ttapi.io/openapi/en/flowmuisc.json"
      ],
      "assetPaths": [
        "data.clips.*.audio_url",
        "data.clips.*.wav_url"
      ],
      "poll": {
        "method": "GET",
        "path": "/flowmusic/v1/fetch",
        "idParam": "jobId",
        "location": "query"
      }
    },
    "flowmusic-lyrics": {
      "family": "flowmusic",
      "description": "Generate lyrics from a prompt; synchronous response includes data.title and data.lyrics.",
      "method": "POST",
      "path": "/flowmusic/v1/lyrics-create",
      "bodyType": "json",
      "schema": {
        "type": "object",
        "properties": {
          "prompt": {
            "type": "string",
            "description": "Prompt, <= 3000 characters",
            "minLength": 1,
            "maxLength": 3000
          },
          "hook_url": {
            "type": "string",
            "description": "Business callback URL after task completion; no callback push when empty"
          }
        },
        "required": [
          "prompt"
        ],
        "additionalProperties": false
      },
      "example": {
        "prompt": "A hopeful pop song about starting again"
      },
      "docs": [
        "https://docs.ttapi.io/api/en/flowmuisc/flowmuisc_lyricscreate",
        "https://docs.ttapi.io/openapi/en/flowmuisc.json"
      ],
      "assetPaths": []
    },
    "flowmusic-cover": {
      "family": "flowmusic",
      "description": "Create a new version of a completed FlowMusic clip.",
      "method": "POST",
      "path": "/flowmusic/v1/cover",
      "bodyType": "json",
      "schema": {
        "type": "object",
        "properties": {
          "clip_id": {
            "type": "string",
            "description": "Source music clip_id.",
            "example": "abc123-def456",
            "minLength": 1
          },
          "model": {
            "type": "string",
            "description": "Music model name; supports Lyria 3 Pro and Lyria 3.5; defaults to Lyria 3 Pro when empty.",
            "default": "Lyria 3 Pro",
            "enum": [
              "Lyria 3 Pro",
              "Lyria 3.5"
            ]
          },
          "instruction": {
            "type": "string",
            "description": "Cover editing instruction.",
            "example": "Change this song to jazz style",
            "minLength": 1
          },
          "strength": {
            "type": "number",
            "description": "Cover strength, range 0 to 1.",
            "default": 0.5,
            "minimum": 0,
            "maximum": 1
          },
          "title": {
            "type": "string",
            "description": "Music title after Cover."
          },
          "seed": {
            "type": "string",
            "description": "Random seed; used to reproduce or control generation results."
          },
          "hook_url": {
            "type": "string",
            "description": "Business callback URL after task completion; no callback push when empty."
          }
        },
        "required": [
          "clip_id",
          "instruction",
          "strength"
        ],
        "example": {
          "clip_id": "string",
          "model": "string",
          "instruction": "string",
          "strength": 0,
          "title": "string",
          "seed": "string",
          "hook_url": "string"
        },
        "additionalProperties": false
      },
      "example": {
        "clip_id": "REPLACE_WITH_COMPLETED_FLOWMUSIC_CLIP_ID",
        "model": "Lyria 3 Pro",
        "instruction": "Change this song to a mellow jazz style",
        "strength": 0.5
      },
      "docs": [
        "https://docs.ttapi.io/api/en/flowmuisc",
        "https://docs.ttapi.io/openapi/en/flowmuisc.json"
      ],
      "assetPaths": [
        "data.clips.*.audio_url",
        "data.clips.*.wav_url"
      ],
      "poll": {
        "method": "GET",
        "path": "/flowmusic/v1/fetch",
        "idParam": "jobId",
        "location": "query"
      }
    },
    "flowmusic-extend": {
      "family": "flowmusic",
      "description": "Extend a completed FlowMusic clip; extend_s is at most 164 seconds.",
      "method": "POST",
      "path": "/flowmusic/v1/extend",
      "bodyType": "json",
      "schema": {
        "type": "object",
        "properties": {
          "clip_id": {
            "type": "string",
            "description": "Source music clip_id",
            "minLength": 1
          },
          "model": {
            "type": "string",
            "description": "Music model name, supports Lyria 3 Pro and Lyria 3.5; defaults to Lyria 3 Pro when empty",
            "default": "Lyria 3 Pro",
            "enum": [
              "Lyria 3 Pro",
              "Lyria 3.5"
            ]
          },
          "extend_from_s": {
            "type": "number",
            "description": "From which time point to extend the source clip, in seconds; cannot exceed source clip duration.",
            "minimum": 0
          },
          "extend_s": {
            "type": "number",
            "description": "Extension duration in seconds; maximum 164 seconds.",
            "maximum": 164,
            "exclusiveMinimum": 0
          },
          "instruction": {
            "type": "string",
            "description": "Edit instruction for extending music.",
            "minLength": 1
          },
          "title": {
            "type": "string",
            "description": "Title after extension."
          },
          "seed": {
            "type": "string",
            "description": "Random seed; used to reproduce or control generation results."
          },
          "hook_url": {
            "type": "string",
            "description": "Business callback URL after task completion; no callback push when empty"
          }
        },
        "required": [
          "clip_id",
          "extend_from_s",
          "extend_s",
          "instruction"
        ],
        "additionalProperties": false
      },
      "example": {
        "clip_id": "REPLACE_WITH_COMPLETED_FLOWMUSIC_CLIP_ID",
        "model": "Lyria 3 Pro",
        "extend_from_s": 20,
        "extend_s": 30,
        "instruction": "Continue the warm piano melody"
      },
      "docs": [
        "https://docs.ttapi.io/api/en/flowmuisc/flowmuisc_extend",
        "https://docs.ttapi.io/openapi/en/flowmuisc.json"
      ],
      "assetPaths": [
        "data.clips.*.audio_url",
        "data.clips.*.wav_url"
      ],
      "poll": {
        "method": "GET",
        "path": "/flowmusic/v1/fetch",
        "idParam": "jobId",
        "location": "query"
      }
    },
    "flowmusic-stems": {
      "family": "flowmusic",
      "description": "Separate stems from a completed FlowMusic clip.",
      "method": "POST",
      "path": "/flowmusic/v1/stems",
      "bodyType": "json",
      "schema": {
        "type": "object",
        "properties": {
          "clip_id": {
            "type": "string",
            "description": "Music clip_id for stem separation.",
            "minLength": 1
          },
          "hook_url": {
            "type": "string",
            "description": "Business callback URL after task completion; no callback push when empty"
          }
        },
        "required": [
          "clip_id"
        ],
        "additionalProperties": false
      },
      "example": {
        "clip_id": "REPLACE_WITH_COMPLETED_FLOWMUSIC_CLIP_ID"
      },
      "docs": [
        "https://docs.ttapi.io/api/en/flowmuisc/flowmuisc_stems",
        "https://docs.ttapi.io/openapi/en/flowmuisc.json"
      ],
      "assetPaths": [
        "data.clips.*.audio_url",
        "data.clips.*.wav_url"
      ],
      "poll": {
        "method": "GET",
        "path": "/flowmusic/v1/fetch",
        "idParam": "jobId",
        "location": "query"
      }
    },
    "flowmusic-upload": {
      "family": "flowmusic",
      "description": "Import an audio file from a publicly reachable audio_url; not multipart.",
      "method": "POST",
      "path": "/flowmusic/v1/upload-audio",
      "bodyType": "json",
      "schema": {
        "type": "object",
        "properties": {
          "audio_url": {
            "type": "string",
            "description": "Audio file URL to upload, only supports common audio file extensions"
          },
          "hook_url": {
            "type": "string",
            "description": "Business callback URL after task completion; no callback push when empty"
          }
        },
        "required": [
          "audio_url"
        ],
        "additionalProperties": false
      },
      "example": {
        "audio_url": "https://example.com/your-audio.mp3"
      },
      "docs": [
        "https://docs.ttapi.io/api/en/flowmuisc/flowmuisc_uploadaudio",
        "https://docs.ttapi.io/openapi/en/flowmuisc.json"
      ],
      "assetPaths": [],
      "poll": {
        "method": "GET",
        "path": "/flowmusic/v1/fetch",
        "idParam": "jobId",
        "location": "query"
      }
    },
    "flowmusic-download": {
      "family": "flowmusic",
      "description": "Request an existing FlowMusic clip in mp3 or wav format; asynchronous.",
      "method": "POST",
      "path": "/flowmusic/v1/download-audio",
      "bodyType": "json",
      "schema": {
        "type": "object",
        "properties": {
          "clip_id": {
            "type": "string",
            "description": "Music clip_id to download.",
            "minLength": 1
          },
          "format": {
            "type": "string",
            "enum": [
              "wav",
              "mp3"
            ],
            "default": "mp3",
            "description": "Download audio format; defaults to mp3 when empty"
          },
          "hook_url": {
            "type": "string",
            "description": "Business callback URL after task completion; no callback push when empty"
          }
        },
        "required": [
          "clip_id",
          "format"
        ],
        "additionalProperties": false
      },
      "example": {
        "clip_id": "REPLACE_WITH_COMPLETED_FLOWMUSIC_CLIP_ID",
        "format": "wav"
      },
      "docs": [
        "https://docs.ttapi.io/api/en/flowmuisc/flowmuisc_download",
        "https://docs.ttapi.io/openapi/en/flowmuisc.json"
      ],
      "assetPaths": [
        "data.clips.*.audio_url",
        "data.clips.*.wav_url"
      ],
      "poll": {
        "method": "GET",
        "path": "/flowmusic/v1/fetch",
        "idParam": "jobId",
        "location": "query"
      }
    }
  }
};

// Cross-field constraints stated in the official endpoint descriptions.
// Lyrics usually return inline, but the documented queue statuses use the same
// family fetch endpoint. Retain the original operation when resuming such a job.
sourceCatalog.operations['flowmusic-lyrics'].poll = { ...sourceCatalog.operations['flowmusic-generate'].poll };
for (const name of ['suno-generate', 'suno-cover']) {
  sourceCatalog.operations[name].validate = (input) => {
    const errors = [];
    if (input.mv?.startsWith('chirp-custom:') && input.persona_id) errors.push('persona_id cannot be used with a chirp-custom model.');
    if (input.custom === false && name === 'suno-generate' && !input.gpt_description_prompt?.trim() && !input.reference_music_ids?.length) errors.push('Inspiration mode needs gpt_description_prompt or reference_music_ids.');
    return errors;
  };
}
sourceCatalog.operations['flowmusic-generate'].validate = (input) => {
  const errors = [];
  if (!input.sound_prompt?.trim() && !input.lyrics?.trim()) errors.push('Provide a non-empty sound_prompt or lyrics.');
  if (input.bpm !== undefined && (!Number.isFinite(Number(input.bpm)) || Number(input.bpm) < 1)) errors.push('bpm must be a numeric string greater than or equal to 1.');
  return errors;
};

// Independent product bundle; no imports from sibling Skills.
export const catalog={...sourceCatalog,skill:"ttapi-flowmusic",title:"TTAPI FlowMusic",operations:Object.fromEntries(Object.entries(sourceCatalog.operations).filter(([id])=>["flowmusic-generate","flowmusic-lyrics","flowmusic-cover","flowmusic-extend","flowmusic-stems","flowmusic-upload","flowmusic-download"].includes(id)))};
