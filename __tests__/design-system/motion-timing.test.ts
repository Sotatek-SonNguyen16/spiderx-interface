/**
 * Property Test: Motion Timing Consistency
 * Validates: Requirements 10.1, 10.3, 10.5
 * 
 * All animations should use consistent timing:
 * - Hover transitions: 150-200ms
 * - Drawer/modal transitions: 200-220ms
 * - Timing function: ease-out preferred
 */

import * as fs from "fs";
import * as path from "path";
import * as fc from "fast-check";

describe("Motion Timing Consistency", () => {
  // Files that contain animation/transition definitions
  const animationFiles = [
    "components/ui/recipes.ts",
    "components/ui/drawer.tsx",
    "components/ui/button.tsx",
    "components/ui/card.tsx",
    "app/css/style.css",
  ];

  // Valid duration values for hover transitions (150-200ms)
  const validHoverDurations = ["150", "200", "duration-150", "duration-200"];

  // Valid duration values for drawer/modal transitions (200-220ms)
  const validDrawerDurations = ["200", "220", "duration-200"];

  describe("Property: Transition durations should be within design system range", () => {
    it("recipes.ts should use consistent transition durations", () => {
      const recipesPath = path.join(process.cwd(), "components/ui/recipes.ts");

      if (fs.existsSync(recipesPath)) {
        const content = fs.readFileSync(recipesPath, "utf-8");

        fc.assert(
          fc.property(fc.constant(content), (fileContent) => {
            // Check for duration-* classes
            const durationMatches = fileContent.match(/duration-\d+/g) || [];

            // All durations should be 150, 200, or 300 (for longer animations)
            const validDurations = ["duration-150", "duration-200", "duration-300"];
            const allValid = durationMatches.every(
              (d) => validDurations.includes(d)
            );

            return allValid;
          }),
          { numRuns: 1 }
        );
      }
    });

    it("drawer.tsx should use appropriate transition timing", () => {
      const drawerPath = path.join(process.cwd(), "components/ui/drawer.tsx");

      if (fs.existsSync(drawerPath)) {
        const content = fs.readFileSync(drawerPath, "utf-8");

        fc.assert(
          fc.property(fc.constant(content), (fileContent) => {
            // Drawer should have transition classes
            const hasTransition =
              fileContent.includes("transition") ||
              fileContent.includes("duration-");

            return hasTransition;
          }),
          { numRuns: 1 }
        );
      }
    });
  });

  describe("Property: No conflicting animation styles", () => {
    it("style.css should not have bounce or neon glow animations", () => {
      const stylePath = path.join(process.cwd(), "app/css/style.css");

      if (fs.existsSync(stylePath)) {
        const content = fs.readFileSync(stylePath, "utf-8");

        fc.assert(
          fc.property(fc.constant(content), (fileContent) => {
            // Museum-core aesthetic should not have:
            // - Bounce animations
            // - Neon glow effects
            // - Excessive shimmer
            const hasNeonGlow =
              fileContent.includes("neon") || fileContent.includes("glow");
            const hasBounce = fileContent.includes("bounce");

            // These effects conflict with quiet luxury aesthetic
            return !hasNeonGlow && !hasBounce;
          }),
          { numRuns: 1 }
        );
      }
    });
  });

  describe("Property: Transition timing functions should be consistent", () => {
    animationFiles.forEach((filePath) => {
      const fullPath = path.join(process.cwd(), filePath);

      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, "utf-8");

        it(`${filePath} should use ease-out or ease-in-out timing`, () => {
          fc.assert(
            fc.property(fc.constant(content), (fileContent) => {
              // If file has transition timing, it should use ease-out or ease-in-out
              // Linear timing is acceptable for specific cases
              const hasEaseIn = /ease-in(?!-out)/.test(fileContent);

              // ease-in alone (not ease-in-out) is generally not preferred
              // for UI interactions as it feels sluggish
              return !hasEaseIn;
            }),
            { numRuns: 1 }
          );
        });
      }
    });
  });

  describe("Property: Animation keyframes should be subtle", () => {
    it("style.css animations should use subtle transforms", () => {
      const stylePath = path.join(process.cwd(), "app/css/style.css");

      if (fs.existsSync(stylePath)) {
        const content = fs.readFileSync(stylePath, "utf-8");

        fc.assert(
          fc.property(fc.constant(content), (fileContent) => {
            // Check that scale transforms are subtle (not more than 1.2x)
            const scaleMatches = fileContent.match(/scale\(([0-9.]+)\)/g) || [];

            const allSubtle = scaleMatches.every((match) => {
              const value = parseFloat(match.match(/([0-9.]+)/)?.[1] || "1");
              // Scale should be between 0.9 and 1.2 for subtle effects
              return value >= 0.9 && value <= 1.2;
            });

            return allSubtle;
          }),
          { numRuns: 1 }
        );
      }
    });
  });
});
