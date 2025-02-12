# Wildberries API Test Data Scraper

English | [Русский](https://github.com/volveezz/wildberries-test-data-scraper/blob/master/README_ru.md)

## Overview

This repository offers a backend solution that scrapes data from the Wildberries API endpoint:

```
https://dev.wildberries.ru/openapi/wb-tariffs%23tag/Koefficienty-skladov
```

The scraped data is stored locally in a PostgreSQL database and also transferred into predefined Google Sheets.

## Table of Contents

-  [Requirements](#requirements)
-  [Installation](#installation)
   -  [Cloning the Repository](#cloning-the-repository)
-  [Configuration](#configuration)
-  [Usage](#usage)
   -  [Production Build](#production-build)
   -  [Development Build](#development-build)
-  [API Documentation](#api-documentation)

## Requirements

-  **Node.js**: Ensure Node.js is installed.
-  **Yarn**: Recommended as the package manager.
-  **Docker**: Required for launching the project.

## Installation

### Cloning the Repository

Clone the repository and navigate into the project directory:

```bash
git clone https://github.com/volveezz/wildberries-test-data-scraper.git
cd wildberries-test-data-scraper
```

## Configuration

1. **Environment Variables:**  
   Rename `.env.example` to `.env` or create a new `.env` file based on the example provided.

2. **Paste Wildberries API token:**
   Paste your Wildberries API token into `.env` file.

3. **Google Credentials:**  
   Download your `google-credentials.json` from the [Google Cloud Console](https://console.cloud.google.com/apis/api/sheets.googleapis.com/credentials) and place it in the project's root directory.

4. **Google Sheets Ids:**  
   Update your `.env` file with the Id of every Google Sheets document where the data will be auto-populated. ()

## Usage

To run the project, execute the following command:

```bash
docker compose up
```

> **Note:** This application operates as a CLI tool with log outputs in the console. There is no UI or any other way to interact with the app.
