import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { parse } from "yaml";
import { DEFAULT_BRAND as rendererBrand, brandVars } from "../src/lib/brand";
import { DEFAULT_BRAND as serverBrand, brandSchema } from "../server/brand.ts";
import { APP_NAME, APP_REPOSITORY, FEEDBACK_URL } from "../src/lib/app-links";
import { PRODUCT_BRAND, PRODUCT_NAME, PRODUCT_REPOSITORY, PRODUCT_TAGLINE } from "./product-brand.ts";

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

describe("GMDA product identity", () => {
  it("keeps renderer and server defaults aligned without changing theme palettes", () => {
    expect(PRODUCT_NAME).toBe("GMDA");
    expect(PRODUCT_TAGLINE).toBe("Your AI team. Your control.");
    expect(rendererBrand).toEqual(PRODUCT_BRAND);
    expect(serverBrand).toEqual(PRODUCT_BRAND);
    expect(brandSchema.parse(PRODUCT_BRAND)).toEqual(PRODUCT_BRAND);
    expect(brandVars(PRODUCT_BRAND)).toEqual({});
  });

  it("uses GMDA metadata and destinations rather than upstream product releases", () => {
    const manifest = JSON.parse(read("public/manifest.webmanifest"));
    const pkg = JSON.parse(read("package.json"));
    expect(APP_NAME).toBe(PRODUCT_NAME);
    expect(APP_REPOSITORY).toBe(PRODUCT_REPOSITORY);
    expect(FEEDBACK_URL).toBe(`${PRODUCT_REPOSITORY}/issues`);
    expect(manifest.name).toBe(PRODUCT_NAME);
    expect(manifest.short_name).toBe(PRODUCT_NAME);
    expect(manifest.description).toBe(PRODUCT_TAGLINE);
    expect(pkg.name).toBe("openmausbot");
    expect(pkg.repository.url).toBe(`${PRODUCT_REPOSITORY}.git`);
    expect(read("index.html")).toContain(`<title>${PRODUCT_NAME}</title>`);
    expect(read("public/app-icon.svg")).toContain(`<title id="title">${PRODUCT_NAME}</title>`);
  });

  it("brands desktop packages and the update feed but preserves compatibility identifiers", () => {
    const builder = parse(read("electron-builder.yml"));
    expect(builder.productName).toBe(PRODUCT_NAME);
    expect(builder.artifactName).toMatch(/^GMDA-/);
    expect(builder.publish).toEqual([{ provider: "github", owner: "arthurwang110505-debug", repo: "GMDA-bot" }]);
    expect(builder.appId).toBe("com.openmausbot.app");
    expect(builder.protocols[0].schemes).toEqual(["openmausbot"]);
  });

  it("ships matching web and desktop PNG icons at the required dimensions", () => {
    for (const [path, size] of [
      ["public/app-icon-192.png", 192],
      ["public/app-icon-512.png", 512],
      ["public/apple-touch-icon.png", 180],
      ["electron/resources/app-icon.png", 512],
    ] as const) {
      const png = readFileSync(new URL(`../${path}`, import.meta.url));
      expect(png.subarray(1, 4).toString()).toBe("PNG");
      expect(png.readUInt32BE(16)).toBe(size);
      expect(png.readUInt32BE(20)).toBe(size);
    }
    expect(readFileSync(new URL("../public/app-icon-512.png", import.meta.url)))
      .toEqual(readFileSync(new URL("../electron/resources/app-icon.png", import.meta.url)));
  });
});
