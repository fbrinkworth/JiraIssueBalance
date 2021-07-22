# JiraIssueBalance
Trabajo de certificación del curso de Programación de contratos inteligentes con solidity de [Blockchain Academy Chile](https://www.blockchainacademy.cl/)
## Requerimientos ##
* node js versión v12+
* npm versión 6+
* yarn versión v1+
* git versión 2+
* pm2
* serve
### Instalar pm2 ###
``` 
npm install -g pm2
```
### Instalar serve ###
``` 
npm install -g serve
```
## Instalar la aplicación ##
### Clonar el repositorio ###
```
git clone https://github.com/fbrinkworth/JiraIssueBalance.git
```
### instalar paquetes necesarios ###
```
cd ./JiraIssueBalance/client
npm install
```
```
cd ./JiraIssueBalance/server
npm install cors-anywhere
```
### realizar el build de la aplicación ###
```
cd ./JiraIssueBalance/client
yarn build
```
## Ejecutar la aplicación ##
Se asume que el directorio actual es donde se clonó el proyecto, es decir JiraIssueBalance.
### Primero iniciar el server que conectará con la instancia de Jira ###
```
pm2 start ./server/src/server.js
```
### Ejecutar la aplicación ###
#### En modo desarrollo ####
```
cd ./client
npm run start
```

#### En modo producción ####
```
cd ./client
serve -s build -l 3000
```
### Usar a aplicación ###
Navegar a [http://localhost:3000/](http://localhost:3000/)
