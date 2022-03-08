/* Copyright 2017 Mozilla Foundation
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
/* globals __non_webpack_require__ */

import { isNodeJS } from "./is_node.js";

// Skip compatibility checks for modern builds and if we already ran the module.
if (
  (typeof PDFJSDev === "undefined" || !PDFJSDev.test("SKIP_BABEL")) &&
  !globalThis._pdfjsCompatibilityChecked
) {
  globalThis._pdfjsCompatibilityChecked = true;

  // Support: Node.js
  (function checkNodeBtoa() {
    if (globalThis.btoa || !isNodeJS) {
      return;
    }
    globalThis.btoa = function (chars) {
      // eslint-disable-next-line no-undef
      return Buffer.from(chars, "binary").toString("base64");
    };
  })();

  // Support: Node.js
  (function checkNodeAtob() {
    if (globalThis.atob || !isNodeJS) {
      return;
    }
    globalThis.atob = function (input) {
      // eslint-disable-next-line no-undef
      return Buffer.from(input, "base64").toString("binary");
    };
  })();

  // Support: Node.js
  (function checkDOMMatrix() {
    if (globalThis.DOMMatrix || !isNodeJS) {
      return;
    }
    globalThis.DOMMatrix = require("dommatrix/dist/dommatrix.js");
  })();

  // Provides support for *recent* additions to the Promise specification,
  // however basic Promise support is assumed to be available natively.
  // Support: Firefox<71, Chrome<76, Safari<13, Node.js<12.9.0
  (function checkPromise() {
    if (typeof PDFJSDev !== "undefined" && PDFJSDev.test("IMAGE_DECODERS")) {
      // The current image decoders are synchronous, hence `Promise` shouldn't
      // need to be polyfilled for the IMAGE_DECODERS build target.
      return;
    }
    if (globalThis.Promise.allSettled) {
      return;
    }
    globalThis.Promise = require("core-js/es/promise/index.js");
  })();

  // Support: Node.js
  (function checkReadableStream() {
    if (globalThis.ReadableStream || !isNodeJS) {
      return;
    }
    globalThis.ReadableStream = __non_webpack_require__(
      "web-streams-polyfill/dist/ponyfill.js"
    ).ReadableStream;
  })();

  // Support: Firefox<94, Chrome<98, Safari<15.4, Node.js<17.0.0
  (function checkStructuredClone() {
    if (typeof PDFJSDev !== "undefined" && PDFJSDev.test("IMAGE_DECODERS")) {
      // The current image decoders are synchronous, hence `structuredClone`
      // shouldn't need to be polyfilled for the IMAGE_DECODERS build target.
      return;
    }
    if (globalThis.structuredClone) {
      return;
    }
    require("core-js/web/structured-clone.js");
  })();
}
