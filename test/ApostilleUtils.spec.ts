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
import { Apostille } from '../src/Apostille';
import { ApostilleUtils } from '../src/ApostilleUtils';
import { FILENAME, FILE_CONTENT, TAGS, MAIN_ACCOUNT, METADATA, NETWORK_TYPE, DESCRIPTION, URL, NAME_METADATA, HASH_METADATA, APOSTILLE_FORMAT_FILENAME, DEDICATED_ACCOUNT, APOSTILLE_FULL_HASH } from './conf.spec';
import { Account } from 'symbol-sdk';
import { metadataKey } from '../src/ApostilleConstants';

describe('ApostilleUtils', () => {

    const apostille = Apostille.create(FILENAME, FILE_CONTENT, TAGS, DESCRIPTION, URL, MAIN_ACCOUNT.privateKey, NETWORK_TYPE);
    const apostille2 = Apostille.create("new" + FILENAME, FILE_CONTENT, TAGS, DESCRIPTION, URL, MAIN_ACCOUNT.privateKey, NETWORK_TYPE);

    it('should create a short date', () => {
        const expectedShortDate = "1970-01-01";
        const shortDate = ApostilleUtils.toShortDate(new Date(0));
        expect(shortDate).to.be.equal(expectedShortDate);
    });

    it('should get file extension', () => {
        const expectedExtension = ".pdf";
        const extension = ApostilleUtils.getExtension(FILENAME);
        expect(extension).to.be.equal(expectedExtension);
    });

    it('should remove file extension', () => {
        const expectedFilename = "Jeff's favorite car";
        const filename = ApostilleUtils.removeExtension(FILENAME);
        expect(filename).to.be.equal(expectedFilename);
    });

    it('should return Apostilles signers from an array of Apostilles', () => {
        const expectedAccount = Account.createFromPrivateKey("95A5F045700181E2626BF21BABED3BB9C65EA9C8014A319B02EE5E13828C3A49", NETWORK_TYPE);
        const expectedAccount2 = Account.createFromPrivateKey("11BFB38653919F85D6A0851E966D49E68132B70A0D95386164EB5FE8DBE00805", NETWORK_TYPE);
        const signers = ApostilleUtils.extractSigners([apostille, apostille2]);
        expect(signers.length).to.be.equal(2);
        expect(signers[0]).to.be.eql(expectedAccount);
        expect(signers[1]).to.be.eql(expectedAccount2);
    });

    it('should return Apostilles transactions from an array of Apostilles', () => {
        const txes = ApostilleUtils.extractTransactions([apostille, apostille2]);
        expect(txes.length).to.be.equal(14);
    });

    it('should find Metadata by key from an array of Metadata', () => {
        const metadata = ApostilleUtils.findMetadataByKey(METADATA, metadataKey.hash);
        expect(metadata.value).to.be.equal(APOSTILLE_FULL_HASH);
    });

    it('should return undefined if Metadata by key is not found in an array of Metadata', () => {
        const m = [NAME_METADATA, HASH_METADATA];
        const metadata = ApostilleUtils.findMetadataByKey(m, metadataKey.description);
        expect(metadata).to.be.equal(undefined);
    });

    it('should extract dedicated account from file name in Apostille format', () => {
        const dedicated = ApostilleUtils.extractDedicatedFromName(APOSTILLE_FORMAT_FILENAME);
        expect(dedicated).to.be.eql(DEDICATED_ACCOUNT.address);
    });

    it('should return undefined if invalid Apostille format file name', () => {
        const dedicated = ApostilleUtils.extractDedicatedFromName(FILENAME);
        expect(dedicated).to.be.eql(undefined);
    });

    it('should retrieve original file name from a file name in Apostille format', () => {
        const original = ApostilleUtils.getOriginalFilename(APOSTILLE_FORMAT_FILENAME);
        expect(original).to.be.eql(FILENAME);
    });

});