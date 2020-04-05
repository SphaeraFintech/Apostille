/*
 * Copyright 2020 SPHAERA FINTECH SASU
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { metadataKey } from '../src/ApostilleConstants';
import { ApostilleMetadata } from '../src/ApostilleMetadata';
import * as CryptoJS from 'crypto-js';
import { Account, NetworkType, Metadata, MetadataEntry, UInt64, MetadataType } from 'symbol-sdk';

/* Network */

export const NETWORK_TYPE = NetworkType.MIJIN_TEST;

/* Apostille accounts */

export const MAIN_ACCOUNT = Account.createFromPrivateKey("3774097C6B6C0BBD69AC6F033013AF566947EC851CC6082CE8FF6626E83ADB7B", NETWORK_TYPE);

export const DEDICATED_ACCOUNT = Account.createFromPrivateKey("95A5F045700181E2626BF21BABED3BB9C65EA9C8014A319B02EE5E13828C3A49", NETWORK_TYPE);

export const HISTORY_ACCOUNT = Account.createFromPrivateKey("30D0BE830072D90E78CDFCBBDFB8C7E0E500F71F2228D538B266114DD253C639", NETWORK_TYPE);

/* File */

export const FILENAME = "Jeff's favorite car.pdf";

export const APOSTILLE_FORMAT_FILENAME = "Jeff's favorite car - " + DEDICATED_ACCOUNT.address.plain() + " - 2020-01-16.pdf";

export const FILE_CONTENT = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse('Apostille is awesome !'));

export const UPDATED_FILE_CONTENT = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse('Apostille is awesome 2 !'));

export const APOSTILLE_CHECKSUM = "FE4E545983";

export const APOSTILLE_DATA_HASH = "ADC338C745B51D46E8F8421ABDE31E9CA920F509CD372DCD2F1195C11A4B4BB420B36539EF205A817B20416752B28C9542C8804E685F4A328E41819CFA795307";

export const APOSTILLE_FULL_HASH = APOSTILLE_CHECKSUM + APOSTILLE_DATA_HASH;

export const TAGS = "this, that, those";

export const DESCRIPTION = "Just a test file";

export const URL = "https://github.com";

/* Metadata */

export const NAME_METADATA = new Metadata('',
    new MetadataEntry('',
        MAIN_ACCOUNT.publicKey, DEDICATED_ACCOUNT.publicKey, UInt64.fromHex(metadataKey.name), MetadataType.Account, FILENAME, undefined));

export const HASH_METADATA = new Metadata('',
    new MetadataEntry('',
        MAIN_ACCOUNT.publicKey, DEDICATED_ACCOUNT.publicKey, UInt64.fromHex(metadataKey.hash), MetadataType.Account, APOSTILLE_FULL_HASH, undefined));

export const TAGS_METADATA = new Metadata('',
    new MetadataEntry('',
        MAIN_ACCOUNT.publicKey, DEDICATED_ACCOUNT.publicKey, UInt64.fromHex(metadataKey.tags), MetadataType.Account, TAGS, undefined));

export const DESCRIPTION_METADATA = new Metadata('',
    new MetadataEntry('',
        MAIN_ACCOUNT.publicKey, DEDICATED_ACCOUNT.publicKey, UInt64.fromHex(metadataKey.description), MetadataType.Account, DESCRIPTION, undefined));

export const URL_METADATA = new Metadata('',
    new MetadataEntry('',
        MAIN_ACCOUNT.publicKey, DEDICATED_ACCOUNT.publicKey, UInt64.fromHex(metadataKey.url), MetadataType.Account, URL, undefined));

export const METADATA = [NAME_METADATA, HASH_METADATA, TAGS_METADATA, DESCRIPTION_METADATA, URL_METADATA];

export const APOSTILLE_METADATA = ApostilleMetadata.create([NAME_METADATA, HASH_METADATA, TAGS_METADATA, DESCRIPTION_METADATA, URL_METADATA]);

export const EMPTY_APOSTILLE_METADATA = new ApostilleMetadata(undefined, undefined, undefined, undefined, undefined);