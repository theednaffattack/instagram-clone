# Instagram Clone

A monorepo with the app server and client for an Insta clone.

### Yarn with PnP

I've come to the conclusion it's too painful to use at this time. I never got it to work properly.

#### Setup

1. Delete all existing build files and yarn specific files: `./.dist/` & `./node_modules/` & `./yarn.lock`

2. Install classic yarn as a global node module, even if yarn is installed globally via the yarn windows installer exe
   `npm install -g yarn`

   - Ignore the fact that it says `v1.22.4` or similar

3. From the project root, run:

   1. `yarn set version berry && yarn set version latest`
   2. `yarn dlx @yarnpkg/sdks vscode` for vscode support https://next.yarnpkg.com/advanced/editor-sdks#vscode
   3. `yarn install`

4. Read about migrating version 2 here: https://yarnpkg.com/advanced/migration

   1. Run the doctor to see if it offers up anything helpful
      `yarn dlx @yarnpkg/doctor .`
   2. PLACEHOLDER LIST ITEM
      `PLACEHOLDER COMMAND EXAMPLE`

5. Install some plugins https://yarnpkg.com/api/modules/plugin_typescript.html
   Many of the documented commands come from these, and IMO it's easy to miss that these are addons

   ```
     yarn plugin import typescript           
     yarn plugin import workspace-tools      # Adds `yarn workspace foreach` https://yarnpkg.com/cli/workspaces/foreach
     yarn plugin import exec                 #                               https://yarnpkg.com/cli/exec
     # adds `yarn upgrade-interactive`.  Needed because `yarn upgrade --latest` is broken for workspaces. 
     # Might be fixed in V2, but I haven't had the chance to check and better safe than sorry
     # https://github.com/yarnpkg/yarn/issues/4442#issuecomment-559117268
     yarn plugin import interactive-tools
     yarn plugin import constraints          # Seems like it could be useful   https://yarnpkg.com/features/constraints
     yarn plugin import version              # also seems like could be useful https://yarnpkg.com/features/release-workflow
   ```

#### Samples of Commands

|                                                              |                                       |                                                              |
| ------------------------------------------------------------ | ------------------------------------- | ------------------------------------------------------------ |
| Check workspace setup * Note: It's no longer easily readable for humans | `yarn workspaces list --json -v`      | [![img](https://camo.githubusercontent.com/fbbb1ba719bd4b4b24f22851158a941defb6ae0f5128a214e3c6d0dacb2684c1/68747470733a2f2f692e696d6775722e636f6d2f685256684b58692e706e67)](https://camo.githubusercontent.com/fbbb1ba719bd4b4b24f22851158a941defb6ae0f5128a214e3c6d0dacb2684c1/68747470733a2f2f692e696d6775722e636f6d2f685256684b58692e706e67) |
| **(BROKEN)** Run script command defined in package.json for a specific workspace There's no longer an easy built in way to do this. Be sure to install plugin `workspace-tools` | `yarn workspaces foreach -t run test` | [![img](https://camo.githubusercontent.com/8554871cda30434a9ba7cfcace4d2520b6a4b7cba5122dd1b9e77089ff5eb263/68747470733a2f2f692e696d6775722e636f6d2f6a61566559654f2e706e67)](https://camo.githubusercontent.com/8554871cda30434a9ba7cfcace4d2520b6a4b7cba5122dd1b9e77089ff5eb263/68747470733a2f2f692e696d6775722e636f6d2f6a61566559654f2e706e67) |

------
