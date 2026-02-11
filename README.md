# Tender

**Парсер данных с отображением на карте**  
Серверное приложение на Node.js для сбора и визуализации информации о тендерах или других объектах на интерактивной карте.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![Leaflet](https://img.shields.io/badge/Leaflet-199900?style=for-the-badge&logo=leaflet&logoColor=white)

## О проекте
Веб-приложение для парсинга данных и их последующего отображения на карте.  
На основе структуры и описания можно предположить следующий функционал:
- Сбор данных с внешних источников (парсер).
- Обработка и структурирование полученной информации.
- Отображение объектов на интерактивной карте.
- Серверная часть на Node.js.


## Технологии
- **Node.js** — серверная среда выполнения.
- **JavaScript (ES6+)** — логика парсинга и API.
- **Express** — веб-фреймворк для Node.js.
- **Яндекс Карты** — отображение карты.
- **Axios / node-fetch** — HTTP-запросы для парсинга.

## Структура проекта
```
Tender/
├── server.js # Основной серверный файл
├── package.json # Зависимости и скрипты
├── package-lock.json # Фиксация версий зависимостей
├── .gitattributes # Настройки Git
├── .gitignore # Исключённые файлы
└── README.md # Описание проекта
```
