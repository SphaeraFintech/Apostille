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

import { expect } from 'chai';
import * as CryptoJS from 'crypto-js';
import { ApostilleVerification } from '../src/ApostilleVerification';
import { FILE_CONTENT, MAIN_ACCOUNT, NETWORK_TYPE, APOSTILLE_FORMAT_FILENAME, METADATA, FILENAME, APOSTILLE_FULL_HASH } from './conf.spec';
import { ApostilleVerificationResult } from '../src/ApostilleVerificationResult';
import { ApostilleMetadata } from '../src/ApostilleMetadata';

describe('ApostilleVerification', () => {

    const invalidFileContent = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse('Awesome is Apostille !'));
    const invalidPublicKey = "601F846E9038884A202446D7E1F076ED0E6544FBF898CFAD66F9E35E58BEA123";
    const invalidSignature = "FE4E545983000000C745B51D46E8F8421ABDE31E9CA920F509CD372DCD2F1195C11A4B4BB420B36539EF205A817B20416752B28C9542C8804E685F4A328E41819CFA000000";

    it('Should verify a valid Apostille hash signature', () => {
        const isValid = ApostilleVerification.verifyHash(MAIN_ACCOUNT.publicKey, FILE_CONTENT, APOSTILLE_FULL_HASH, NETWORK_TYPE);
        expect(isValid).to.be.equal(true);
    });

    it('Should not verify an Apostille with invalid hash signature', () => {
        const isValid = ApostilleVerification.verifyHash(MAIN_ACCOUNT.publicKey, FILE_CONTENT, invalidSignature, NETWORK_TYPE);
        expect(isValid).to.be.equal(false);
    });

    it('Should not verify an Apostille hash with invalid file content', () => {
        const isValid = ApostilleVerification.verifyHash(MAIN_ACCOUNT.publicKey, invalidFileContent, APOSTILLE_FULL_HASH, NETWORK_TYPE);
        expect(isValid).to.be.equal(false);
    });

    it('Should not verify an Apostille hash with invalid public key', () => {
        const isValid = ApostilleVerification.verifyHash(invalidPublicKey, FILE_CONTENT, APOSTILLE_FULL_HASH, NETWORK_TYPE);
        expect(isValid).to.be.equal(false);
    });

    it('Should verify an Apostille', () => {
        const result = ApostilleVerification.verify(APOSTILLE_FORMAT_FILENAME, FILE_CONTENT, METADATA);
        expect(result).to.be.eql(ApostilleVerificationResult.create(5, true, ApostilleMetadata.create(METADATA)));
    });

    it('Should fail with code 1 at verify an Apostille', () => {
        const result = ApostilleVerification.verify(FILENAME, FILE_CONTENT, METADATA);
        expect(result.code).to.be.equal(1);
    });

    it('Should fail with code 2 at verify an Apostille', () => {
        const result = ApostilleVerification.verify(APOSTILLE_FORMAT_FILENAME, FILE_CONTENT, []);
        expect(result.code).to.be.equal(2);
    });

    it('Should fail with code 3 at verify an Apostille', () => {
        const result = ApostilleVerification.verify("ex" + APOSTILLE_FORMAT_FILENAME, FILE_CONTENT, METADATA);
        expect(result.code).to.be.equal(3);
    });

    it('Should fail with code 4 at verify an Apostille', () => {
        const result = ApostilleVerification.verify(APOSTILLE_FORMAT_FILENAME, invalidFileContent, METADATA);
        expect(result.code).to.be.equal(4);
    });

});