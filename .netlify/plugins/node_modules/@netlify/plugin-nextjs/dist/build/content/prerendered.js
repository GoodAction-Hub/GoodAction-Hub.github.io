
      var require = await (async () => {
        var { createRequire } = await import("node:module");
        return createRequire(import.meta.url);
      })();
    
import {
  trace,
  wrapTracer
} from "../../esm-chunks/chunk-5V5HA6YA.js";
import {
  require_out
} from "../../esm-chunks/chunk-YUXQHOYO.js";
import {
  require_semver
} from "../../esm-chunks/chunk-TVEBGDAB.js";
import {
  __toESM
} from "../../esm-chunks/chunk-6BT4RYQJ.js";

// src/build/content/prerendered.ts
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
var import_fast_glob = __toESM(require_out(), 1);

// node_modules/yocto-queue/index.js
var Node = class {
  value;
  next;
  constructor(value) {
    this.value = value;
  }
};
var Queue = class {
  #head;
  #tail;
  #size;
  constructor() {
    this.clear();
  }
  enqueue(value) {
    const node = new Node(value);
    if (this.#head) {
      this.#tail.next = node;
      this.#tail = node;
    } else {
      this.#head = node;
      this.#tail = node;
    }
    this.#size++;
  }
  dequeue() {
    const current = this.#head;
    if (!current) {
      return;
    }
    this.#head = this.#head.next;
    this.#size--;
    return current.value;
  }
  peek() {
    if (!this.#head) {
      return;
    }
    return this.#head.value;
  }
  clear() {
    this.#head = void 0;
    this.#tail = void 0;
    this.#size = 0;
  }
  get size() {
    return this.#size;
  }
  *[Symbol.iterator]() {
    let current = this.#head;
    while (current) {
      yield current.value;
      current = current.next;
    }
  }
  *drain() {
    while (this.#head) {
      yield this.dequeue();
    }
  }
};

// node_modules/p-limit/index.js
function pLimit(concurrency) {
  validateConcurrency(concurrency);
  const queue = new Queue();
  let activeCount = 0;
  const resumeNext = () => {
    if (activeCount < concurrency && queue.size > 0) {
      queue.dequeue()();
      activeCount++;
    }
  };
  const next = () => {
    activeCount--;
    resumeNext();
  };
  const run = async (function_, resolve, arguments_) => {
    const result = (async () => function_(...arguments_))();
    resolve(result);
    try {
      await result;
    } catch {
    }
    next();
  };
  const enqueue = (function_, resolve, arguments_) => {
    new Promise((internalResolve) => {
      queue.enqueue(internalResolve);
    }).then(
      run.bind(void 0, function_, resolve, arguments_)
    );
    (async () => {
      await Promise.resolve();
      if (activeCount < concurrency) {
        resumeNext();
      }
    })();
  };
  const generator = (function_, ...arguments_) => new Promise((resolve) => {
    enqueue(function_, resolve, arguments_);
  });
  Object.defineProperties(generator, {
    activeCount: {
      get: () => activeCount
    },
    pendingCount: {
      get: () => queue.size
    },
    clearQueue: {
      value() {
        queue.clear();
      }
    },
    concurrency: {
      get: () => concurrency,
      set(newConcurrency) {
        validateConcurrency(newConcurrency);
        concurrency = newConcurrency;
        queueMicrotask(() => {
          while (activeCount < concurrency && queue.size > 0) {
            resumeNext();
          }
        });
      }
    }
  });
  return generator;
}
function validateConcurrency(concurrency) {
  if (!((Number.isInteger(concurrency) || concurrency === Number.POSITIVE_INFINITY) && concurrency > 0)) {
    throw new TypeError("Expected `concurrency` to be a number from 1 and up");
  }
}

