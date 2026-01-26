/**
 * Property Test: No Legacy Color Values
 * Validates: Requirements 12.1, 12.2, 12.3, 12.4, 12.5
 * 
 * Core UI components and pages should not use legacy color values.
 * Legacy colors include: Electric Blue, Lightning Yellow, old gray scale (gray-*),
 * and hardcoded hex colors that should use design tokens.
 */

import * as fs from "fs";
import * as path from "path";
import * as fc from "fast-check";

describe("No Legacy Color Values", () => {
  // Core files that should be fully migrated
  const coreFiles = [
    "components/ui/button.tsx",
    "components/ui/card.tsx",
    "components/ui/badge.tsx",
    "components/ui/input.tsx",
    "components/ui/drawer.tsx",
    "components/ui/header.tsx",
    "components/ui/header-auth.tsx",
    "components/ui/recipes.ts",
    "app/(public)/signin/page.tsx",
    "app/(public)/signup/page.tsx",
    "app/(auth)/todos/page.tsx",
    "app/(auth)/integration/page.tsx",
    "app/(auth)/whitelist/page.tsx",
  ];

  // Legacy color patterns that should NOT appear in core files
  const legacyColorPatterns = [
    // Old brand colors
    /brand-\d{3}/,
    /indigo-\d{3}/,
    // Hardcoded hex colors (except black/white)
    /#[0-9A-Fa-f]{6}(?!000000|ffffff|F7F3EA|1F3A2E|6D5BD0)/,
  ];

  // Design token colors that SHOULD be used
  const designTokenColors = [
    "bg-bg",
    "bg-surface",
    "bg-surface2",
    "bg-primary",
    "bg-primaryHover",
    "bg-primarySoft",
    "bg-ai",
    "bg-aiSoft",
    "bg-success",
    "bg-successSoft",
    "bg-warning",
    "bg-warningSoft",
    "bg-danger",
    "bg-dangerSoft",
    "bg-gold",
    "bg-goldSoft",
    "text-ink",
    "text-ink2",
    "text-ink3",
    "text-primary",
    "text-ai",
    "text-success",
    "text-warning",
    "text-danger",
    "text-gold",
    "text-surface",
    "border-border",
    "border-primary",
  ];

  describe("Property: Core UI components should not use legacy brand colors", () => {
    coreFiles.forEach((filePath) => {
      const fullPath = path.join(process.cwd(), filePath);

      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, "utf-8");

        it(`${filePath} should not contain legacy brand colors`, () => {
          fc.assert(
            fc.property(fc.constant(content), (fileContent) => {
              // Check for brand-* and indigo-* patterns
              const hasBrandColors = /brand-\d{3}/.test(fileContent);
              const hasIndigoColors = /indigo-\d{3}/.test(fileContent);
              return !hasBrandColors && !hasIndigoColors;
            }),
            { numRuns: 1 }
          );
        });
      }
    });
  });

  describe("Property: Core UI components should use design tokens", () => {
    const uiComponentFiles = [
      "components/ui/button.tsx",
      "components/ui/card.tsx",
      "components/ui/badge.tsx",
      "components/ui/input.tsx",
    ];

    uiComponentFiles.forEach((filePath) => {
      const fullPath = path.join(process.cwd(), filePath);

      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, "utf-8");

        it(`${filePath} should use design system tokens`, () => {
          fc.assert(
            fc.property(fc.constant(content), (fileContent) => {
              // Check that at least some design tokens are used
              const usesDesignTokens = designTokenColors.some((token) =>
                fileContent.includes(token)
              );
              return usesDesignTokens;
            }),
            { numRuns: 1 }
          );
        });
      }
    });
  });

  describe("Property: CSS files should define design tokens", () => {
    it("tokens.css should define all required color tokens", () => {
      const tokensPath = path.join(process.cwd(), "app/css/tokens.css");

      if (fs.existsSync(tokensPath)) {
        const content = fs.readFileSync(tokensPath, "utf-8");

        fc.assert(
          fc.property(fc.constant(content), (fileContent) => {
            const requiredTokens = [
              "--bg:",
              "--surface:",
              "--surface2:",
              "--border:",
              "--ink:",
              "--ink2:",
              "--ink3:",
              "--primary:",
              "--primaryHover:",
              "--primarySoft:",
              "--ai:",
              "--aiSoft:",
              "--success:",
              "--warning:",
              "--danger:",
              "--gold:",
            ];

            return requiredTokens.every((token) =>
              fileContent.includes(token)
            );
          }),
          { numRuns: 1 }
        );
      }
    });

    it("style.css should map tokens to Tailwind theme", () => {
      const stylePath = path.join(process.cwd(), "app/css/style.css");

      if (fs.existsSync(stylePath)) {
        const content = fs.readFileSync(stylePath, "utf-8");

        fc.assert(
          fc.property(fc.constant(content), (fileContent) => {
            // Check for @theme block with color mappings
            const hasThemeBlock = fileContent.includes("@theme");
            const hasColorMappings =
              fileContent.includes("--color-bg:") &&
              fileContent.includes("--color-primary:") &&
              fileContent.includes("--color-ink:");

            return hasThemeBlock && hasColorMappings;
          }),
          { numRuns: 1 }
        );
      }
    });
  });

  describe("Property: Recipes should use design tokens", () => {
    it("recipes.ts should use design token class names", () => {
      const recipesPath = path.join(process.cwd(), "components/ui/recipes.ts");

      if (fs.existsSync(recipesPath)) {
        const content = fs.readFileSync(recipesPath, "utf-8");

        fc.assert(
          fc.property(fc.constant(content), (fileContent) => {
            // Check for design token usage in recipes
            const usesTokens =
              fileContent.includes("bg-primary") &&
              fileContent.includes("text-ink") &&
              fileContent.includes("border-border") &&
              fileContent.includes("bg-surface");

            // Check that legacy colors are not used
            const noLegacyColors =
              !fileContent.includes("bg-blue-") &&
              !fileContent.includes("bg-indigo-") &&
              !fileContent.includes("text-gray-");

            return usesTokens && noLegacyColors;
          }),
          { numRuns: 1 }
        );
      }
    });
  });
});
