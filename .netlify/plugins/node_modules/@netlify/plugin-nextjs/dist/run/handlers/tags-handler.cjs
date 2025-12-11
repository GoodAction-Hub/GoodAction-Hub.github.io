"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/run/handlers/tags-handler.cts
var tags_handler_exports = {};
__export(tags_handler_exports, {
  getMostRecentTagExpirationTimestamp: () => getMostRecentTagExpirationTimestamp,
  isAnyTagStaleOrExpired: () => isAnyTagStaleOrExpired,
  markTagsAsStaleAndPurgeEdgeCache: () => markTagsAsStaleAndPurgeEdgeCache,
  purgeEdgeCache: () => purgeEdgeCache
});
module.exports = __toCommonJS(tags_handler_exports);

// node_modules/@netlify/functions/dist/main.js
var import_process = require("process");
var import_stream = require("stream");
var import_util = require("util");
var purgeCache = async (options = {}) => {
  if (globalThis.fetch === void 0) {
    throw new Error(
      "`fetch` is not available. Please ensure you're using Node.js version 18.0.0 or above. Refer to https://ntl.fyi/functions-runtime for more information."
    );
  }
  const payload = {
    cache_tags: options.tags,
    deploy_alias: options.deployAlias
  };
  const token = import_process.env.NETLIFY_PURGE_API_TOKEN || options.token;
  if (import_process.env.NETLIFY_LOCAL && !token) {
    const scope = options.tags?.length ? ` for tags ${options.tags?.join(", ")}` : "";
    console.log(`Skipping purgeCache${scope} in local development.`);
    return;
  }
  if ("siteSlug" in options) {
    payload.site_slug = options.siteSlug;
  } else if ("domain" in options) {
    payload.domain = options.domain;
  } else {
    const siteID = options.siteID || import_process.env.SITE_ID;
    if (!siteID) {
      throw new Error(
        "The Netlify site ID was not found in the execution environment. Please supply it manually using the `siteID` property."
      );
    }
    payload.site_id = siteID;
  }
  if (!token) {
    throw new Error(
      "The cache purge API token was not found in the execution environment. Please supply it manually using the `token` property."
    );
  }
  const headers = {
    "Content-Type": "application/json; charset=utf8",
    Authorization: `Bearer ${token}`
  };
  if (options.userAgent) {
    headers["user-agent"] = options.userAgent;
  }
  const apiURL = options.apiURL || "https://api.netlify.com";
  const response = await fetch(`${apiURL}/api/v1/purge`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    throw new Error(`Cache purge API call returned an unexpected status code: ${response.status}`);
  }
};
var pipeline = (0, import_util.promisify)(import_stream.pipeline);

// package.json
var name = "@netlify/plugin-nextjs";
var version = "5.14.7";

