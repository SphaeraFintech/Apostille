# Apostille

[![npm version](https://badge.fury.io/js/apostille.svg)](https://badge.fury.io/js/apostille)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

The official Apostille SDK, available for browsers, mobile applications, and NodeJS, to work
with Symbol blockchain (NEM2 / Catapult)

:warning: **This library is currently in development. Do not use in production.**

## Requirements

### NodeJS

- NodeJS 8.9.X
- NodeJS 9.X.X
- NodeJS 10.X.X

### Symbol-SDK

- Creating and sending transaction
- Signing and sending aggregate complete and bonded transactions

# Documentation

## Table of Contents
1. [Installation](#1---installation)
  - 1. [Installation in a project](#11---installation-in-a-project)
  - 2. [Build source](#12---build-source)
2. [Getting started](#2---getting-started)
  - 1. [Introduction](#21---introduction)
  - 2. [Create an history account](#22---create-an-history-account)
  - 3. [Create an Apostille](#23---create-an-apostille)
  - 4. [Send an Apostile](#24---send-an-apostille)
  - 5. [Update an Apostille](#25---update-an-apostille)
  - 6. [Verify an Apostille](#26---verify-an-apostille)
3. [To do](#3---to-do)
4. [License](#4---license)

---

## 1 - Installation

### 1.1 - Installation in a project

```bash
npm install apostille
```

#### Usage
```typescript
import { Class } from 'apostille';
```

### 1.2 - Build source

#### Install dependencies:

```bash
npm install
```

#### Build:

```bash
npm run build
```

#### Run tests:

```bash
npm run test
```

## 2 - Getting started

This implementation mostly follows the [NIP 4 - Apostille Improvement Protocol](https://github.com/nemtech/NIP/blob/master/NIPs/nip-0004.md), it presents some other improvements which will be discussed below.

### 2.1 - Introduction

The version 2 of Apostille introduces new powerfull features which drastically improve performances of the [version 1](https://nem.io/wp-content/themes/nem/files/ApostilleWhitePaper.pdf) and offers new possibilities. It is combining the feature sets of private and public apostille into one Apostille standard.

#### Metadata

In version 1, the core principle of Apostille was to store the hash of a given file in its own dedicated account or in a public sink.

In version 2, we use the new Metadata feature of Symbol to additionally store the latest file information into the dedicated account's metadata.

```
Metadata entries are stored on the blockchain like the message of a regular TransferTransaction but also as a key-value state.

This feature reduces the reading time of client applications; metadata allows information to be accessed by keys instead of processing the entire account transaction history off-chain to obtain the latest transaction message value.

Source: https://nemtech.github.io/concepts/metadata.html
```

The metadata keys in Apostille are:

- File name:

```
4e873e69f4ea29e7
```

```typescript
CryptoJS.SHA256("Apostille filename").toString(CryptoJS.enc.Hex).substring(0, 16);
```

- Apostille hash: 

```
4183f7a941a298f1
```

```typescript
CryptoJS.SHA256("Apostille hash").toString(CryptoJS.enc.Hex).substring(0, 16);
```

- Apostille tags: 

```
e6cdcfd9e70913c6
```

```typescript
CryptoJS.SHA256("Apostille tags").toString(CryptoJS.enc.Hex).substring(0, 16);
```

- Apostille description: 

```
74de2eda73ba52e4
```

```typescript
CryptoJS.SHA256("Apostille description").toString(CryptoJS.enc.Hex).substring(0, 16);
```

- Apostille url: 

```
8b72a3f2b61a22d0
```

```typescript
CryptoJS.SHA256("Apostille url").toString(CryptoJS.enc.Hex).substring(0, 16);
```

- History account: 

```
79dd11ad0264e430
```

```typescript
CryptoJS.SHA256("Apostille history").toString(CryptoJS.enc.Hex).substring(0, 16);
```

#### Hashing

Version 2 is only using SHA256 for file hashing.

The hash structure remains the same as version 1:

```typescript
0xFE 'N' 'T' 'Y' 0x83 + sign(SHA256(data))
```

```typescript
"FE4E545983" + sign(SHA256(data))
```

#### Dedicated account

Same as in version 1, a dedicated account is generated from the signed SHA256 of the file name; it is deterministic and unique for each file.

```typescript
sign(SHA256(filename)).substring(0, 64);
```

The dedicated account stores the file historical hashes in it's transactions and, in it's metadata, the file name, current file hash, tags, description and url.

#### History account

The history account is an account that indexes all files of an owner.

This account is stored into the owner account's metadata.

This way, we can easily get the whole historical data with all the files names and corresponding dedicated accounts with a couple queries to the chain, instead of saving and importing an `.nty` file like in version 1.

The history account must only records a file once, with file name and its dedicated account stored in transaction message as JSON:

```json
{
    "filename": "Jeff's favorite car.pdf",
    "account": "SAB4QRWIAGFFFMGOUIFDLDCNOOLPGINKTNG3ZLNM"
}
```

The history account is deterministic and generated from the following seed:

```typescript
"Apostille-history-of-" + <owner.address>
```

Seed is hashed using SHA256, signed with owner's private key and resulting signature is truncated to keep only 32 bytes as history account's private key.

See [ApostilleHistory.ts](src/ApostilleHistory.ts)

#### Illustration

![Flowchart](https://github.com/SphaeraFintech/Apostille/blob/master/src/images/apo8.png)

### 2.2 - Create an history account

To create the history account we use the `ApostilleHistory` class.

```typescript
import { ApostilleHistory } from 'apostille';
```

#### Method

```typescript
ApostilleHistory.create(<parameters>)
```

#### Parameters

**Name**       | **Type**         | **Description**           |
---------------|------------------|---------------------------|
`privateKey`   | string           | The owner private key     |
`network `     | NetworkType      | The network type          |

#### Return 

[Account](https://github.com/nemtech/symbol-sdk-typescript-javascript/blob/master/src/model/account/Account.ts)

#### Example

```typescript
import { ApostilleHistory } from 'apostille';
import { NetworkType } from 'symbol-sdk';

const privateKey = "3774097C6B6C0BBD69AC6F033013AF566947EC851CC6082CE8FF6626E83ADB7B";
const network = NetworkType.TEST_NET;

const history = ApostilleHistory.create(privateKey, network);
```

You can also create an Apostille as explained in section 2.3 and get the history account from the `history` property of the created Apostille.

```typescript
const apostille = Apostille.create(<parameters>);

console.log("History account is:", apostille.history)
```

See [ApostilleHistory.ts](src/ApostilleHistory.ts)

### 2.3 - Create an Apostille

To create an Apostille we use the `Apostille` class and `create` method.

```typescript
import { Apostille } from 'apostille';
```

#### Method

```typescript
Apostille.create(<parameters>)
```

#### Parameters

Name           | Type             | Description                |
---------------|------------------|----------------------------|
`filename`     | string           | The file name              |
`fileContent`  | string           | The file content (base64)  |
`tags`         | string           | The file tags              |
`description`  | string           | The file description       |
`url`          | string           | The file url location      |
`privateKey`   | string           | The owner private key      |
`network`      | NetworkType      | The network type           |

#### Return

Apostille object with following properies:

Name           | Type                | Description               |
---------------|---------------------|---------------------------|
`account`      | Account             | The dedicated account     |
`history`      | Account             | The history account       |
`owner`        | PublicAccount       | The owner public account  |
`filename`     | string              | The file name             |
`fileContent`  | string              | The file content (base64) |
`hash`         | ApostilleHash       | The apostille hash        |
`tags`         | string              | The file tags             |
`description`  | string              | The file description      |
`url`          | string              | The file url location     |
`transactions` | InnerTransaction[]  | The array of transactions |
`network`      | NetworkType         | The network type          |

#### Example

```typescript
import { Apostille } from 'apostille';
import * as CryptoJS from 'crypto-js';
import { NetworkType } from 'symbol-sdk';

const filename = "Jeff's favorite car.pdf";
const file_content = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse('Apostille is awesome !'));
const tags = "this, that, those";
const description = "Just a test file";
const url = "";
const privateKey = "3774097C6B6C0BBD69AC6F033013AF566947EC851CC6082CE8FF6626E83ADB7B";
const network = NetworkType.TEST_NET;

const apostille = Apostille.create(filename, file_content, tags, description, url, privateKey, network);
```

**Note**: Tags, description and url can be empty if you don't need them.

See [Apostille.ts](src/Apostille.ts)

### 2.4 - Send an Apostille

Sending an Apostille requires to send the transactions stored in `apostille.transactions` with an Aggregate transaction:

#### Example

```typescript
import { Apostille, ApostilleUtils } from 'apostille';
import * as CryptoJS from 'crypto-js';
import { Deadline, NetworkType, UInt64 } from 'symbol-sdk';

const filename = "Jeff's favorite car.pdf";
const file_content = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse('Apostille is awesome !'));
const tags = "this, that, those";
const description = "Just a test file";
const url = "";
const privateKey = "3774097C6B6C0BBD69AC6F033013AF566947EC851CC6082CE8FF6626E83ADB7B";
const network = NetworkType.TEST_NET;

const apostille = Apostille.create(filename, file_content, tags, description, url, privateKey, network);

const aggregateTransaction = AggregateTransaction.createComplete(
    Deadline.create(),
    apostille.transactions,
    networkType,
    ApostilleUtils.extractSignersFromArray([apostille]),
    UInt64.fromUint(2000000));

[...]
```

You can send many Apostilles into a single aggregate (**maximum inner transactions TBC**).

You must sign the aggregate with the dedicated account and owner account.

```typescript
const owner = Account.createFromPrivateKey("privateKey", network);
const dedicated = Account.createFromPrivateKey("dedicatedPrivateKey", network);

owner.signTransactionWithCosignatories(aggregateTransaction, [dedicated], generationHash);
```

You can use `ApostilleUtils.extractSignersFromArray` to get all the signers (as array of [Account](https://github.com/nemtech/symbol-sdk-typescript-javascript/blob/master/src/model/account/Account.ts)) from an array of Apostilles.

```typescript
const signers = ApostilleUtils.extractSignersFromArray([apostille1, apostille2, ...])
```

You can use `ApostilleUtils.extractTransactionsFromArray` to get all the transactions from an array of Apostilles.

```typescript
const transactions = ApostilleUtils.extractTransactionsFromArray([apostille1, apostille2, ...]),
```

Please refer to Symbol-SDK documentation https://nemtech.github.io/concepts/aggregate-transaction.html for signing and sending of Aggregate transactions.

### 2.5 - Update an Apostille

Updating an Apostille is a very simple process.

The file name must remain the same for generating the same dedicated account. 

```typescript
const filename = "Jeff's favorite car.pdf";
const updated_file_content = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse('Something else !'));
const tags = "this, that, those";
const description = "Just a test file";
const url = "";
const privateKey = "3774097C6B6C0BBD69AC6F033013AF566947EC851CC6082CE8FF6626E83ADB7B";
const network = NetworkType.TEST_NET;
```

Creating the Apostille with `Apostille.create` like explained in 2.3 will generate the same dedicated account, history account and create the hash according to the new data in the file.

```typescript
const apostille = Apostille.create(filename, updated_file_content, tags, description, url, privateKey, network);
```

Then use `metadataHttp.getAccountMetadata` from Symbol-SDK to get the current metadata from the dedicated account.

#### Example

```typescript
const metadataHttp = new MetadataHttp("localhost:3000");
const metadata = await metadataHttp.getAccountMetadata(apostille.account.address);
```

Finally, use the `update` method of the Apostille object to update the Apostille according to current and new values.

#### Method

```typescript
this.update(<parameters>)
```

#### Parameters

Name           | Type             | Description                                           |
---------------|------------------|-------------------------------------------------------|
`metadata`     | Metadata[]       | Current metadata stored in the dedicated account      |

#### Return

A boolean, true if updated, false otherwise.

#### Example

```typescript
apostille.update(metadata);
```

After `update`, the `apostille` will contains the required transactions to send for the update.

#### Complete example

Considering an Apostille for a file named `Jeff's favorite car.pdf` and it's content `Apostille is awesome !` already exists and you want to update the content to `Something else !`.

```typescript
const filename = "Jeff's favorite car.pdf";
const updated_file_content = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse('Something else !'));
```

Code for updating the existing Apostille is:

```typescript
import { Apostille } from 'apostille';
import { MetadataHttp, NetworkType } from 'symbol-sdk';

const filename = "Jeff's favorite car.pdf";
const updated_file_content = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse('Something else !'));
const tags = "this, that, those";
const description = "Just a test file";
const url = "";
const privateKey = "3774097C6B6C0BBD69AC6F033013AF566947EC851CC6082CE8FF6626E83ADB7B";
const network = NetworkType.TEST_NET;

const apostille = Apostille.create(filename, updated_file_content, tags, description, url, privateKey, network);

const metadataHttp = new MetadataHttp("localhost:3000");

metadataHttp.getAccountMetadata(apostille.account.address).toPromise().then((metadata) => {
    console.log("Current metadata is:", metadata);
    const result = apostille.update(metadata);
    if (result === true) {
        console.log("Apostille updated successfully");
    } else {
        console.log("Could not update Apostille");
    }
});

[...] // Send the apostille
```

See [Apostille.ts](src/Apostille.ts)

### 2.6 - Verify an Apostille

To verify an Apostille we use the `ApostilleVerification` class.

#### Method

```typescript
ApostilleVerification.verify(<parameters>)
```

#### Parameters

Name          | Type          | Description                                           |
--------------|---------------|-------------------------------------------------------|
`filename`    | string        | The filename in Apostille format                      |
`data`        | string        | The file content (as Base64)                          |
`metadata`    | Metadata[]    | Current metadata stored in the dedicated account      |

#### Return

An [ApostilleVerificationResult](src/ApostilleVerificationResult.ts)

#### Example

```typescript
import { ApostilleVerification } from 'apostille';
import * as CryptoJS from 'crypto-js';

const filename = "Jeff's favorite car - SCJ32GQUNN4GP72HFPVHM5OICFGLRUR4V2SQOMKB - 2020-01-16.pdf";
const data = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse('Apostille is awesome !'));
const metadata = [...];

const result = ApostilleVerification.verify(filename, data, metadata);
```

#### Deep verification

If you have an old version of a file, verification against metadata will fail because the hash of the old file is different than the current hash stored in metadata. 

Therefore, you may also check if the hash was previously published in the dedicated account's transactions and verify that the hash signature is valid using `verifyHash`.

Then you can notify your user that their file is valid but a new version is available.

#### Method

```typescript
ApostilleVerification.verifyHash(<parameters>)
```

#### Parameters

Name          | Type          | Description                                           |
--------------|---------------|-------------------------------------------------------|
`publicKey`   | string        | Public key of owner                                   |
`data`        | string        | The file content (as Base64)                          |
`hash`        | string        | Apostille hash                                        |
`network`     | NetworkType   | The network type                                      |

#### Return

A boolean, true if valid, false otherwise.

#### Example

```typescript
import { ApostilleVerification } from 'apostille';
import * as CryptoJS from 'crypto-js';
import { NetworkType } from 'symbol-sdk';

const publicKey = "F9ECE5A4808F618CE8847360537B1BC1D0C25442A2788957417BD14A31731C4A";
const data = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse('Apostille is awesome !'));
const hash = "FE4E545983ADC338C745B51D46E8F8421ABDE31E9CA920F509CD372DCD2F1195C11A4B4BB420B36539EF205A817B20416752B28C9542C8804E685F4A328E41819CFA795307";
const network = NetworkType.TEST_NET;

const result = ApostilleVerification.verifyHash(publicKey, data, hash, network);
```

## 3 - To do

- Deeper testing
- Add certificate
- Custom file metadata
- Solve https://github.com/nemtech/NIP/blob/master/NIPs/nip-0004.md#drawbacks

## 4 - License 

Copyright (c) 2020 SPHAERA FINTECH SASU
Licensed under the [Apache License 2.0](LICENSE)