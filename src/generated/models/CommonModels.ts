/*!
 * Copyright (C) Microsoft Corporation. All rights reserved.
 * Common model interfaces shared across all generated services.
 * Matches the shape expected by @microsoft/power-apps/data getClient.
 */

/** Options for retrieving a single record */
export interface IGetOptions {
  select?: string[];
  expand?: string[];
}

/** Options for retrieving multiple records */
export interface IGetAllOptions {
  select?: string[];
  filter?: string;
  orderBy?: string[];
  top?: number;
  expand?: string[];
}
