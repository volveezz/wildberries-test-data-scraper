# Wildberries API Test Data Scraper

[English](https://github.com/volveezz/wildberries-test-data-scraper/blob/master/README.md) | Русский

## Обзор

Этот репозиторий предоставляет backend-решение для парсинга тестовых данных с Wildberries API по пути:

```
https://dev.wildberries.ru/openapi/wb-tariffs#tag/Koefficienty-skladov
```

Полученные данные сохраняются локально в PostgreSQL и автоматически переносятся в указанные Google Sheets.

## Содержание

-  [Требования](#требования)
-  [Установка](#установка)
   -  [Клонирование репозитория](#клонирование-репозитория)
-  [Конфигурация](#конфигурация)
-  [Использование](#использование)
-  [Документация API](#документация-api)

## Требования

-  **Node.js** – Убедитесь, что Node.js установлен.
-  **Yarn** – Рекомендуется использовать этот менеджер пакетов.
-  **Docker** – Обязателен для запуска проекта.

## Установка

### Клонирование репозитория

Склонируйте репозиторий и перейдите в его директорию:

```bash
git clone https://github.com/volveezz/wildberries-test-data-scraper.git
cd wildberries-test-data-scraper
```

## Конфигурация

1. **Переменные:**  
   Переименуйте файл `.env.example` в `.env` или создайте новый `.env` на основе примера.

2. **Токен Wildberries API:**  
   Добавьте ваш токен Wildberries API в файл `.env`.

3. **Учетные данные Google:**  
   Скачайте файл `google-credentials.json` из [Google Cloud Console](https://console.cloud.google.com/apis/api/sheets.googleapis.com/credentials) и разместите его в корневой директории проекта.

4. **Google Sheets Ids:**  
   Обновите файл `.env`, указав Id Google таблиц, в которые будут загружаться данные. (it is important that you give edit access to your service account in `google-credentials.json`)

## Использование

Для запуска проекта введите:

```bash
docker compose up
```

> **Примечание:** Приложение работает как CLI-инструмент с выводом некоторых логов в консоль. Пользовательский интерфейс полностью отсутствует, и нет других способов взаимодействия с приложением.
