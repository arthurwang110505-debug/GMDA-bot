import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { Resvg } from "@resvg/resvg-js";

const root = new URL("../", import.meta.url);
const svg = readFileSync(new URL("public/app-icon.svg", root), "utf8");
const png = (size) => new Resvg(svg, { fitTo: { mode: "width", value: size } }).render().asPng();
const write = (path, data) => writeFileSync(fileURLToPath(new URL(path, root)), data);

for (const [path, size] of [
  ["public/app-icon-192.png", 192],
  ["public/app-icon-512.png", 512],
  ["public/apple-touch-icon.png", 180],
  ["electron/resources/app-icon.png", 512],
  ["build/icon-1024.png", 1024],
]) write(path, png(size));
write("build/icon.svg", svg);

for (const size of [16, 32, 128, 256, 512]) {
  write(`build/icon.iconset/icon_${size}x${size}.png`, png(size));
  write(`build/icon.iconset/icon_${size}x${size}@2x.png`, png(size * 2));
}

const icoSizes = [16, 32, 48, 64, 128, 256];
const header = Buffer.alloc(6 + icoSizes.length * 16);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(icoSizes.length, 4);
let offset = header.length;
const images = icoSizes.map((size, index) => {
  const image = png(size);
  const entry = 6 + index * 16;
  header[entry] = size === 256 ? 0 : size;
  header[entry + 1] = header[entry];
  header.writeUInt16LE(1, entry + 4);
  header.writeUInt16LE(32, entry + 6);
  header.writeUInt32LE(image.length, entry + 8);
  header.writeUInt32LE(offset, entry + 12);
  offset += image.length;
  return image;
});
write("build/icon.ico", Buffer.concat([header, ...images]));

const chunks = [["icp4", 16], ["icp5", 32], ["icp6", 64], ["ic07", 128], ["ic08", 256], ["ic09", 512], ["ic10", 1024]].map(([type, size]) => {
  const image = png(size);
  const chunk = Buffer.alloc(8);
  chunk.write(type);
  chunk.writeUInt32BE(image.length + 8, 4);
  return Buffer.concat([chunk, image]);
});
const icnsHeader = Buffer.alloc(8);
icnsHeader.write("icns");
icnsHeader.writeUInt32BE(8 + chunks.reduce((total, chunk) => total + chunk.length, 0), 4);
write("build/icon.icns", Buffer.concat([icnsHeader, ...chunks]));
