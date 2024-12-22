/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/ruma.json`.
 */
export type Ruma = {
  "address": "561nPDsZmmaEtQiRdW4eCaNBkHtbSh1gTLDsjhbLREUU",
  "metadata": {
    "name": "ruma",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "changeAttendeeStatus",
      "discriminator": [
        124,
        192,
        107,
        195,
        207,
        243,
        25,
        170
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true,
          "address": "RUMAAgFQxafzGWmfPhcBSL6AeGfw77gFZrSvDdkRUMk"
        },
        {
          "name": "user"
        },
        {
          "name": "event"
        },
        {
          "name": "attendee",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  116,
                  116,
                  101,
                  110,
                  100,
                  101,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "user"
              },
              {
                "kind": "account",
                "path": "event"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "status",
          "type": {
            "defined": {
              "name": "attendeeStatus"
            }
          }
        }
      ]
    },
    {
      "name": "checkIntoEvent",
      "discriminator": [
        174,
        115,
        38,
        67,
        105,
        235,
        193,
        133
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true,
          "address": "RUMAAgFQxafzGWmfPhcBSL6AeGfw77gFZrSvDdkRUMk"
        },
        {
          "name": "host",
          "signer": true
        },
        {
          "name": "organizer",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "host"
              }
            ]
          }
        },
        {
          "name": "registrant",
          "writable": true
        },
        {
          "name": "attendee"
        },
        {
          "name": "editionMint",
          "writable": true,
          "signer": true
        },
        {
          "name": "editionTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "registrant"
              },
              {
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "editionMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "editionMetadata",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  101,
                  116,
                  97,
                  100,
                  97,
                  116,
                  97
                ]
              },
              {
                "kind": "account",
                "path": "tokenMetadataProgram"
              },
              {
                "kind": "account",
                "path": "editionMint"
              }
            ],
            "program": {
              "kind": "account",
              "path": "tokenMetadataProgram"
            }
          }
        },
        {
          "name": "edition",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  101,
                  116,
                  97,
                  100,
                  97,
                  116,
                  97
                ]
              },
              {
                "kind": "account",
                "path": "tokenMetadataProgram"
              },
              {
                "kind": "account",
                "path": "editionMint"
              },
              {
                "kind": "const",
                "value": [
                  101,
                  100,
                  105,
                  116,
                  105,
                  111,
                  110
                ]
              }
            ],
            "program": {
              "kind": "account",
              "path": "tokenMetadataProgram"
            }
          }
        },
        {
          "name": "editionMarkerPda",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  101,
                  116,
                  97,
                  100,
                  97,
                  116,
                  97
                ]
              },
              {
                "kind": "account",
                "path": "tokenMetadataProgram"
              },
              {
                "kind": "account",
                "path": "masterMint"
              },
              {
                "kind": "const",
                "value": [
                  101,
                  100,
                  105,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "arg",
                "path": "edition_number.checked_div(EDITION_MARKER_BIT_SIZE)"
              }
            ],
            "program": {
              "kind": "account",
              "path": "tokenMetadataProgram"
            }
          }
        },
        {
          "name": "masterMint"
        },
        {
          "name": "masterTokenAccount"
        },
        {
          "name": "masterMetadata"
        },
        {
          "name": "masterEdition",
          "writable": true
        },
        {
          "name": "tokenMetadataProgram",
          "address": "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "sysvarInstructions",
          "address": "Sysvar1nstructions1111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "editionNumber",
          "type": "u64"
        }
      ]
    },
    {
      "name": "createBadge",
      "discriminator": [
        25,
        191,
        79,
        235,
        98,
        119,
        184,
        59
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "organizer",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "payer"
              }
            ]
          }
        },
        {
          "name": "event",
          "writable": true
        },
        {
          "name": "masterMint",
          "writable": true,
          "signer": true
        },
        {
          "name": "masterTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "organizer"
              },
              {
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "masterMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "masterMetadata",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  101,
                  116,
                  97,
                  100,
                  97,
                  116,
                  97
                ]
              },
              {
                "kind": "account",
                "path": "tokenMetadataProgram"
              },
              {
                "kind": "account",
                "path": "masterMint"
              }
            ],
            "program": {
              "kind": "account",
              "path": "tokenMetadataProgram"
            }
          }
        },
        {
          "name": "masterEdition",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  101,
                  116,
                  97,
                  100,
                  97,
                  116,
                  97
                ]
              },
              {
                "kind": "account",
                "path": "tokenMetadataProgram"
              },
              {
                "kind": "account",
                "path": "masterMint"
              },
              {
                "kind": "const",
                "value": [
                  101,
                  100,
                  105,
                  116,
                  105,
                  111,
                  110
                ]
              }
            ],
            "program": {
              "kind": "account",
              "path": "tokenMetadataProgram"
            }
          }
        },
        {
          "name": "tokenMetadataProgram",
          "address": "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "badgeName",
          "type": "string"
        },
        {
          "name": "badgeSymbol",
          "type": "string"
        },
        {
          "name": "badgeUri",
          "type": "string"
        },
        {
          "name": "maxSupply",
          "type": {
            "option": "u64"
          }
        }
      ]
    },
    {
      "name": "createEvent",
      "discriminator": [
        49,
        219,
        29,
        203,
        22,
        98,
        100,
        87
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "organizer",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "payer"
              }
            ]
          }
        },
        {
          "name": "event",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  118,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "organizer"
              },
              {
                "kind": "arg",
                "path": "name"
              }
            ]
          }
        },
        {
          "name": "eventData",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  100,
                  97,
                  116,
                  97
                ]
              },
              {
                "kind": "account",
                "path": "event"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "isPublic",
          "type": "bool"
        },
        {
          "name": "needsApproval",
          "type": "bool"
        },
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "image",
          "type": "string"
        },
        {
          "name": "capacity",
          "type": {
            "option": "i32"
          }
        },
        {
          "name": "startTimestamp",
          "type": {
            "option": "i64"
          }
        },
        {
          "name": "endTimestamp",
          "type": {
            "option": "i64"
          }
        },
        {
          "name": "location",
          "type": {
            "option": "string"
          }
        },
        {
          "name": "about",
          "type": {
            "option": "string"
          }
        }
      ]
    },
    {
      "name": "createProfile",
      "discriminator": [
        225,
        205,
        234,
        143,
        17,
        186,
        50,
        220
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "user",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "payer"
              }
            ]
          }
        },
        {
          "name": "userData",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114,
                  95,
                  100,
                  97,
                  116,
                  97
                ]
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "image",
          "type": "string"
        }
      ]
    },
    {
      "name": "registerForEvent",
      "discriminator": [
        9,
        43,
        142,
        151,
        8,
        125,
        154,
        139
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true,
          "address": "RUMAAgFQxafzGWmfPhcBSL6AeGfw77gFZrSvDdkRUMk"
        },
        {
          "name": "organizer"
        },
        {
          "name": "registrant"
        },
        {
          "name": "event",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  118,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "organizer"
              },
              {
                "kind": "arg",
                "path": "name"
              }
            ]
          }
        },
        {
          "name": "eventData",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  100,
                  97,
                  116,
                  97
                ]
              },
              {
                "kind": "account",
                "path": "event"
              }
            ]
          }
        },
        {
          "name": "attendee",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  116,
                  116,
                  101,
                  110,
                  100,
                  101,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "registrant"
              },
              {
                "kind": "account",
                "path": "event"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "attendee",
      "discriminator": [
        231,
        172,
        150,
        240,
        220,
        165,
        51,
        65
      ]
    },
    {
      "name": "event",
      "discriminator": [
        125,
        192,
        125,
        158,
        9,
        115,
        152,
        233
      ]
    },
    {
      "name": "eventData",
      "discriminator": [
        245,
        224,
        183,
        136,
        42,
        117,
        154,
        170
      ]
    },
    {
      "name": "user",
      "discriminator": [
        159,
        117,
        95,
        227,
        239,
        151,
        58,
        236
      ]
    },
    {
      "name": "userData",
      "discriminator": [
        139,
        248,
        167,
        203,
        253,
        220,
        210,
        221
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "userNameRequired",
      "msg": "User name is required"
    },
    {
      "code": 6001,
      "name": "userNameTooLong",
      "msg": "User name can not be longer than 32 characters"
    },
    {
      "code": 6002,
      "name": "userImageRequired",
      "msg": "User image is required"
    },
    {
      "code": 6003,
      "name": "userImageTooLong",
      "msg": "User image can not be longer than 200 characters"
    },
    {
      "code": 6004,
      "name": "eventNameRequired",
      "msg": "Event name is required"
    },
    {
      "code": 6005,
      "name": "eventNameTooLong",
      "msg": "Event name can not be longer than 128 characters"
    },
    {
      "code": 6006,
      "name": "eventImageRequired",
      "msg": "Image is required"
    },
    {
      "code": 6007,
      "name": "eventImageTooLong",
      "msg": "Image can not be longer than 200 characters"
    },
    {
      "code": 6008,
      "name": "badgeNameRequired",
      "msg": "Badge name is required"
    },
    {
      "code": 6009,
      "name": "badgeNameTooLong",
      "msg": "Badge name can not be longer than 32 characters"
    },
    {
      "code": 6010,
      "name": "badgeSymbolRequired",
      "msg": "Badge symbol is required"
    },
    {
      "code": 6011,
      "name": "badgeSymbolTooLong",
      "msg": "Badge symbol can not be longer than 10 characters"
    },
    {
      "code": 6012,
      "name": "badgeUriRequired",
      "msg": "Badge URI is required"
    },
    {
      "code": 6013,
      "name": "badgeUriTooLong",
      "msg": "Badge URI can not be longer than 200 characters"
    },
    {
      "code": 6014,
      "name": "unauthorizedMasterWallet",
      "msg": "Signer not authorized"
    },
    {
      "code": 6015,
      "name": "eventCapacityMaxReached",
      "msg": "Event capacity has reached maximum"
    },
    {
      "code": 6016,
      "name": "attendeeNotApproved",
      "msg": "Attendee is not approved for this event"
    }
  ],
  "types": [
    {
      "name": "attendee",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "status",
            "type": {
              "defined": {
                "name": "attendeeStatus"
              }
            }
          }
        ]
      }
    },
    {
      "name": "attendeeStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "pending"
          },
          {
            "name": "approved"
          },
          {
            "name": "rejected"
          }
        ]
      }
    },
    {
      "name": "event",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "data",
            "type": "pubkey"
          },
          {
            "name": "badge",
            "type": {
              "option": "pubkey"
            }
          },
          {
            "name": "attendees",
            "type": {
              "vec": "pubkey"
            }
          }
        ]
      }
    },
    {
      "name": "eventData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "isPublic",
            "type": "bool"
          },
          {
            "name": "needsApproval",
            "type": "bool"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "image",
            "type": "string"
          },
          {
            "name": "capacity",
            "type": {
              "option": "i32"
            }
          },
          {
            "name": "startTimestamp",
            "type": {
              "option": "i64"
            }
          },
          {
            "name": "endTimestamp",
            "type": {
              "option": "i64"
            }
          },
          {
            "name": "location",
            "type": {
              "option": "string"
            }
          },
          {
            "name": "about",
            "type": {
              "option": "string"
            }
          }
        ]
      }
    },
    {
      "name": "user",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "data",
            "type": "pubkey"
          },
          {
            "name": "badges",
            "type": {
              "vec": "pubkey"
            }
          }
        ]
      }
    },
    {
      "name": "userData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "image",
            "type": "string"
          }
        ]
      }
    }
  ],
  "constants": [
    {
      "name": "rumaWallet",
      "type": "pubkey",
      "value": "RUMAAgFQxafzGWmfPhcBSL6AeGfw77gFZrSvDdkRUMk"
    }
  ]
};
