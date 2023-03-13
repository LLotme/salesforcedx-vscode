/*
 * Copyright (c) 2023, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { Connection, Org, SfProject } from '@salesforce/core';
import {
  SourceTracking,
  SourceTrackingOptions
} from '@salesforce/source-tracking';

export class SourceTrackingService {
  public static async createSourceTracking(
    projectPath: string,
    connection: Connection
  ): Promise<SourceTracking> {
    // Since SourceTracking is initialized with an SfProject, which
    // contains the project path, and PR #4643 made it so that VSCE is
    // running with process.cwd set as the project root, there
    // is no need to call process.chdir here as has been done in VSCE
    // with other core types like Config and ConfigAggregator.
    const project = await SfProject.resolve(projectPath);
    const org = await Org.create({ connection });
    const options: SourceTrackingOptions = {
      org,
      project,
      ignoreLocalCache: false,
      subscribeSDREvents: true,
      ignoreConflicts: false
    };
    const sourceTracking = await SourceTracking.create(options);
    return sourceTracking;
  }
}