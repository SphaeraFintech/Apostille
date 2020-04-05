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

import { ApostilleVerification } from '../index';
import * as CryptoJS from 'crypto-js';
import { NetworkType } from 'symbol-sdk';

const filename = "Jeff's favorite car - SCJ32GQUNN4GP72HFPVHM5OICFGLRUR4V2SQOMKB - 2020-01-16.pdf";
const file_content = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse('Apostille is awesome !'));
const metadata = [];

const result = ApostilleVerification.verify(filename, file_content, metadata);

console.log("Verification result", result);

const ownerPublicKey = "F9ECE5A4808F618CE8847360537B1BC1D0C25442A2788957417BD14A31731C4A";
const apostille_hash = "FE4E545983ADC338C745B51D46E8F8421ABDE31E9CA920F509CD372DCD2F1195C11A4B4BB420B36539EF205A817B20416752B28C9542C8804E685F4A328E41819CFA795307";
const network = NetworkType.TEST_NET;

const resultHash = ApostilleVerification.verifyHash(ownerPublicKey, file_content, apostille_hash, network);

console.log("Verify hash result", resultHash);