/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/dlms_contract.json`.
 */
export type DlmsContract = {
  "address": "D3EyaiLex4rCbjeiag5de5YSHmqqzL6H1DmLEsvMy4yG",
  "metadata": {
    "name": "dlmsContract",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "addAdmin",
      "discriminator": [
        177,
        236,
        33,
        205,
        124,
        152,
        55,
        186
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  83,
                  121,
                  115,
                  116,
                  101,
                  109
                ]
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "newAdmin",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "applyToProject",
      "discriminator": [
        238,
        235,
        217,
        164,
        133,
        8,
        211,
        60
      ],
      "accounts": [
        {
          "name": "labourAccount",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  85,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "authority"
              }
            ]
          }
        },
        {
          "name": "project",
          "writable": true
        },
        {
          "name": "application",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  65,
                  112,
                  112,
                  108,
                  105,
                  99,
                  97,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "labourAccount"
              },
              {
                "kind": "account",
                "path": "project"
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "description",
          "type": "string"
        }
      ]
    },
    {
      "name": "approveApplication",
      "discriminator": [
        136,
        47,
        9,
        33,
        208,
        120,
        226,
        157
      ],
      "accounts": [
        {
          "name": "application",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  65,
                  112,
                  112,
                  108,
                  105,
                  99,
                  97,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "labourAccount"
              },
              {
                "kind": "account",
                "path": "project"
              }
            ]
          }
        },
        {
          "name": "labourAccount"
        },
        {
          "name": "project",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  80,
                  114,
                  111,
                  106,
                  101,
                  99,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "managerAccount"
              },
              {
                "kind": "account",
                "path": "project.index",
                "account": "project"
              }
            ]
          }
        },
        {
          "name": "managerAccount",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  85,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "authority"
              }
            ]
          }
        },
        {
          "name": "assignment",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  65,
                  115,
                  115,
                  105,
                  103,
                  110,
                  109,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "labourAccount"
              },
              {
                "kind": "account",
                "path": "project"
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "approveWorkDay",
      "discriminator": [
        27,
        247,
        154,
        68,
        148,
        68,
        107,
        227
      ],
      "accounts": [
        {
          "name": "managerAccount",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  85,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "authority"
              }
            ]
          }
        },
        {
          "name": "project",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  80,
                  114,
                  111,
                  106,
                  101,
                  99,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "managerAccount"
              },
              {
                "kind": "account",
                "path": "project.index",
                "account": "project"
              }
            ]
          }
        },
        {
          "name": "labourAccount"
        },
        {
          "name": "assignment",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  65,
                  115,
                  115,
                  105,
                  103,
                  110,
                  109,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "labourAccount"
              },
              {
                "kind": "account",
                "path": "project"
              }
            ]
          }
        },
        {
          "name": "workVerification",
          "writable": true
        },
        {
          "name": "escrowAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  69,
                  115,
                  99,
                  114,
                  111,
                  119
                ]
              },
              {
                "kind": "account",
                "path": "project"
              }
            ]
          }
        },
        {
          "name": "labourTokenAccount",
          "writable": true
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "closeProject",
      "discriminator": [
        117,
        209,
        53,
        106,
        93,
        55,
        112,
        49
      ],
      "accounts": [
        {
          "name": "managerAccount",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  85,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "authority"
              }
            ]
          }
        },
        {
          "name": "project",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  80,
                  114,
                  111,
                  106,
                  101,
                  99,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "managerAccount"
              },
              {
                "kind": "account",
                "path": "project.index",
                "account": "project"
              }
            ]
          }
        },
        {
          "name": "escrowAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  69,
                  115,
                  99,
                  114,
                  111,
                  119
                ]
              },
              {
                "kind": "account",
                "path": "project"
              }
            ]
          }
        },
        {
          "name": "managerTokenAccount",
          "writable": true
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
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
              "name": "projectStatus"
            }
          }
        }
      ]
    },
    {
      "name": "createProject",
      "discriminator": [
        148,
        219,
        181,
        42,
        221,
        114,
        145,
        190
      ],
      "accounts": [
        {
          "name": "systemState",
          "writable": true
        },
        {
          "name": "managerAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  85,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "authority"
              }
            ]
          }
        },
        {
          "name": "project",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  80,
                  114,
                  111,
                  106,
                  101,
                  99,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "managerAccount"
              },
              {
                "kind": "account",
                "path": "system_state.project_count",
                "account": "systemState"
              }
            ]
          }
        },
        {
          "name": "escrowAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  69,
                  115,
                  99,
                  114,
                  111,
                  119
                ]
              },
              {
                "kind": "account",
                "path": "project"
              }
            ]
          }
        },
        {
          "name": "managerTokenAccount",
          "writable": true
        },
        {
          "name": "mint"
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
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
          "name": "title",
          "type": "string"
        },
        {
          "name": "metadataUri",
          "type": "string"
        },
        {
          "name": "dailyRate",
          "type": "u64"
        },
        {
          "name": "durationDays",
          "type": "u16"
        },
        {
          "name": "maxLabourers",
          "type": "u8"
        }
      ]
    },
    {
      "name": "deleteUser",
      "discriminator": [
        186,
        85,
        17,
        249,
        219,
        231,
        98,
        251
      ],
      "accounts": [
        {
          "name": "systemState",
          "writable": true
        },
        {
          "name": "userAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  85,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "authority"
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        }
      ],
      "args": []
    },
    {
      "name": "initializeSystem",
      "discriminator": [
        50,
        173,
        248,
        140,
        202,
        35,
        141,
        150
      ],
      "accounts": [
        {
          "name": "systemState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  83,
                  121,
                  115,
                  116,
                  101,
                  109
                ]
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "mint",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "markUserAsSpam",
      "discriminator": [
        58,
        248,
        99,
        200,
        17,
        45,
        35,
        240
      ],
      "accounts": [
        {
          "name": "systemState",
          "writable": true
        },
        {
          "name": "userAccount",
          "writable": true
        },
        {
          "name": "authority",
          "signer": true,
          "relations": [
            "systemState"
          ]
        }
      ],
      "args": [
        {
          "name": "isSpam",
          "type": "bool"
        }
      ]
    },
    {
      "name": "mintToken",
      "discriminator": [
        172,
        137,
        183,
        14,
        207,
        110,
        234,
        56
      ],
      "accounts": [
        {
          "name": "systemState",
          "writable": true
        },
        {
          "name": "mint",
          "writable": true
        },
        {
          "name": "mintAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  105,
                  110,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "to",
          "writable": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "rateUser",
      "discriminator": [
        136,
        137,
        93,
        117,
        191,
        110,
        35,
        46
      ],
      "accounts": [
        {
          "name": "userAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  85,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "user_account.authority",
                "account": "userAccount"
              }
            ]
          }
        },
        {
          "name": "review",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  82,
                  101,
                  118,
                  105,
                  101,
                  119
                ]
              },
              {
                "kind": "account",
                "path": "authority"
              },
              {
                "kind": "account",
                "path": "userAccount"
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "rating",
          "type": "u8"
        },
        {
          "name": "context",
          "type": "string"
        }
      ]
    },
    {
      "name": "registerUser",
      "discriminator": [
        2,
        241,
        150,
        223,
        99,
        214,
        116,
        97
      ],
      "accounts": [
        {
          "name": "systemState",
          "writable": true
        },
        {
          "name": "userAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  85,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "authority"
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
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
          "name": "metadataUrl",
          "type": "string"
        },
        {
          "name": "role",
          "type": {
            "defined": {
              "name": "userRole"
            }
          }
        }
      ]
    },
    {
      "name": "removeAdmin",
      "discriminator": [
        74,
        202,
        71,
        106,
        252,
        31,
        72,
        183
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  83,
                  121,
                  115,
                  116,
                  101,
                  109
                ]
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "adminToRemove",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "updateUser",
      "discriminator": [
        9,
        2,
        160,
        169,
        118,
        12,
        207,
        84
      ],
      "accounts": [
        {
          "name": "userAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  85,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "authority"
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
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
          "name": "metadataUri",
          "type": "string"
        },
        {
          "name": "active",
          "type": {
            "option": "bool"
          }
        }
      ]
    },
    {
      "name": "verifyUser",
      "discriminator": [
        127,
        54,
        157,
        106,
        85,
        167,
        116,
        119
      ],
      "accounts": [
        {
          "name": "systemState",
          "writable": true
        },
        {
          "name": "userAccount",
          "writable": true
        },
        {
          "name": "authority",
          "signer": true
        }
      ],
      "args": []
    },
    {
      "name": "verifyWorkDay",
      "discriminator": [
        143,
        86,
        2,
        120,
        149,
        148,
        114,
        105
      ],
      "accounts": [
        {
          "name": "labourAccount",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  85,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "authority"
              }
            ]
          }
        },
        {
          "name": "project",
          "writable": true
        },
        {
          "name": "assignment",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  65,
                  115,
                  115,
                  105,
                  103,
                  110,
                  109,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "labourAccount"
              },
              {
                "kind": "account",
                "path": "project"
              }
            ]
          }
        },
        {
          "name": "workVerification",
          "writable": true
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "dayNumber",
          "type": "u16"
        },
        {
          "name": "workMetadataUri",
          "type": "string"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "application",
      "discriminator": [
        219,
        9,
        27,
        113,
        208,
        126,
        203,
        30
      ]
    },
    {
      "name": "assignment",
      "discriminator": [
        106,
        201,
        110,
        51,
        89,
        170,
        73,
        31
      ]
    },
    {
      "name": "project",
      "discriminator": [
        205,
        168,
        189,
        202,
        181,
        247,
        142,
        19
      ]
    },
    {
      "name": "review",
      "discriminator": [
        124,
        63,
        203,
        215,
        226,
        30,
        222,
        15
      ]
    },
    {
      "name": "systemState",
      "discriminator": [
        136,
        108,
        211,
        163,
        181,
        137,
        229,
        240
      ]
    },
    {
      "name": "userAccount",
      "discriminator": [
        211,
        33,
        136,
        16,
        186,
        110,
        242,
        127
      ]
    },
    {
      "name": "workVerification",
      "discriminator": [
        53,
        57,
        54,
        143,
        113,
        209,
        184,
        238
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "notAuthorized",
      "msg": "You are not authorized to perform this action"
    },
    {
      "code": 6001,
      "name": "adminAlreadyExists",
      "msg": "Admin already exists."
    },
    {
      "code": 6002,
      "name": "adminNotFound",
      "msg": "Admin not found."
    },
    {
      "code": 6003,
      "name": "adminLimitReached",
      "msg": "Cannot add more than 10 admins."
    },
    {
      "code": 6004,
      "name": "invalidRole",
      "msg": "Invalid role. Must be 'labour' or 'manager'."
    },
    {
      "code": 6005,
      "name": "invalidDailyRate",
      "msg": "Invalid daily rate"
    },
    {
      "code": 6006,
      "name": "invalidDuration",
      "msg": "Invalid duration"
    },
    {
      "code": 6007,
      "name": "invalidLabourerCount",
      "msg": "Invalid labourer count"
    },
    {
      "code": 6008,
      "name": "calculationError",
      "msg": "Calculation error"
    },
    {
      "code": 6009,
      "name": "insufficientFunds",
      "msg": "Insufficient funds"
    },
    {
      "code": 6010,
      "name": "wrongOwner",
      "msg": "Wrong token account owner"
    },
    {
      "code": 6011,
      "name": "projectNotOpen",
      "msg": "Project is not open"
    },
    {
      "code": 6012,
      "name": "projectFull",
      "msg": "Project is full"
    },
    {
      "code": 6013,
      "name": "labourNotActive",
      "msg": "Labour is not active"
    },
    {
      "code": 6014,
      "name": "applicationNotPending",
      "msg": "Application is not pending"
    },
    {
      "code": 6015,
      "name": "invalidProject",
      "msg": "Invalid project"
    },
    {
      "code": 6016,
      "name": "invalidDaySequence",
      "msg": "Working day not matching"
    },
    {
      "code": 6017,
      "name": "invalidLabour",
      "msg": "Invalid labour"
    },
    {
      "code": 6018,
      "name": "invalidManager",
      "msg": "Invalid manager"
    },
    {
      "code": 6019,
      "name": "wrongProjectStatus",
      "msg": "Wrong Project Status"
    },
    {
      "code": 6020,
      "name": "projectNotActive",
      "msg": "Project is not active"
    },
    {
      "code": 6021,
      "name": "projectStillActive",
      "msg": "Project is still active"
    },
    {
      "code": 6022,
      "name": "assignmentNotActive",
      "msg": "Assignment is not active"
    },
    {
      "code": 6023,
      "name": "invalidDayNumber",
      "msg": "Invalid day number"
    },
    {
      "code": 6024,
      "name": "alreadyVerified",
      "msg": "Work already verified"
    },
    {
      "code": 6025,
      "name": "invalidRating",
      "msg": "Invalid rating value (must be 1-5)"
    },
    {
      "code": 6026,
      "name": "invalidEscrowAccount",
      "msg": "Invalid escrow account"
    },
    {
      "code": 6027,
      "name": "invalidTokenMint",
      "msg": "Invalid token mint provided."
    },
    {
      "code": 6028,
      "name": "mintMismatch",
      "msg": "The mint account does not match the system's configured mint."
    }
  ],
  "types": [
    {
      "name": "application",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "labour",
            "type": "pubkey"
          },
          {
            "name": "project",
            "type": "pubkey"
          },
          {
            "name": "description",
            "type": "string"
          },
          {
            "name": "status",
            "type": {
              "defined": {
                "name": "applicationStatus"
              }
            }
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "applicationStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "pending"
          },
          {
            "name": "accepted"
          },
          {
            "name": "rejected"
          },
          {
            "name": "withdrawn"
          }
        ]
      }
    },
    {
      "name": "assignment",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "labour",
            "type": "pubkey"
          },
          {
            "name": "project",
            "type": "pubkey"
          },
          {
            "name": "daysWorked",
            "type": "u16"
          },
          {
            "name": "daysPaid",
            "type": "u16"
          },
          {
            "name": "active",
            "type": "bool"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "project",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "manager",
            "type": "pubkey"
          },
          {
            "name": "title",
            "type": "string"
          },
          {
            "name": "metadataUri",
            "type": "string"
          },
          {
            "name": "dailyRate",
            "type": "u64"
          },
          {
            "name": "durationDays",
            "type": "u16"
          },
          {
            "name": "maxLabourers",
            "type": "u8"
          },
          {
            "name": "labourCount",
            "type": "u8"
          },
          {
            "name": "status",
            "type": {
              "defined": {
                "name": "projectStatus"
              }
            }
          },
          {
            "name": "escrowAccount",
            "type": "pubkey"
          },
          {
            "name": "timestamp",
            "type": "i64"
          },
          {
            "name": "index",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "projectStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "open"
          },
          {
            "name": "inProgress"
          },
          {
            "name": "completed"
          },
          {
            "name": "cancelled"
          }
        ]
      }
    },
    {
      "name": "review",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "reviewer",
            "type": "pubkey"
          },
          {
            "name": "reviewee",
            "type": "pubkey"
          },
          {
            "name": "rating",
            "type": "u8"
          },
          {
            "name": "context",
            "type": "string"
          },
          {
            "name": "timestamp",
            "type": "i64"
          },
          {
            "name": "reviewType",
            "type": {
              "defined": {
                "name": "reviewType"
              }
            }
          }
        ]
      }
    },
    {
      "name": "reviewType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "labourReview"
          },
          {
            "name": "managerReview"
          }
        ]
      }
    },
    {
      "name": "systemState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "mint",
            "type": "pubkey"
          },
          {
            "name": "labourCount",
            "type": "u32"
          },
          {
            "name": "managerCount",
            "type": "u32"
          },
          {
            "name": "projectCount",
            "type": "u32"
          },
          {
            "name": "admins",
            "type": {
              "vec": "pubkey"
            }
          }
        ]
      }
    },
    {
      "name": "userAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "metadataUri",
            "type": "string"
          },
          {
            "name": "active",
            "type": "bool"
          },
          {
            "name": "verified",
            "type": "bool"
          },
          {
            "name": "rating",
            "type": "u32"
          },
          {
            "name": "ratingCount",
            "type": "u32"
          },
          {
            "name": "timestamp",
            "type": "i64"
          },
          {
            "name": "index",
            "type": "u32"
          },
          {
            "name": "role",
            "type": {
              "defined": {
                "name": "userRole"
              }
            }
          },
          {
            "name": "spam",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "userRole",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "labour"
          },
          {
            "name": "manager"
          }
        ]
      }
    },
    {
      "name": "workVerification",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "project",
            "type": "pubkey"
          },
          {
            "name": "labour",
            "type": "pubkey"
          },
          {
            "name": "dayNumber",
            "type": "u16"
          },
          {
            "name": "managerVerified",
            "type": "bool"
          },
          {
            "name": "labourVerified",
            "type": "bool"
          },
          {
            "name": "metadataUri",
            "type": "string"
          },
          {
            "name": "timestamp",
            "type": "i64"
          },
          {
            "name": "paymentProcessed",
            "type": "bool"
          }
        ]
      }
    }
  ]
};
