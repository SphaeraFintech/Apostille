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

import { metadataKey } from './ApostilleConstants';
import { ApostilleUtils } from './ApostilleUtils';
import { Metadata, MetadataEntry } from 'symbol-sdk';

export class ApostilleMetadata {

    constructor(public readonly name: MetadataEntry,
        public readonly hash: MetadataEntry,
        public readonly tags: MetadataEntry,
        public readonly description: MetadataEntry,
        public readonly url: MetadataEntry) { }

    /**
     * Isolate Apostille related metadata from dedicated account's metadata
     * @param {Metadata[]} metadata Dedicated account's metadata
     * @return {ApostilleMetadata} Apostille metadata
     */
    public static create(metadata: Metadata[]): ApostilleMetadata {
        const name = ApostilleUtils.findMetadataByKey(metadata, metadataKey.name);
        const hash = ApostilleUtils.findMetadataByKey(metadata, metadataKey.hash);
        const tags = ApostilleUtils.findMetadataByKey(metadata, metadataKey.tags);
        const description = ApostilleUtils.findMetadataByKey(metadata, metadataKey.description);
        const url = ApostilleUtils.findMetadataByKey(metadata, metadataKey.url);
        return new ApostilleMetadata(name, hash, tags, description, url);
    }

}