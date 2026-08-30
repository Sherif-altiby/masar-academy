import { Level } from "@prisma/client";

/** Maps the frontend's kebab-case level values (e.g. "prep-1") to the Prisma enum. */
export const LEVEL_SLUG_TO_ENUM: Record<string, Level> = {
  "primary-5": "PRIMARY_5",
  "primary-6": "PRIMARY_6",
  "prep-1": "PREP_1",
  "prep-2": "PREP_2",
  "prep-3": "PREP_3",
  "sec-1": "SEC_1",
  "sec-2": "SEC_2",
  "sec-3": "SEC_3",
};

export const LEVEL_ENUM_TO_SLUG: Record<Level, string> = {
  PRIMARY_5: "primary-5",
  PRIMARY_6: "primary-6",
  PREP_1: "prep-1",
  PREP_2: "prep-2",
  PREP_3: "prep-3",
  SEC_1: "sec-1",
  SEC_2: "sec-2",
  SEC_3: "sec-3",
};

export const LEVEL_SLUGS = Object.keys(LEVEL_SLUG_TO_ENUM) as [string, ...string[]];
