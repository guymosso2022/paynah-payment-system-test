# Paynah Payment System Test

Système de microservices pour la gestion des comptes, transactions et paiements, basé sur **NestJS**, **Kafka**, **CQRS** et **Event Sourcing**.

---

## Architecture

Le projet suit une architecture **hexagonale** avec séparation claire entre les couches **Domain**, **Application**, **Infrastructure** et **Interface**.

### Services principaux

| Service | Description |
|---------|-------------|
| **Account Service** | Gestion des comptes (création, crédit, débit, solde). |
| **Payment Service** | Gestion des paiements entre comptes, orchestration des transactions. |
| **Transaction Service** | Suivi et persistance des transactions issues des événements Kafka. |

### Couche Domain

- Contient les **entités**, **value objects**, **ports** et **événements de domaine**.
- Exemple : `Account`, `Payment`, `Transaction`, `PaymentCreatedEvent`.

### Couche Application

- Implémente les **commands**, **command handlers** et services applicatifs.
- Contient la logique métier orchestrant les opérations entre les entités et les ports.

### Couche Infrastructure

- Implémente les **ports** (Kafka, Repositories, Prisma, etc.).
- Fournit la persistance, la consommation et la production d’événements.

### Couche Interface (REST / Kafka)

- Expose les **endpoints REST** via des contrôleurs NestJS.

---

## Installation et Lancement

1. Prérequis

- Node.js >= 20
- Docker & Docker Compose
- PostgreSQL ou base compatible

2. Configuration

Créer le fichier `.env` à partir du modèle :
j'ai mis un template modele `.env.template` pour vous donner les variables d'environnents que vous avez besion

```bash
cp .env.template .env

# Database
DATABASE_URL=postgresql://user:password@host:port_postgresql/bd_name?schema=public

# Kafka
KAFKA_BROKER=localhost:9092
KAFKA_CLIENT_ID=payment-service
KAFKA_GROUP_ID=payment-group

# Application
PORT=3000
NODE_ENV=development

3. Lancer Kafka via Docker

docker-compose up 


4. Installer les dépendances

cd account-service && npm install
cd ../payment-service && npm install
cd ../transaction-service && npm install

5. Generer les migrations

npm run db:generate:migration

si vous vous faire une creation et une migration

npm run db:create:migration
npm run db:generate:migration


6. Lancer les services

# Account Service
cd account-service
npm run start:dev 

# Payment Service
cd payment-service
npm run start:dev 

# Transaction Service
cd transaction-service
npm run start:dev

Chaque microservice se connecte à Kafka pour écouter/produire les événements.


Tests

7. Exécuter les tests unitaires :

# Payment Service
cd payment-service
npm run test

# Transaction Service
cd transaction-service
npm run test

# Account Service
cd account-service
npm run test


8. Swagger / API Documentation

  http://localhost:<PORT>/api/docs


9. Justification des choix techniques

   Account Service / Payment Service  / Transaction Service
   
   NestJS + REST Controllers :  Expose facilement les endpoints HTTP pour le front ou    Postman/Swagger.

   CQRS (Command/Query Bus) :  Sépare clairement les commandes (écriture) et les requêtes (lecture) pour plus de clarté et évolutivité.

   Kafka (Events) : Permet de notifier Transaction Service et Payment Service de manière asynchrone sans blocage.

   Hexagonal Architecture (Ports & Adapters): Découple la logique métier des dépendances (DB, Kafka, calculs), facilitant les tests et le replacement d’implémentations.

  Prisma : ORM moderne pour la persistance des données avec migrations faciles.

   Hexagonal Architecture : separation claire des responsibilities, facilite le test unitaire et l’évolutivité.

   Docker Compose : simplifie le déploiement et le démarrage des services et Kafka.

