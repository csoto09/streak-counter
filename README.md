# `@csoto09/streak-counter` - a basic streak counter

This is a basic streak counter - inspired by Duolingo - written in TypeScript and meant for the browser (uses `localStorage`)

## Install

```shell
yarn add @csoto09/streak-counter
```

or

```shell
npm install @csoto09/streak-counter
```

## Usage

```jsx
import {streakCounter} from '@csoto09/streak-counter'

const today = new Date()
const streak = streakCounter(localStorage, today)
// streak return an object:
// {
//     currentCount: 1,
//     lastLoginDate: "11/11/2021",
//     startDate: "11/11/2021",
// }
```