// src/run/handlers/tags-handler.cts
var import_storage = require("../storage/storage.cjs");
var import_request_context = require("./request-context.cjs");
var purgeCacheUserAgent = `${name}@${version}`;
async function getTagManifest(tag, cacheStore) {
  const tagManifest = await cacheStore.get(tag, "tagManifest.get");
  if (!tagManifest) {
    return null;
  }
  return tagManifest;
}
async function getMostRecentTagExpirationTimestamp(tags) {
  if (tags.length === 0) {
    return 0;
  }
  const cacheStore = (0, import_storage.getMemoizedKeyValueStoreBackedByRegionalBlobStore)({ consistency: "strong" });
  const manifestsOrNulls = await Promise.all(tags.map((tag) => getTagManifest(tag, cacheStore)));
  const expirationTimestamps = manifestsOrNulls.filter((manifest) => manifest !== null).map((manifest) => manifest.expireAt);
  if (expirationTimestamps.length === 0) {
    return 0;
  }
  return Math.max(...expirationTimestamps);
}
function isAnyTagStaleOrExpired(tags, timestamp) {
  if (tags.length === 0 || !timestamp) {
    return Promise.resolve({ stale: false, expired: false });
  }
  const cacheStore = (0, import_storage.getMemoizedKeyValueStoreBackedByRegionalBlobStore)({ consistency: "strong" });
  return new Promise((resolve, reject) => {
    const tagManifestPromises = [];
    for (const tag of tags) {
      const tagManifestPromise = getTagManifest(tag, cacheStore);
      tagManifestPromises.push(
        tagManifestPromise.then((tagManifest) => {
          if (!tagManifest) {
            return { stale: false, expired: false };
          }
          const stale = tagManifest.staleAt >= timestamp;
          const expired = tagManifest.expireAt >= timestamp && tagManifest.expireAt <= Date.now();
          if (expired && stale) {
            const expiredResult = {
              stale,
              expired
            };
            resolve(expiredResult);
            return expiredResult;
          }
          if (stale) {
            const staleResult = {
              stale,
              expired,
              expireAt: tagManifest.expireAt
            };
            return staleResult;
          }
          return { stale: false, expired: false };
        })
      );
    }
    Promise.all(tagManifestPromises).then((tagManifestsAreStaleOrExpired) => {
      let result = { stale: false, expired: false };
      for (const tagResult of tagManifestsAreStaleOrExpired) {
        if (tagResult.expired) {
          result = tagResult;
          break;
        }
        if (tagResult.stale) {
          result = {
            stale: true,
            expired: false,
            expireAt: (
              // make sure to use expireAt that is lowest of all tags
              result.stale && !result.expired && typeof result.expireAt === "number" ? Math.min(result.expireAt, tagResult.expireAt) : tagResult.expireAt
            )
          };
        }
      }
      resolve(result);
    }).catch(reject);
  });
}
function getCacheTagsFromTagOrTags(tagOrTags) {
  return (Array.isArray(tagOrTags) ? tagOrTags : [tagOrTags]).flatMap((tag) => tag.split(/,|%2c/gi)).filter(Boolean);
}
function purgeEdgeCache(tagOrTags) {
  const tags = getCacheTagsFromTagOrTags(tagOrTags);
  if (tags.length === 0) {
    return Promise.resolve();
  }
  (0, import_request_context.getLogger)().debug(`[NextRuntime] Purging CDN cache for: [${tags}.join(', ')]`);
  return purgeCache({ tags, userAgent: purgeCacheUserAgent }).catch((error) => {
    (0, import_request_context.getLogger)().withError(error).error(`[NextRuntime] Purging the cache for tags [${tags.join(",")}] failed`);
  });
}
async function doRevalidateTagAndPurgeEdgeCache(tags, durations) {
  (0, import_request_context.getLogger)().withFields({ tags, durations }).debug("doRevalidateTagAndPurgeEdgeCache");
  if (tags.length === 0) {
    return;
  }
  const now = Date.now();
  const tagManifest = {
    staleAt: now,
    expireAt: now + (durations?.expire ? durations.expire * 1e3 : 0)
  };
  const cacheStore = (0, import_storage.getMemoizedKeyValueStoreBackedByRegionalBlobStore)({ consistency: "strong" });
  await Promise.all(
    tags.map(async (tag) => {
      try {
        await cacheStore.set(tag, tagManifest, "tagManifest.set");
      } catch (error) {
        (0, import_request_context.getLogger)().withError(error).log(`[NextRuntime] Failed to update tag manifest for ${tag}`);
      }
    })
  );
  await purgeEdgeCache(tags);
}
function markTagsAsStaleAndPurgeEdgeCache(tagOrTags, durations) {
  const tags = getCacheTagsFromTagOrTags(tagOrTags);
  const revalidationKey = JSON.stringify({ tags, durations });
  const requestContext = (0, import_request_context.getRequestContext)();
  if (requestContext) {
    const ongoingRevalidation = requestContext.ongoingRevalidations?.get(revalidationKey);
    if (ongoingRevalidation) {
      return ongoingRevalidation;
    }
  }
  const revalidateTagPromise = doRevalidateTagAndPurgeEdgeCache(tags, durations);
  if (requestContext) {
    requestContext.ongoingRevalidations ??= /* @__PURE__ */ new Map();
    requestContext.ongoingRevalidations.set(revalidationKey, revalidateTagPromise);
    process.nextTick(() => {
      requestContext.ongoingRevalidations?.delete(revalidationKey);
    });
    requestContext.trackBackgroundWork(revalidateTagPromise);
  }
  return revalidateTagPromise;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getMostRecentTagExpirationTimestamp,
  isAnyTagStaleOrExpired,
  markTagsAsStaleAndPurgeEdgeCache,
  purgeEdgeCache
});
