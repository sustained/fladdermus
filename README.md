# Fladdermus

Fladdermus is my personal Discord bot. She's written in TypeScript, using Klasa which is built on top of discord.js.

## Introduction

The first few versions mostly related to language learning as that was my main interest at the times, so she could do things like:

- exercises relating to evaluating one's proficiency in a language
- conjugating verbs etc.
- looking up word in dictionaries, on Wiktionary etc.
- and so on

### Why "Fladdermus"?

Fladdermus is the Swedish word for bat and Swedish is my [L2](https://en.wikipedia.org/wiki/Second_language). :bat:

I don't particularly like bats (except Fladdermus) but it's just a fun word.

It roughly translates as "flapping mouse". I know, right?

### Why version 4?

I'm learning [Klasa](https://klasa.js.org/#/) to replace my old friend Commando and I decided to relearn [TypeScript](https://www.typescriptlang.org/) simultaneously, so... I needed a project.

### Where are versions 1 through 3?

Those repositories are private.

## Documentation

There are READMEs in every directory, which will give you a brief overview of what that directory contains.

The code will also be at least somewhat reasonably well-commented, so feel free to read the source.

## Installation

### Setup

```
cp .env.example .env # Copy the example dotenv file
code .env            # Configure the bot in your editor of choice
```

#### Required environmental variables

- `NODE_ENV` - Either `development` or `production`
- `CLIENT_ID` - [The client ID of your Discord application](https://discordjs.guide/preparations/setting-up-a-bot-application.html)
- `OWNER_ID` - [The ID of your Discord user account](https://support.discordapp.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-)
- `TOKEN` - [The bot token for your Discord application's bot user](https://discordjs.guide/preparations/setting-up-a-bot-application.html)

### Install Dependencies

```
npm install
```

### Compilation

```
npm run build
```

### Running

```
npm run start
```
