# Project setup
## Commands used to set up this project
```
npm init
npm install webpack webpack-cli --save-dev
npm install react react-dom --save
npm install typescript --save-dev
npm install @babel/core babel-loader @babel/preset-react @babel/preset-typescript @babel/preset-env @babel/plugin-proposal-class-properties @babel/plugin-proposal-object-rest-spread --save-dev
npm install css-loader style-loader --save-dev
npm install html-webpack-plugin --save-dev
npm install webpack-dev-server --save-dev
npm install tslint tslint-immutable --save-dev
npm install @types/react @types/react-dom
```

## Workaround the TypeScript typing file
Aside note about typing files (types.d.ts): the TypeScript compiler will complain when you install a package without its typing files. This is annoying because not all npm packages have typings files, so TypeScript will complain about the module not existing. An easy, albeit hacky way to deal with this is to create an override.d.ts file in /react-typescript-boilerplate/typings and typing: 
'''
declare module package-with-no-typings-file
'''
 This way you will be able to use the package without the IDE complaining, but you won't have types.

 ## Create the .babelrc file to transpile the code
Creat this file under the root
```
{
    "presets": [
        "@babel/preset-env",
        "@babel/preset-typescript",
        "@babel/preset-react"
    ],
    "plugins": [
        "@babel/proposal-class-properties",
        "@babel/proposal-object-rest-spread"
    ]
}
```

## Create the tsconfig.json file

## Create the tslint.json

## Handle CSS images
```
npm install url-loader file-loader --save-dev
```
Add this section to the webpack.config.js
```
       {
            test: /\.(png|jp(e*)g|svg)$/,  
            use: [{
                loader: 'url-loader',
                options: { 
                    limit: 8000, // Convert images < 8kb to base64 strings
                    name: 'images/[hash]-[name].[ext]'
                } 
            }]
        }
```

# Sharing TS files with the Angular project
Install this
```
npm install --save @types/request
```
1. UI Components: Move the HTML segment into the TSX files



