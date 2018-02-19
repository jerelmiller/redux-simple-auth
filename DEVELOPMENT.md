# Developing Redux Simple Auth

The Redux Simple Auth library is a mono-repo that is managed using 
[Yarn Workspaces] in combination with [Lerna]. That means that we can actually 
publish several packages to npm from the same codebase, at this point in time
[`redux-simple-auth`] is the only package.

## Installation

To get started developing, run the installation command in the project root to 
get the required developer tooling installed:

```
yarn install
```

Then get all the packages ready for development:  

```
lerna bootstrap
```

You can then execute npm scripts in all packages at once from the project root 
using lerna:

```
lerna run (clean|lint|test|build)
```

## Resources

As far as i can tell, using yarn workspaces is still an alpha feature (there 
isn't that much documentation around it's usage), so the following is a list
of resources that i referred to when combining workspaces with lerna:

* Example repo for [Yarn with Lerna]

[Yarn Workspaces]: https://yarnpkg.com/lang/en/docs/workspaces/
[Lerna]: https://github.com/lerna/lerna
[`redux-simple-auth`]: ./packages/redux-simple-auth/README.md
[Yarn with Lerna]: https://github.com/Quramy/lerna-yarn-workspaces-example