// src/build/content/prerendered.ts
var import_semver = __toESM(require_semver(), 1);
import { encodeBlobKey } from "../../shared/blobkey.js";
import { verifyNetlifyForms } from "../verification.js";
var tracer = wrapTracer(trace.getTracer("Next runtime"));
var writeCacheEntry = async (route, value, lastModified, ctx) => {
  const path = join(ctx.blobDir, await encodeBlobKey(route));
  const entry = JSON.stringify({
    lastModified,
    value
  });
  await writeFile(path, entry, "utf-8");
};
var routeToFilePath = (path) => {
  if (path === "/") {
    return "/index";
  }
  if (path.startsWith("/")) {
    return path;
  }
  return `/${path}`;
};
var buildPagesCacheValue = async (path, initialRevalidateSeconds, shouldUseEnumKind, shouldSkipJson = false) => ({
  kind: shouldUseEnumKind ? "PAGES" : "PAGE",
  html: await readFile(`${path}.html`, "utf-8"),
  pageData: shouldSkipJson ? {} : JSON.parse(await readFile(`${path}.json`, "utf-8")),
  headers: void 0,
  status: void 0,
  revalidate: initialRevalidateSeconds
});
var RSC_SEGMENTS_DIR_SUFFIX = ".segments";
var RSC_SEGMENT_SUFFIX = ".segment.rsc";
var buildAppCacheValue = async (path, shouldUseAppPageKind) => {
  const meta = JSON.parse(await readFile(`${path}.meta`, "utf-8"));
  const html = await readFile(`${path}.html`, "utf-8");
  if (shouldUseAppPageKind) {
    let segmentData;
    if (meta.segmentPaths) {
      const segmentsDir = path + RSC_SEGMENTS_DIR_SUFFIX;
      segmentData = Object.fromEntries(
        await Promise.all(
          meta.segmentPaths.map(async (segmentPath) => {
            const segmentDataFilePath = segmentsDir + segmentPath + RSC_SEGMENT_SUFFIX;
            const segmentContent = await readFile(segmentDataFilePath, "base64");
            return [segmentPath, segmentContent];
          })
        )
      );
    }
    return {
      kind: "APP_PAGE",
      html,
      rscData: await readFile(`${path}.rsc`, "base64").catch(
        () => readFile(`${path}.prefetch.rsc`, "base64")
      ),
      segmentData,
      ...meta
    };
  }
  const rsc = await readFile(`${path}.rsc`, "utf-8").catch(
    () => readFile(`${path}.prefetch.rsc`, "utf-8")
  );
  if (!meta.status && rsc.includes("NEXT_NOT_FOUND") && !(typeof meta.headers?.["x-next-cache-tags"] === "string" && meta.headers?.["x-next-cache-tags"].includes("/@"))) {
    meta.status = 404;
  }
  return {
    kind: "PAGE",
    html,
    pageData: rsc,
    ...meta
  };
};
var buildRouteCacheValue = async (path, initialRevalidateSeconds, shouldUseEnumKind) => ({
  kind: shouldUseEnumKind ? "APP_ROUTE" : "ROUTE",
  body: await readFile(`${path}.body`, "base64"),
  ...JSON.parse(await readFile(`${path}.meta`, "utf-8")),
  revalidate: initialRevalidateSeconds
});
var buildFetchCacheValue = async (path) => ({
  kind: "FETCH",
  ...JSON.parse(await readFile(path, "utf-8"))
});
var copyPrerenderedContent = async (ctx) => {
  return tracer.withActiveSpan("copyPrerenderedContent", async () => {
    try {
      await mkdir(ctx.blobDir, { recursive: true });
      const manifest = await ctx.getPrerenderManifest();
      const limitConcurrentPrerenderContentHandling = pLimit(10);
      const shouldUseAppPageKind = ctx.nextVersion ? (0, import_semver.satisfies)(ctx.nextVersion, ">=15.0.0-canary.13 <15.0.0-d || >15.0.0-rc.0", {
        includePrerelease: true
      }) : false;
      const shouldUseEnumKind = ctx.nextVersion ? (0, import_semver.satisfies)(ctx.nextVersion, ">=15.0.0-canary.114 <15.0.0-d || >15.0.0-rc.0", {
        includePrerelease: true
      }) : false;
      await Promise.all([
        ...Object.entries(manifest.routes).map(
          ([route, meta]) => limitConcurrentPrerenderContentHandling(async () => {
            const lastModified = meta.initialRevalidateSeconds ? Date.now() - 31536e6 : Date.now();
            const key = routeToFilePath(route);
            let value;
            switch (true) {
              // Parallel route default layout has no prerendered page
              case (meta.dataRoute?.endsWith("/default.rsc") && !existsSync(join(ctx.publishDir, "server/app", `${key}.html`))):
                return;
              case meta.dataRoute?.endsWith(".json"):
                if (manifest.notFoundRoutes.includes(route)) {
                  return;
                }
                value = await buildPagesCacheValue(
                  join(ctx.publishDir, "server/pages", key),
                  meta.initialRevalidateSeconds,
                  shouldUseEnumKind
                );
                break;
              case meta.dataRoute?.endsWith(".rsc"):
                value = await buildAppCacheValue(
                  join(ctx.publishDir, "server/app", key),
                  shouldUseAppPageKind
                );
                break;
              case meta.dataRoute === null:
                value = await buildRouteCacheValue(
                  join(ctx.publishDir, "server/app", key),
                  meta.initialRevalidateSeconds,
                  shouldUseEnumKind
                );
                break;
              default:
                throw new Error(`Unrecognized content: ${route}`);
            }
            if (value.kind === "PAGE" || value.kind === "PAGES" || value.kind === "APP_PAGE") {
              verifyNetlifyForms(ctx, value.html);
            }
            await writeCacheEntry(key, value, lastModified, ctx);
          })
        ),
        ...ctx.getFallbacks(manifest).map(
          (route) => limitConcurrentPrerenderContentHandling(async () => {
            const key = routeToFilePath(route);
            const value = await buildPagesCacheValue(
              join(ctx.publishDir, "server/pages", key),
              void 0,
              shouldUseEnumKind,
              true
              // there is no corresponding json file for fallback, so we are skipping it for this entry
            );
            await writeCacheEntry(key, value, Date.now(), ctx);
          })
        ),
        ...ctx.getShells(manifest).map(
          (route) => limitConcurrentPrerenderContentHandling(async () => {
            const key = routeToFilePath(route);
            const value = await buildAppCacheValue(
              join(ctx.publishDir, "server/app", key),
              shouldUseAppPageKind
            );
            await writeCacheEntry(key, value, Date.now(), ctx);
          })
        )
      ]);
      if (existsSync(join(ctx.publishDir, `server/app/_not-found.html`))) {
        const lastModified = Date.now();
        const key = "/404";
        const value = await buildAppCacheValue(
          join(ctx.publishDir, "server/app/_not-found"),
          shouldUseAppPageKind
        );
        await writeCacheEntry(key, value, lastModified, ctx);
      }
    } catch (error) {
      ctx.failBuild("Failed assembling prerendered content for upload", error);
    }
  });
};
var copyFetchContent = async (ctx) => {
  try {
    const paths = await (0, import_fast_glob.glob)(["!(*.*)"], {
      cwd: join(ctx.publishDir, "cache/fetch-cache"),
      extglob: true
    });
    await Promise.all(
      paths.map(async (key) => {
        const lastModified = Date.now() - 31536e6;
        const path = join(ctx.publishDir, "cache/fetch-cache", key);
        const value = await buildFetchCacheValue(path);
        await writeCacheEntry(key, value, lastModified, ctx);
      })
    );
  } catch (error) {
    ctx.failBuild("Failed assembling fetch content for upload", error);
  }
};
export {
  copyFetchContent,
  copyPrerenderedContent
};
