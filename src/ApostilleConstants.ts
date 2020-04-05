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

/**
 * Apostille checksum
 * @type {string}
 */
export const checksum: string = "FE4E545983";

/**
 * Network
 * @type {boolean}
 */
export const publicNetwork: boolean = true;

/**
 * Apostille metadata keys
 * @type {object}
 */
export enum metadataKey {

    /**
     * File name metadata key
     * @type {string}
     */
    name = "4e873e69f4ea29e7",

    /**
     * File hash metadata key
     * @type {string}
     */
    hash = "4183f7a941a298f1",

    /**
     * File tags metadata key
     * @type {string}
     */
    tags = "e6cdcfd9e70913c6",

    /**
     * File description metadata key
     * @type {string}
     */
    description = "74de2eda73ba52e4",

    /**
     * File url metadata key
     * @type {string}
     */
    url = "8b72a3f2b61a22d0",

    /**
     * History account metadakey
     * @type {string}
     */
    history = "546eef3057838cbf"

}