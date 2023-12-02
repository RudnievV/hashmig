#!/usr/bin/env node

import '../env';
import Interact from './Interact';

(async () => {
  return new Interact().main();
})();
