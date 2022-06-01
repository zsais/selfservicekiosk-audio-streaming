/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
import * as dotenv from 'dotenv';
import * as uuid from 'uuid';
import * as pb from 'pb-util';
import { text } from 'express';

const df = require('dialogflow').v3beta1;

const projectId = 'rm-workshop';
const location = 'global';
const agentId = 'ec76f9c4-c48e-4206-9b35-4e857d0a9fd5';
const query = 'Hello, How can I get a loan?';
const languageCode = 'en'

const {SessionsClient} = require('@google-cloud/dialogflow-cx');
// const client = new SessionsClient();

dotenv.config();

export class Dialogflow {
  private projectId: string;
  private languageCode: string;
  private request: any;
  private sessionClient: any;
  private sessionPath: any;
  private sessionId: string;
    
  constructor() {
      this.languageCode = process.env.LANGUAGE_CODE;
      this.projectId = process.env.PROJECT_ID;
      this.setupDialogflow();
  }

 /*
  * Setup the Dialogflow Agent
  */
  public setupDialogflow() {
      this.sessionId = uuid.v4();
      this.sessionClient = new SessionsClient();
    //   const client = new SessionsClient();
    //   this.sessionClient = new df.SessionsClient();
      this.sessionPath = this.sessionClient.projectLocationAgentSessionPath(
        projectId,
        location,
        agentId,
        this.sessionId
      );

      this.request = {
        session: this.sessionPath,
        queryInput: {
          text: {
              text: query,
          },
          languageCode
        }
      }
  }

 /*
  * Detect Intent based on Text String
  * @param audio file buffer
  * @param cb Callback function to execute with results
  */
  public async detectIntent(text: string){
    this.request.queryInput.text.text = text;
    // const responses = await this.sessionClient.detectIntent(this.request);

    var json:DF_RESULT = {};
    
    // console.log("RESPONSES:")
    // console.log(responses)

    const [response] = await this.sessionClient.detectIntent(this.request);
    console.log(`User Query: ${text}`);

    var FULFILLMENT_TEXT = "a"

    console.log("LIST:")


    console.log(response.queryResult.responseMessages[0].text.text)

    for (const message of response.queryResult.responseMessages) {
          console.log(`Agent Response: ${message.text.text}`);
          FULFILLMENT_TEXT = message.text.text;
      }

      if (response.queryResult.match.intent) {
        console.log(
          `Matched Intent: ${response.queryResult.match.intent.displayName}`
        );
      }
      console.log(
        `Current Page: ${response.queryResult.currentPage.displayName}`
      );


    const INTENT_NAME = response.queryResult.currentPage.displayName;

    json = {
        INTENT_NAME,
        FULFILLMENT_TEXT
    }
    return json
  }
}

declare interface DF_RESULT {
  INTENT_NAME?: string,
  FULFILLMENT_TEXT?: string,
  TRANSLATED_FULFILLMENT?: string,
}

export let dialogflow = new Dialogflow();
