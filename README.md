
Start with installing ts-jest - https://kulshekhar.github.io/ts-jest/docs/getting-started/installation

- Also add the script tag to package.json so 'npm test' will work
  - "scripts": { "test": "jest" }

Build directory structure:

- src/main for code
- src/test/unit for unit tests
- build for target

Create the tsconfig.json from File/New...

- change target to "es6"
- add "outDir": "build" to "compilerOptions"
- indicate typescript directories with "include":["src/**/*]

Start writing code:
- For each class AClass accessible elsewhere, add at end:
  - exports.AClass = AClass
- For a corresponding test for AClass:
  - create a_class.test.ts file
  - on the first line, "const a_class = require(../../main/a_class")
  - AClass can be instantiated with the a_class prefix:
    - new a_class.AClass()