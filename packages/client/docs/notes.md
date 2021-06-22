# Notes

## Odd Adjustments

### Linaria (styling dependency)

#### Next.js config

**THIS WORKS!!!**

Next.config.js needs to be adjusted in order to use Linaria. See [this comment](https://github.com/callstack/linaria/issues/724#issuecomment-853063166)

#### Possible tsconfig.json issue

` Error: Using the "css" tag in runtime is not supported. Make sure you have set up the Babel plugin correctly.`

https://github.com/callstack/linaria/issues/197#issuecomment-504933755

## Package warnings

warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @chakra-ui/react@0.8.0" has unmet peer dependency "@emotion/core@10.x".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @chakra-ui/react@0.8.0" has unmet peer dependency "@emotion/styled@10.x".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @chakra-ui/react@0.8.0" has unmet peer dependency "emotion-theming@10.x".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @chakra-ui/icons@1.0.13" has unmet peer dependency "@chakra-ui/system@>=1.0.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @chakra-ui/theme@1.9.1" has unmet peer dependency "@chakra-ui/system@>=1.0.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > next-seo@4.24.0" has incorrect peer dependency "next@^8.1.1-canary.54 || ^9.0.0 || ^10.0.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @graphql-codegen/cli@1.21.5" has unmet peer dependency "graphql@^0.8.0 || ^0.9.0 || ^0.10.0 || ^0.11.0 || ^0.12.0 || ^0.13.0 || ^14.0.0 || ^15.0.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @graphql-codegen/typescript@1.22.2" has unmet peer dependency "graphql@^0.12.0 || ^0.13.0 || ^14.0.0 || ^15.0.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @graphql-codegen/typescript-operations@1.18.1" has unmet peer dependency "graphql@^0.8.0 || ^0.9.0 || ^0.10.0 || ^0.11.0 || ^0.12.0 || ^0.13.0 || ^14.0.0 || ^15.0.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @graphql-codegen/typescript-react-apollo@2.2.6" has unmet peer dependency "graphql@^0.8.0 || ^0.9.0 || ^0.10.0 || ^0.11.0 || ^0.12.0 || ^0.13.0 || ^14.0.0 || ^15.0.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @graphql-codegen/typescript-react-apollo@2.2.6" has unmet peer dependency "graphql-tag@^2.0.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/server > class-validator@0.12.0" has unmet peer dependency "tslib@>=1.9.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/server > zapatos@4.0.1" has unmet peer dependency "@types/pg@>=7.14.3".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @chakra-ui/react > @reach/auto-id@0.10.2" has incorrect peer dependency "react@^16.8.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @chakra-ui/react > @reach/auto-id@0.10.2" has incorrect peer dependency "react-dom@^16.8.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @chakra-ui/react > toasted-notes@3.2.0" has incorrect peer dependency "react@^16.8.4".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @chakra-ui/react > toasted-notes@3.2.0" has incorrect peer dependency "react-dom@^16.8.4".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @chakra-ui/react > use-dark-mode@2.3.1" has incorrect peer dependency "react@^16.8.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @chakra-ui/icons > @chakra-ui/icon@1.1.9" has unmet peer dependency "@chakra-ui/system@>=1.0.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @chakra-ui/theme > @chakra-ui/theme-tools@1.1.7" has unmet peer dependency "@chakra-ui/system@>=1.0.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @zeit/next-css > css-loader@1.0.0" has unmet peer dependency "webpack@^4.0.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @zeit/next-css > mini-css-extract-plugin@0.4.3" has unmet peer dependency "webpack@^4.4.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @graphql-codegen/cli > @graphql-codegen/core@1.17.10" has unmet peer dependency "graphql@^0.8.0 || ^0.9.0 || ^0.10.0 || ^0.11.0 || ^0.12.0 || ^0.13.0 || ^14.0.0 || ^15.0.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @graphql-codegen/cli > @graphql-codegen/plugin-helpers@1.18.7" has unmet peer dependency "graphql@^0.8.0 || ^0.9.0 || ^0.10.0 || ^0.11.0 || ^0.12.0 || ^0.13.0 || ^14.0.0 || ^15.0.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @graphql-codegen/cli > @graphql-tools/apollo-engine-loader@6.2.5" has unmet peer dependency "graphql@^14.0.0 || ^15.0.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @graphql-codegen/cli > @graphql-tools/code-file-loader@6.3.1" has unmet peer dependency "graphql@^14.0.0 || ^15.0.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @graphql-codegen/cli > @graphql-tools/git-loader@6.2.6" has unmet peer dependency "graphql@^14.0.0 || ^15.0.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @graphql-codegen/cli > @graphql-tools/github-loader@6.2.5" has unmet peer dependency "graphql@^14.0.0 || ^15.0.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @graphql-codegen/cli > @graphql-tools/graphql-file-loader@6.2.7" has unmet peer dependency "graphql@^14.0.0 || ^15.0.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @graphql-codegen/cli > @graphql-tools/json-file-loader@6.2.6" has unmet peer dependency "graphql@^14.0.0 || ^15.0.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @graphql-codegen/cli > @graphql-tools/load@6.2.8" has unmet peer dependency "graphql@^14.0.0 || ^15.0.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @graphql-codegen/cli > @graphql-tools/prisma-loader@6.3.0" has unmet peer dependency "graphql@^14.0.0 || ^15.0.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @graphql-codegen/cli > @graphql-tools/url-loader@6.10.1" has unmet peer dependency "graphql@^14.0.0 || ^15.0.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @graphql-codegen/cli > @graphql-tools/utils@7.10.0" has unmet peer dependency "graphql@^14.0.0 || ^15.0.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @graphql-codegen/cli > graphql-config@3.3.0" has unmet peer dependency "graphql@^0.11.0 || ^0.12.0 || ^0.13.0 || ^14.0.0 || ^15.0.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @graphql-codegen/typescript > @graphql-codegen/visitor-plugin-common@1.21.1" has unmet peer dependency "graphql@^0.8.0 || ^0.9.0 || ^0.10.0 || ^0.11.0 || ^0.12.0 || ^0.13.0 || ^14.0.0 || ^15.0.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @linaria/webpack-loader > @linaria/webpack5-loader@3.0.0-beta.6" has unmet peer dependency "webpack@>=5".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @chakra-ui/react > @reach/auto-id > @reach/utils@0.10.5" has incorrect peer dependency "react@^16.8.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @chakra-ui/react > @reach/auto-id > @reach/utils@0.10.5" has incorrect peer dependency "react-dom@^16.8.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @chakra-ui/react > toasted-notes > @reach/alert@0.1.5" has incorrect peer dependency "react@^16.8.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @chakra-ui/react > toasted-notes > @reach/alert@0.1.5" has incorrect peer dependency "react-dom@^16.8.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @chakra-ui/react > use-dark-mode > @use-it/event-listener@0.1.6" has incorrect peer dependency "react@^16.8.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @graphql-codegen/cli > @graphql-codegen/core > @graphql-tools/merge@6.2.14" has unmet peer dependency "graphql@^14.0.0 || ^15.0.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @graphql-codegen/cli > @graphql-tools/code-file-loader > @graphql-tools/graphql-tag-pluck@6.5.1" has unmet peer dependency "graphql@^14.0.0 || ^15.0.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @graphql-codegen/cli > @graphql-tools/graphql-file-loader > @graphql-tools/import@6.3.1" has unmet peer dependency "graphql@^14.0.0 || ^15.0.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @graphql-codegen/cli > @graphql-tools/prisma-loader > graphql-request@3.4.0" has unmet peer dependency "graphql@14.x || 15.x".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @graphql-codegen/cli > @graphql-tools/url-loader > @graphql-tools/delegate@7.1.5" has unmet peer dependency "graphql@^14.0.0 || ^15.0.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @graphql-codegen/cli > @graphql-tools/url-loader > @graphql-tools/wrap@7.0.8" has unmet peer dependency "graphql@^14.0.0 || ^15.0.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @graphql-codegen/cli > @graphql-tools/url-loader > graphql-ws@4.9.0" has unmet peer dependency "graphql@>=0.11 <=15".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @graphql-codegen/cli > @graphql-tools/url-loader > subscriptions-transport-ws@0.9.19" has unmet peer dependency "graphql@>=0.10.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @graphql-codegen/typescript > @graphql-codegen/visitor-plugin-common > @graphql-tools/optimize@1.0.1" has unmet peer dependency "graphql@^14.0.0 || ^15.0.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @graphql-codegen/typescript > @graphql-codegen/visitor-plugin-common > @graphql-tools/relay-operation-optimizer@6.3.0" has unmet peer dependency "graphql@^14.0.0 || ^15.0.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @graphql-codegen/typescript > @graphql-codegen/visitor-plugin-common > graphql-tag@2.12.4" has unmet peer dependency "graphql@^0.9.0 || ^0.10.0 || ^0.11.0 || ^0.12.0 || ^0.13.0 || ^14.0.0 || ^15.0.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @chakra-ui/react > toasted-notes > @reach/alert > @reach/component-component@0.1.3" has unmet peer dependency "prop-types@^15.6.2".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @chakra-ui/react > toasted-notes > @reach/alert > @reach/component-component@0.1.3" has incorrect peer dependency "react@^16.4.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @chakra-ui/react > toasted-notes > @reach/alert > @reach/component-component@0.1.3" has incorrect peer dependency "react-dom@^16.4.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @chakra-ui/react > toasted-notes > @reach/alert > @reach/visually-hidden@0.1.4" has incorrect peer dependency "react@^16.8.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @chakra-ui/react > toasted-notes > @reach/alert > @reach/visually-hidden@0.1.4" has incorrect peer dependency "react-dom@^16.8.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @graphql-codegen/cli > @graphql-codegen/core > @graphql-tools/merge > @graphql-tools/schema@7.1.5" has unmet peer dependency "graphql@^14.0.0 || ^15.0.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @graphql-codegen/cli > @graphql-tools/url-loader > @graphql-tools/delegate > @graphql-tools/batch-execute@7.1.2" has unmet peer dependency "graphql@^14.0.0 || ^15.0.0".
warning "workspace-aggregator-b704788a-002c-41ca-90a5-8a70d1c8e65f > @instagram-clone/client > @graphql-codegen/typescript > @graphql-codegen/visitor-plugin-common > @graphql-tools/relay-operation-optimizer > relay-compiler@10.1.0" has unmet peer dependency "graphql@^15.0.0".
