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

import { ApostilleMetadata } from '../src/ApostilleMetadata';
import { expect } from 'chai';
import { DESCRIPTION_METADATA, HASH_METADATA, METADATA, NAME_METADATA, TAGS_METADATA, URL_METADATA } from './conf.spec';

describe('ApostilleMetadata', () => {

    it('should create an ApostilleMetadata', () => {
        const expectedApostilleMetadata = {
            name: NAME_METADATA.metadataEntry,
            hash: HASH_METADATA.metadataEntry,
            tags: TAGS_METADATA.metadataEntry,
            description: DESCRIPTION_METADATA.metadataEntry,
            url: URL_METADATA.metadataEntry
        }
        const apostilleMetadata = ApostilleMetadata.create(METADATA);
        expect(apostilleMetadata).to.be.eql(expectedApostilleMetadata)
    });

});