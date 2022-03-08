/* Copyright 2012 Mozilla Foundation
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

// eslint-disable-next-line max-len
/** @typedef {import("./display/api").PDFDocumentLoadingTask} PDFDocumentLoadingTask */
/** @typedef {import("./display/api").PDFDocumentProxy} PDFDocumentProxy */
/** @typedef {import("./display/api").PDFPageProxy} PDFPageProxy */
/** @typedef {import("./display/api").RenderTask} RenderTask */
/** @typedef {import("./display/display_utils").PageViewport} PageViewport */

import {
  AnnotationMode,
  CMapCompressionType,
  createPromiseCapability,
  createValidAbsoluteUrl,
  InvalidPDFException,
  MissingPDFException,
  OPS,
  PasswordResponses,
  PermissionFlag,
  shadow,
  UnexpectedResponseException,
  UNSUPPORTED_FEATURES,
  Util,
  VerbosityLevel,
} from "./shared/util.js";
import {
  build,
  getDocument,
  LoopbackPort,
  PDFDataRangeTransport,
  PDFWorker,
  setPDFNetworkStreamFactory,
  version,
} from "./display/api.js";
import {
  getFilenameFromUrl,
  getPdfFilenameFromUrl,
  getXfaPageViewport,
  isPdfFile,
  isValidFetchUrl,
  loadScript,
  PDFDateString,
  PixelsPerInch,
  RenderingCancelledException,
} from "./display/display_utils.js";
import { AnnotationLayer } from "./display/annotation_layer.js";
import { GlobalWorkerOptions } from "./display/worker_options.js";
import { isNodeJS } from "./shared/is_node.js";
import { renderTextLayer } from "./display/text_layer.js";
import { SVGGraphics } from "./display/svg.js";
import { XfaLayer } from "./display/xfa_layer.js";

/* eslint-disable-next-line no-unused-vars */
const pdfjsVersion =
  typeof PDFJSDev !== "undefined" ? PDFJSDev.eval("BUNDLE_VERSION") : void 0;
/* eslint-disable-next-line no-unused-vars */
const pdfjsBuild =
  typeof PDFJSDev !== "undefined" ? PDFJSDev.eval("BUNDLE_BUILD") : void 0;

if (typeof PDFJSDev === "undefined" || !PDFJSDev.test("PRODUCTION")) {
  const streamsPromise = Promise.all([
    import("pdfjs/display/network.js"),
    import("pdfjs/display/fetch_stream.js"),
  ]);

  setPDFNetworkStreamFactory(async params => {
    const [{ PDFNetworkStream }, { PDFFetchStream }] = await streamsPromise;
    if (isValidFetchUrl(params.url)) {
      return new PDFFetchStream(params);
    }
    return new PDFNetworkStream(params);
  });
} else if (PDFJSDev.test("GENERIC || CHROME")) {
  if (PDFJSDev.test("GENERIC") && isNodeJS) {
    const { PDFNodeStream } = require("./display/node_stream.js");

    setPDFNetworkStreamFactory(params => {
      return new PDFNodeStream(params);
    });
  } else {
    const { PDFNetworkStream } = require("./display/network.js");
    const { PDFFetchStream } = require("./display/fetch_stream.js");

    setPDFNetworkStreamFactory(params => {
      if (isValidFetchUrl(params.url)) {
        return new PDFFetchStream(params);
      }
      return new PDFNetworkStream(params);
    });
  }
}

export {
  AnnotationLayer,
  AnnotationMode,
  build,
  CMapCompressionType,
  createPromiseCapability,
  createValidAbsoluteUrl,
  getDocument,
  getFilenameFromUrl,
  getPdfFilenameFromUrl,
  getXfaPageViewport,
  GlobalWorkerOptions,
  InvalidPDFException,
  isPdfFile,
  loadScript,
  LoopbackPort,
  MissingPDFException,
  OPS,
  PasswordResponses,
  PDFDataRangeTransport,
  PDFDateString,
  PDFWorker,
  PermissionFlag,
  PixelsPerInch,
  RenderingCancelledException,
  renderTextLayer,
  shadow,
  SVGGraphics,
  UnexpectedResponseException,
  UNSUPPORTED_FEATURES,
  Util,
  VerbosityLevel,
  version,
  XfaLayer,
};
