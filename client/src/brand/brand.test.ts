import { describe, expect, it } from "vitest";
import { brandAssets, brandAspectRatios } from "./assets";
import { brandColors, brandThemeColor } from "./colors";
import { brandMetadata } from "./metadata";
import {
  logoDimensions,
  resolveLogoSrc,
  resolveSymbolSrc,
  symbolDimensions,
} from "./resolve";
import {
  resolveBrandSize,
  resolveSymbolLevel,
  symbolMinSize,
} from "./tokens";

describe("ContentFy brand layer", () => {
  it("exposes official SVG paths under /brand/svg", () => {
    expect(brandAssets.svg.master).toBe("/brand/svg/master.svg");
    expect(brandAssets.svg.compact).toBe("/brand/svg/compact.svg");
    expect(brandAssets.svg.micro).toBe("/brand/svg/micro.svg");
    expect(brandAssets.svg.favicon).toBe("/brand/svg/favicon.svg");
    expect(brandAssets.svg.avatar).toBe("/brand/svg/avatar.svg");
    expect(brandAssets.svg.logoHorizontal).toBe("/brand/svg/logo-horizontal.svg");
    expect(brandAssets.svg.logoVertical).toBe("/brand/svg/logo-vertical.svg");
    expect(brandAssets.svg.monoDark).toBe("/brand/svg/mono-dark.svg");
    expect(brandAssets.svg.monoLight).toBe("/brand/svg/mono-light.svg");
  });

  it("resolves horizontal lockups for light and dark without CSS filters", () => {
    expect(resolveLogoSrc("horizontal", "dark")).toBe(
      brandAssets.svg.logoHorizontal
    );
    expect(resolveLogoSrc("horizontal", "light")).toBe(
      brandAssets.svg.logoHorizontalOnLight
    );
    expect(resolveLogoSrc("vertical", "dark")).toBe(
      brandAssets.svg.logoVertical
    );
  });

  it("resolves master / compact / micro symbols", () => {
    expect(resolveSymbolSrc("master", "dark", 128).src).toBe(
      brandAssets.svg.master
    );
    expect(resolveSymbolSrc("compact", "dark", 48).src).toBe(
      brandAssets.svg.compact
    );
    expect(resolveSymbolSrc("micro", "dark", 20).src).toBe(
      brandAssets.svg.micro
    );
  });

  it("never keeps Master below the approved minimum size", () => {
    const downgraded = resolveSymbolLevel("master", 24);
    expect(downgraded).not.toBe("master");
    expect(resolveSymbolLevel("auto", 128)).toBe("master");
    expect(resolveSymbolLevel("auto", 48)).toBe("compact");
    expect(resolveSymbolLevel("auto", 20)).toBe("micro");
    expect(symbolMinSize.master).toBe(96);
  });

  it("preserves aspect ratios (no distortion math)", () => {
    const logo = logoDimensions("horizontal", 52);
    // Integer px rounding is expected; stay within 1% of the SVG viewBox ratio.
    expect(logo.width / logo.height).toBeCloseTo(
      brandAspectRatios.logoHorizontal,
      1
    );
    const symbol = symbolDimensions(32);
    expect(symbol.width / symbol.height).toBeCloseTo(
      brandAspectRatios.symbol,
      1
    );
  });

  it("resolves size presets and numeric sizes", () => {
    expect(resolveBrandSize("md")).toBe(32);
    expect(resolveBrandSize(40)).toBe(40);
    expect(resolveBrandSize("24px")).toBe(24);
  });

  it("keeps frozen brand colors and metadata", () => {
    expect(brandColors.orange).toBe("#F97316");
    expect(brandColors.midnight).toBe("#070B12");
    expect(brandThemeColor).toBe("#070B12");
    expect(brandMetadata.name).toBe("ContentFy");
    expect(brandMetadata.accessibleLabel).toContain("ContentFy");
  });

  it("maps monochrome themes to official mono assets", () => {
    expect(resolveLogoSrc("horizontal", "monochrome-light")).toBe(
      brandAssets.svg.monoLight
    );
    expect(resolveSymbolSrc("compact", "monochrome-dark", 40).src).toBe(
      brandAssets.svg.monoDark
    );
  });
});
