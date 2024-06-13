import { jest } from '@jest/globals'

import * as dotenv from 'dotenv';
import '@testing-library/jest-dom';

global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;

dotenv.config({ path: ['.env', '.env.local', '.env.test'] });