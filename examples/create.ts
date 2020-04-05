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

import { Apostille } from "../index";
import { NetworkType } from 'symbol-sdk';
import * as CryptoJS from 'crypto-js';

const network = NetworkType.TEST_NET;
const filename = "Jeff's favorite car.pdf";
const file_content = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse('Apostille is awesome !'));
const tags = "this, that, those";
const description = "Just a test file";
const url = "";
const privateKey = "3774097C6B6C0BBD69AC6F033013AF566947EC851CC6082CE8FF6626E83ADB7B";

const apostille = Apostille.create(filename, file_content, tags, description, url, privateKey, network);

console.log("\n");
console.log("Apostille summary:\n");
console.log("Owner public key: ", apostille.owner.publicKey);
console.log("History account: ", apostille.history.address.plain());
console.log("Dedicated account: ", apostille.account.address.plain());
console.log("File name: ", apostille.filename);
console.log("File content (base64): ", apostille.fileContent);
console.log("File tags: ", apostille.tags);
console.log("Apostille hash: ", apostille.hash.full);
console.log("Number of transactions included: ", apostille.transactions.length);
console.log("Transactions: ", apostille.transactions);
console.log("\n");